package com.COLive.Services

import com.COLive.Models.RolToken
import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import com.mongodb.client.model.Filters
import com.mongodb.client.model.Indexes
import com.mongodb.client.model.IndexOptions
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.result.{UpdateResult, DeleteResult}
import com.mongodb.reactivestreams.client.{MongoClients, MongoClient, MongoDatabase, MongoCollection}
import org.bson.codecs.configuration.CodecRegistries.{fromProviders, fromRegistries}
import org.bson.codecs.configuration.{CodecRegistry, CodecRegistries}
import org.bson.codecs.pojo.PojoCodecProvider
import org.reactivestreams.{Subscriber, Subscription}

import scala.concurrent.{Future, Promise, ExecutionContext}

object RolTokenService {
  // Leer variables de entorno
  private val mongoUri  = sys.env.getOrElse("MONGO_URI", 
    throw new RuntimeException("Falta MONGO_URI en variables de entorno"))
  private val secretKey = sys.env.getOrElse("SMTP_SECRET_KEY",
    throw new RuntimeException("Falta SMTP_SECRET_KEY en variables de entorno"))

  // Configurar codec registry para POJO
  private val pojoProvider: PojoCodecProvider = PojoCodecProvider.builder()
    .register(classOf[RolToken])
    .automatic(true)
    .build()

  private val codecRegistry: CodecRegistry = fromRegistries(
    MongoClientSettings.getDefaultCodecRegistry,
    fromProviders(pojoProvider)
  )

  private val settings: MongoClientSettings = MongoClientSettings.builder()
    .applyConnectionString(new ConnectionString(mongoUri))
    .codecRegistry(codecRegistry)
    .build()

  private val client: MongoClient = MongoClients.create(settings)
  private val db: MongoDatabase = client.getDatabase("registro").withCodecRegistry(codecRegistry)
  private val collection: MongoCollection[RolToken] =
    db.getCollection("rol_tokens", classOf[RolToken])

  // Crear índice único sobre "token"
  collection.createIndex(
    Indexes.ascending("token"),
    new IndexOptions().unique(true).name("idx_token_unique")
  ).subscribe(new Subscriber[String] {
    override def onSubscribe(s: Subscription): Unit = s.request(1)
    override def onNext(name: String): Unit         = println(s"Índice creado: $name")
    override def onError(t: Throwable): Unit        = println(s"Error creando índice: $t")
    override def onComplete(): Unit                 = ()
  })

  /** Guarda o actualiza un RolToken (upsert) */
  def guardarRolToken(doc: RolToken)(implicit ec: ExecutionContext): Future[Unit] = {
    val filtro = Filters.eq("token", doc.token)
    val publisher = collection.replaceOne(filtro, doc, new ReplaceOptions().upsert(true))

    val p = Promise[Unit]()
    publisher.subscribe(new Subscriber[UpdateResult] {
      override def onSubscribe(s: Subscription): Unit      = s.request(1)
      override def onNext(res: UpdateResult): Unit        = p.trySuccess(())
      override def onError(e: Throwable): Unit            = p.tryFailure(e)
      override def onComplete(): Unit                      = ()
    })
    p.future
  }

  /** Obtiene el idRol asociado a un token */
  def obtenerRolToken(token: String)(implicit ec: ExecutionContext): Future[Option[Int]] = {
    val publisher = collection.find(Filters.eq("token", token)).first()
    val p         = Promise[Option[RolToken]]()

    publisher.subscribe(new Subscriber[RolToken] {
      private var received: Option[RolToken] = None
      override def onSubscribe(s: Subscription): Unit = s.request(1)
      override def onNext(rt: RolToken): Unit         = received = Some(rt)
      override def onError(e: Throwable): Unit        = p.failure(e)
      override def onComplete(): Unit                 = p.success(received)
    })

    p.future.map(_.map(_.idRol))
  }

  /** Elimina un RolToken por su token */
  def eliminarRolToken(token: String)(implicit ec: ExecutionContext): Future[Unit] = {
    val publisher = collection.deleteOne(Filters.eq("token", token))
    val p         = Promise[Unit]()

    publisher.subscribe(new Subscriber[DeleteResult] {
      override def onSubscribe(s: Subscription): Unit      = s.request(1)
      override def onNext(_ignored: DeleteResult): Unit = p.trySuccess(())
      override def onError(e: Throwable): Unit            = p.tryFailure(e)
      override def onComplete(): Unit                      = ()
    })

    p.future
  }
}
