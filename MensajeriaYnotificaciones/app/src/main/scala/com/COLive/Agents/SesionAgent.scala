package com.COLive.Agents

import akka.actor.typed.{ActorRef, ActorSystem, Behavior}
import akka.actor.typed.scaladsl.Behaviors
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.model.StatusCodes
import akka.actor.typed.scaladsl.AskPattern._
import akka.util.Timeout
import spray.json._
import spray.json.DefaultJsonProtocol._
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}

/** Modelos y JsonSupport compartido para sesiones */
final case class Token(token: String)
final case class OperationResult(success: Boolean, message: String)

trait JsonSupport {
  import spray.json.RootJsonFormat
  implicit val tokenFormat: RootJsonFormat[Token]                     = jsonFormat1(Token.apply)
  implicit val operationResultFormat: RootJsonFormat[OperationResult] = jsonFormat2(OperationResult.apply)
}

/**
 * Actor que gestiona tokens de sesión: crear, verificar, refrescar, eliminar.
 * TTL: 1 hora. Cada 10 min purga expirados.
 */
object SesionAgent {
  // Comandos
  sealed trait Command
  final case class SetSesionToken(token: String, replyTo: ActorRef[OperationResult])    extends Command
  final case class ActiveSesionToken(token: String, replyTo: ActorRef[OperationResult]) extends Command
  final case class DeleteSesionToken(token: String, replyTo: ActorRef[OperationResult]) extends Command
  final case class RefreshSesionToken(token: String, replyTo: ActorRef[OperationResult]) extends Command

  private case object Cleanup extends Command

  private val TTL_MILLIS: Long = 60 * 60 * 1000

  def apply(): Behavior[Command] =
    Behaviors.withTimers { timers =>
      timers.startTimerAtFixedRate(Cleanup, 10.minutes)
      active(Map.empty)
    }

  private def active(tokens: Map[String, Long]): Behavior[Command] =
    Behaviors.receive { (context, message) =>
      message match {
        case SetSesionToken(token, replyTo) =>
          val expiry = System.currentTimeMillis() + TTL_MILLIS
          replyTo ! OperationResult(success = true, message = s"Token registrado; expira en $expiry")
          active(tokens + (token -> expiry))

        case ActiveSesionToken(token, replyTo) =>
          val now = System.currentTimeMillis()
          tokens.get(token) match {
            case Some(expiry) if expiry > now =>
              replyTo ! OperationResult(success = true, message = "Acceso concedido")
              Behaviors.same
            case Some(_) =>
              replyTo ! OperationResult(success = false, message = "Token expirado")
              active(tokens - token)
            case None =>
              replyTo ! OperationResult(success = false, message = "Token no encontrado")
              Behaviors.same
          }

        case RefreshSesionToken(token, replyTo) =>
          val now = System.currentTimeMillis()
          tokens.get(token) match {
            case Some(expiry) if expiry > now =>
              val newExpiry = now + TTL_MILLIS
              replyTo ! OperationResult(success = true, message = s"Token refrescado; nuevo expiry en $newExpiry")
              active(tokens + (token -> newExpiry))
            case Some(_) =>
              replyTo ! OperationResult(success = false, message = "Token expirado, no se puede refrescar")
              active(tokens - token)
            case None =>
              replyTo ! OperationResult(success = false, message = "Token no existe, no se puede refrescar")
              Behaviors.same
          }

        case DeleteSesionToken(token, replyTo) =>
          if tokens.contains(token) then
            replyTo ! OperationResult(success = true, message = "Token eliminado")
            active(tokens - token)
          else
            replyTo ! OperationResult(success = false, message = "Token no encontrado")
            Behaviors.same

        case Cleanup =>
          val now = System.currentTimeMillis()
          val cleaned = tokens.filter { case (_, expiry) => expiry > now }
          active(cleaned)
      }
    }
}

/**
 * Rutas HTTP para SesionAgent, bajo /msg/sesion.
 */
object SesionAgentRoutes extends JsonSupport {
  def route(actor: ActorRef[SesionAgent.Command])(implicit system: ActorSystem[_]): Route = {
    implicit val timeout: Timeout = Timeout(3.seconds)
    implicit val ec: ExecutionContext = system.executionContext
    implicit val scheduler = system.scheduler

    pathPrefix("msg" / "sesion") {
      concat(
        // POST /msg/sesion/crear  JSON {"token":"..."}
        path("crear") {
          post {
            entity(as[Token]) { (dto: Token) =>
              val resultF: Future[OperationResult] =
                actor.ask(ref => SesionAgent.SetSesionToken(dto.token, ref))
              onSuccess(resultF) { result =>
                if result.success then
                  complete(StatusCodes.Created, result.message)
                else
                  complete(StatusCodes.InternalServerError, result.message)
              }
            }
          }
        },
        // GET /msg/sesion/activo/{token}
        path("activo" / Segment) { token =>
          get {
            val resultF: Future[OperationResult] =
              actor.ask(ref => SesionAgent.ActiveSesionToken(token, ref))
            onSuccess(resultF) { result =>
              if result.success then
                complete(StatusCodes.OK, result.message)
              else
                complete(StatusCodes.Unauthorized, result.message)
            }
          }
        },
        // PUT /msg/sesion/refrescar/{token}
        path("refrescar" / Segment) { token =>
          put {
            val resultF: Future[OperationResult] =
              actor.ask(ref => SesionAgent.RefreshSesionToken(token, ref))
            onSuccess(resultF) { result =>
              if result.success then
                complete(StatusCodes.OK, result.message)
              else
                complete(StatusCodes.Unauthorized, result.message)
            }
          }
        },
        // DELETE /msg/sesion/{token}
        path(Segment) { token =>
          delete {
            val resultF: Future[OperationResult] =
              actor.ask(ref => SesionAgent.DeleteSesionToken(token, ref))
            onSuccess(resultF) { result =>
              if result.success then
                complete(StatusCodes.OK, result.message)
              else
                complete(StatusCodes.NotFound, result.message)
            }
          }
        }
      )
    }
  }
}