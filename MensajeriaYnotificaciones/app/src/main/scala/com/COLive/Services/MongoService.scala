package com.COLive.Services

import com.COLive.Models.{SalidaCorreo, SalidaCorreoConfig, CorreoEnCola}
import com.COLive.Utils.CryptoUtil

import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import com.mongodb.client.model.Filters
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.result.UpdateResult
import com.mongodb.client.result.InsertOneResult
import com.mongodb.client.result.DeleteResult
import com.mongodb.reactivestreams.client.{MongoClients, MongoClient, MongoDatabase, MongoCollection}
import org.bson.codecs.configuration.{CodecRegistry, CodecRegistries}
import org.bson.codecs.configuration.CodecRegistries.{fromProviders, fromRegistries}
import org.bson.codecs.pojo.PojoCodecProvider

import scala.concurrent.{Future, Promise}
import scala.concurrent.ExecutionContext
import org.reactivestreams.Publisher

import akka.actor.typed.ActorSystem
import akka.stream.scaladsl.Source
import akka.stream.{Materializer, SystemMaterializer}
import org.bson.types.ObjectId

object MongoService {
  // Leer variables de entorno
  private val mongoUri  = sys.env.getOrElse("MONGO_URI", 
    throw new RuntimeException("Falta MONGO_URI en variables de entorno"))
  private val secretKey = sys.env.getOrElse("SMTP_SECRET_KEY",
    throw new RuntimeException("Falta SMTP_SECRET_KEY en variables de entorno"))

  // Configurar codec registry para POJO
  private val pojoCodecProvider = PojoCodecProvider.builder()
    .register(classOf[SalidaCorreo]) 
    .register(classOf[CorreoEnCola])
    .automatic(true)
    .build()

  private val codecRegistry = fromRegistries(
    MongoClientSettings.getDefaultCodecRegistry,
    fromProviders(pojoCodecProvider)
  )

  private val settings = MongoClientSettings.builder()
    .applyConnectionString(new ConnectionString(mongoUri))
    .codecRegistry(codecRegistry)
    .build()
  private val client = MongoClients.create(settings)
  private val database = client.getDatabase("correos").withCodecRegistry(codecRegistry)
  private val collection = database.getCollection("salida_correos", classOf[SalidaCorreo])
  private val colaCollection = database.getCollection("cola_envio", classOf[CorreoEnCola])


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

  /** Lista todos los documentos SalidaCorreo como Source, usando Akka Typed. */
  def listarTodos()(using system: ActorSystem[?]): Source[SalidaCorreo, ?] = {
    implicit val mat: Materializer = SystemMaterializer(system).materializer
    implicit val ec: ExecutionContext = system.executionContext

    Source.fromPublisher(collection.find())
  }

  def agregarAColaEnvio(de: String, para: String, asunto: String, cuerpo: String)
                       (implicit ec: ExecutionContext): Future[ObjectId] = {
    val correo = CorreoEnCola(
      de = de,
      para = para,
      asunto = asunto,
      cuerpo = cuerpo
    )
    val promise = Promise[ObjectId]()
    colaCollection.insertOne(correo).subscribe(new org.reactivestreams.Subscriber[InsertOneResult] {
      override def onSubscribe(s: org.reactivestreams.Subscription): Unit = s.request(1)
      override def onNext(result: InsertOneResult): Unit = promise.success(correo.id)
      override def onError(t: Throwable): Unit = promise.failure(t)
      override def onComplete(): Unit = ()
    })
    promise.future
  }

  def obtenerPrimerCorreoEnCola()(implicit ec: ExecutionContext): Future[Option[CorreoEnCola]] = {
    val promise = Promise[Option[CorreoEnCola]]()
    colaCollection.find().first().subscribe(new org.reactivestreams.Subscriber[CorreoEnCola] {
      private var received: Option[CorreoEnCola] = None
      override def onSubscribe(s: org.reactivestreams.Subscription): Unit = s.request(1)
      override def onNext(result: CorreoEnCola): Unit = received = Some(result)
      override def onError(t: Throwable): Unit = promise.failure(t)
      override def onComplete(): Unit = promise.success(received)
    })
    promise.future
  }

  def eliminarDeColaEnvio(id: ObjectId)(implicit ec: ExecutionContext): Future[Unit] = {
    val promise = Promise[Unit]()
    colaCollection.deleteOne(Filters.eq("_id", id)).subscribe(new org.reactivestreams.Subscriber[DeleteResult] {
      override def onSubscribe(s: org.reactivestreams.Subscription): Unit = s.request(1)
      override def onNext(result: DeleteResult): Unit = ()
      override def onError(t: Throwable): Unit = promise.failure(t)
      override def onComplete(): Unit = promise.success(())
    })
    promise.future
  }
}