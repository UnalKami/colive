package com.COLive.Actores

import akka.actor.typed.{ActorRef, ActorSystem, Behavior}
import akka.actor.typed.scaladsl.Behaviors
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}

import spray.json._
//Modelos de datos
final case class Token(token: String)
final case class OperationResult(success: Boolean, message: String)

trait JsonSupport extends DefaultJsonProtocol {
  implicit val tokenFormat: RootJsonFormat[Token]                     = jsonFormat1(Token.apply)
  implicit val operationResultFormat: RootJsonFormat[OperationResult] = jsonFormat2(OperationResult.apply)
}

/**
 * Actor que gestiona los tokens de sesión.
 * Permite crear, verificar, eliminar y refrescar tokens.
  
  POST /sesion/token acepta JSON {"token":"abc"} y responde 201 Created.

  GET /sesion/activo/{token} responde 200 OK o 401 Unauthorized.

  PUT /sesion/refrescar/{token} responde 200 OK o 401 Unauthorized.

  DELETE /sesion/{token} responde 200 OK o 404 Not Found.

 */
object SesionActor extends JsonSupport{
  // Comandos que recibe el actor
  sealed trait Command
  final case class SetSesionToken(token: String, replyTo: ActorRef[OperationResult])    extends Command
  final case class ActiveSesionToken(token: String, replyTo: ActorRef[OperationResult]) extends Command
  final case class DeleteSesionToken(token: String, replyTo: ActorRef[OperationResult]) extends Command
  final case class RefreshSesionToken(token: String, replyTo: ActorRef[OperationResult]) extends Command
 
  case object Cleanup extends Command

  // TTL por defecto: 1 hora
  private val TTL: Long = 60 * 60 * 1000

  // Crea el actor con comportamiento inicial
  def apply(): Behavior[Command] =
    Behaviors.withTimers { timers =>
      // cada 10 minutos manda Cleanup
      timers.startTimerAtFixedRate(Cleanup, 10.minutes)
      active(Map.empty)
    }

  // Comportamiento recursivo con mapa de tokens -> expiry
  private def active(tokens: Map[String, Long]): Behavior[Command] =
    Behaviors.receiveMessage {
      case SetSesionToken(token, replyTo) =>
        val expiry = System.currentTimeMillis() + TTL
        replyTo ! OperationResult(success = true, s"Token registrado; expira en $expiry")
        active(tokens + (token -> expiry))

      case ActiveSesionToken(token, replyTo) =>
        val now = System.currentTimeMillis()
        tokens.get(token) match {
          case Some(expiry) if expiry > now =>
            replyTo ! OperationResult(success = true, "Acceso concedido")
            Behaviors.same
          case Some(_) =>
            replyTo ! OperationResult(success = false, "Token expirado")
            active(tokens - token)
          case None =>
            replyTo ! OperationResult(success = false, "Token no encontrado")
            Behaviors.same
        }

      case DeleteSesionToken(token, replyTo) =>
        if (tokens.contains(token)) {
          replyTo ! OperationResult(success = true, "Token eliminado")
          active(tokens - token)
        } else {
          replyTo ! OperationResult(success = false, "Token no encontrado")
          Behaviors.same
        }

      case RefreshSesionToken(token, replyTo) =>
        val now = System.currentTimeMillis()
        tokens.get(token) match {
          case Some(expiry) if expiry > now =>
            val newExpiry = now + TTL
            replyTo ! OperationResult(success = true, s"Token refrescado; nuevo expiry en $newExpiry")
            active(tokens + (token -> newExpiry))
          case Some(_) =>
            replyTo ! OperationResult(success = false, "Token expirado, no se puede refrescar")
            active(tokens - token)
          case None =>
            replyTo ! OperationResult(success = false, "Token no existe, no se puede refrescar")
            Behaviors.same
        }

      case Cleanup =>
        val now     = System.currentTimeMillis()
        val cleaned = tokens.filter { case (_, expiry) => expiry > now }
        active(cleaned)
    }

  // Rutas HTTP RESTful
  def route(actor: ActorRef[Command])(implicit system: ActorSystem[?]): Route = {
    import akka.actor.typed.scaladsl.AskPattern._
    import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
    import SesionActor._
    import scala.util.{Success, Failure}


    implicit val timeout: akka.util.Timeout = 3.seconds
    implicit val ec: ExecutionContext     = system.executionContext
    implicit val scheduler                = system.scheduler

    pathPrefix("sesion") {
      concat(
        // POST /sesion/crear  --> crea token {token: "<token>"}
        path("crear") {
          post {
            entity(as[Token]) { req =>
              val result = actor.ask(ref => SetSesionToken(req.token, ref))
              onComplete(result) {
                case scala.util.Success(OperationResult(success, message)) =>
                  if (success) complete(StatusCodes.Created, message)
                  else complete(StatusCodes.InternalServerError, message)
                case _ =>
                  complete(StatusCodes.InternalServerError, "Error interno")
              }
            }
          }
        },

        // GET /sesion/activo/{token}  --> verifica token
        path("activo" / Segment) { token =>
          get {
            val result : Future[OperationResult] = actor.ask(ref => ActiveSesionToken(token, ref))
            onComplete(result) {
              case Success(OperationResult(success, message)) =>
                if (success) {
                  complete(StatusCodes.OK, message)
                } else {
                  complete(StatusCodes.Unauthorized, message)
                }
              case _ =>
                complete(StatusCodes.InternalServerError, "Error interno")
            }
          }
        },

        // PUT /sesion/refrescar/{token}  --> refresca token
        path("refrescar" / Segment) { token =>
          put {
            val result: Future[OperationResult] = actor.ask(ref => RefreshSesionToken(token, ref))
            onComplete(result) {
              case Success(OperationResult(success, message)) =>
                if (success) {
                  complete(StatusCodes.OK, message)
                } else {
                  complete(StatusCodes.Unauthorized, message)
                }
              case _ =>
                complete(StatusCodes.InternalServerError, "Error interno")
            }
          }
        },

        // DELETE /sesion/{token}  --> elimina token
        path(Segment) { token =>
          delete {
            val result: Future[OperationResult] = actor.ask(ref => DeleteSesionToken(token, ref))
            onComplete(result) {
              case Success(OperationResult(success, message)) =>
                if (success) {
                  complete(StatusCodes.OK, message)
                } else {
                  complete(StatusCodes.NotFound, message)
                }
              case _ =>
                complete(StatusCodes.InternalServerError, "Error interno")
            }
          }
        }
      )
    }
  }
}