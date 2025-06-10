package com.COLive.Services

import com.COLive.Models.{SalidaCorreo, SalidaCorreoConfig}
import com.COLive.Utils.CryptoUtil

import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import com.mongodb.client.model.Filters
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.result.UpdateResult
import com.mongodb.reactivestreams.client.{MongoClients, MongoClient, MongoDatabase, MongoCollection}
import org.bson.codecs.configuration.CodecRegistries.{fromProviders, fromRegistries}
import org.bson.codecs.pojo.PojoCodecProvider

import scala.concurrent.{Future, Promise}
import scala.concurrent.ExecutionContext
import org.reactivestreams.Publisher

object MongoService {
  // Leer variables de entorno
  private val mongoUri  = sys.env.getOrElse("MONGO_URI", "mongodb://localhost:27017")
  private val secretKey = sys.env.getOrElse("SMTP_SECRET_KEY",
    throw new RuntimeException("Falta SMTP_SECRET_KEY en variables de entorno"))

  // Configurar codec registry para POJO
  private val pojoCodecProvider = PojoCodecProvider.builder().automatic(true).build()
  private val codecRegistry = fromRegistries(
    fromProviders(pojoCodecProvider),
    MongoClientSettings.getDefaultCodecRegistry
  )

  // Crear MongoClient Reactive Streams
  private val connectionString = new ConnectionString(mongoUri)
  // Si la URI incluye /dbname, getDatabase devuelve ese nombre; si no, usamos "correos" por defecto.
  private val dbName = Option(connectionString.getDatabase).filter(_.nonEmpty).getOrElse("correos")
  private val settings = MongoClientSettings.builder()
    .applyConnectionString(connectionString)
    .codecRegistry(codecRegistry)
    .build()
  private val client: MongoClient = MongoClients.create(settings)
  private val database: MongoDatabase = client.getDatabase(dbName)

  private val collection: MongoCollection[SalidaCorreo] =
    database.getCollection("salida_correos", classOf[SalidaCorreo])

  /** Guarda o actualiza la configuración SMTP en Mongo.
    * Retorna Future[UpdateResult] del replaceOne(upsert=true).
    */
  def guardarCorreo(email: String, smtpHost: String, smtpPort: Int, username: String, password: String)
                   (implicit ec: ExecutionContext): Future[UpdateResult] = {
    val encrypted = CryptoUtil.encrypt(secretKey, password)
    val doc = SalidaCorreo(email, smtpHost, smtpPort, username, encrypted)

    val publisher: Publisher[UpdateResult] =
      collection.replaceOne(
        Filters.eq("email", email),
        doc,
        new ReplaceOptions().upsert(true)
      )

    val promise = Promise[UpdateResult]()
    publisher.subscribe(new org.reactivestreams.Subscriber[UpdateResult] {
      override def onSubscribe(s: org.reactivestreams.Subscription): Unit = s.request(1)
      override def onNext(result: UpdateResult): Unit = promise.success(result)
      override def onError(t: Throwable): Unit = promise.failure(t)
      override def onComplete(): Unit = () // no-op
    })
    promise.future
  }

  /** Obtiene configuración SMTP desde Mongo, descifra password y la envuelve en SalidaCorreoConfig. */
  def obtenerCorreoConfig(email: String)(implicit ec: ExecutionContext): Future[Option[SalidaCorreoConfig]] = {
    val publisher: Publisher[SalidaCorreo] = collection.find(Filters.eq("email", email)).first()

    val promise = Promise[Option[SalidaCorreo]]()
    publisher.subscribe(new org.reactivestreams.Subscriber[SalidaCorreo] {
      private var received: Option[SalidaCorreo] = None
      override def onSubscribe(s: org.reactivestreams.Subscription): Unit = s.request(1)
      override def onNext(result: SalidaCorreo): Unit = received = Some(result)
      override def onError(t: Throwable): Unit = promise.failure(t)
      override def onComplete(): Unit = promise.success(received)
    })

    promise.future.flatMap {
      case None => Future.successful(None)
      case Some(dbObj) =>
        // Descifrar la contraseña
        val plain = try {
          CryptoUtil.decrypt(secretKey, dbObj.passwordCipher)
        } catch {
          case ex: Throwable =>
            return Future.failed(new RuntimeException(s"Error descifrando password: ${ex.getMessage}"))
        }
        Future.successful(Some(
          SalidaCorreoConfig(
            email = dbObj.email,
            smtpHost = dbObj.smtpHost,
            smtpPort = dbObj.smtpPort,
            username = dbObj.username,
            passwordPlain = plain
          )
        ))
    }
  }

  /** Lista todos los documentos SalidaCorreo como Source, usando Akka Streams. */
  def listarTodos()(implicit system: akka.actor.ActorSystem, ec: ExecutionContext): akka.stream.scaladsl.Source[SalidaCorreo, _] = {
    import akka.stream.scaladsl.Source
    // collection.find() ya es un Publisher[SalidaCorreo]
    Source.fromPublisher(collection.find())
  }
}