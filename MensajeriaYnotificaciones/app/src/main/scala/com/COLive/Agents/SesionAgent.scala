package com.COLive.Agents

import akka.actor.typed.{ActorRef, ActorSystem, Behavior}
import akka.actor.typed.scaladsl.AskPattern._
import akka.actor.typed.scaladsl.{Behaviors, TimerScheduler}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.model.RemoteAddress
import akka.util.Timeout

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}

import com.COLive.Models.{Token, TokenRequest, OperationResult}
import com.COLive.JsonSupport._ 
import java.net.InetAddress

/**
 * Actor que gestiona tokens de sesión: crear, verificar, refrescar, eliminar.
 * TTL: 1 hora. Cada 10 min purga expirados.
 */
object SesionAgent {
  // Comandos
  sealed trait Command
  final case class SetSesionToken(token: Token, replyTo: ActorRef[OperationResult])    extends Command
  final case class ActiveSesionToken(token: Token, replyTo: ActorRef[OperationResult]) extends Command
  final case class DeleteSesionToken(token: Token, replyTo: ActorRef[OperationResult]) extends Command
  final case class RefreshSesionToken(token: Token, replyTo: ActorRef[OperationResult]) extends Command

  private case object Cleanup extends Command

  private val TTL_MILLIS: Long = 60 * 60 * 1000

  def apply(): Behavior[Command] =
    Behaviors.withTimers { timers =>
      timers.startTimerAtFixedRate(Cleanup, 10.minutes)
      active(Map.empty)
    }

  private def active(tokens: Map[Token, Long]): Behavior[Command] =
    Behaviors.receive { (context, message) =>
      message match {
        case SetSesionToken(tokenObj, replyTo) =>
          val expiry = System.currentTimeMillis() + TTL_MILLIS
          replyTo ! OperationResult(success = true, message = s"Token registrado; expira en $expiry")
          active(tokens + (tokenObj -> expiry))

        case ActiveSesionToken(tokenObj, replyTo) =>
          val now = System.currentTimeMillis()
          tokens.get(tokenObj) match {
            case Some(expiry) if expiry > now =>
              replyTo ! OperationResult(success = true, message = "Acceso concedido")
              Behaviors.same
            case Some(_) =>
              replyTo ! OperationResult(success = false, message = "Token expirado")
              active(tokens - tokenObj)
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
object SesionAgentRoutes {
  def route(actor: ActorRef[SesionAgent.Command])(implicit system: ActorSystem[?]): Route = {
    implicit val timeout: Timeout = Timeout(3.seconds)
    implicit val ec: ExecutionContext = system.executionContext
    implicit val scheduler = system.scheduler

    pathPrefix("msg" / "sesion") {
      concat(
        // POST /msg/sesion/crear  JSON {"token":"..."}
        path("crear") {
          post {
            extractClientIP {
              case RemoteAddress.IP(ip, _) =>
                val ipStr = ip.getHostAddress
                entity(as[TokenRequest]) { dto =>
                  val tokenObj = Token(dto.token, ipStr)
                  val resultF: Future[OperationResult] =
                    actor.ask(ref => SesionAgent.SetSesionToken(tokenObj, ref))
                  onSuccess(resultF) { result =>
                    if result.success then
                      complete(StatusCodes.Created, result.message)
                    else
                      complete(StatusCodes.InternalServerError, result.message)
                  }
                }

              case _ =>
                complete(StatusCodes.BadRequest, "No se pudo determinar la IP del cliente")
            }
          }
        },
         // GET /msg/sesion/activo/{token}
        path("activo" / Segment) { token =>
          extractClientIP {
           case RemoteAddress.IP(ip, _) =>
              val ipStr = ip.getHostAddress
              val resultF: Future[OperationResult] =
                actor.ask(ref => SesionAgent.ActiveSesionToken(Token(token, ipStr), ref))
              onSuccess(resultF) { result =>
                if result.success then
                  complete(StatusCodes.OK, result.message)
                else
                  complete(StatusCodes.Unauthorized, result.message)
              }

            case _ =>
              complete(StatusCodes.BadRequest, "No se pudo determinar la IP del cliente")
          }
        },
        // PUT /msg/sesion/refrescar/{token}
        path("refrescar" / Segment) { token =>
          extractClientIP {
            case RemoteAddress.IP(ip, _) =>
              val ipStr = ip.getHostAddress
              val resultF: Future[OperationResult] =
                actor.ask(ref => SesionAgent.RefreshSesionToken(Token(token, ipStr), ref))
              onSuccess(resultF) { result =>
                if result.success then
                  complete(StatusCodes.OK, result.message)
                else
                  complete(StatusCodes.Unauthorized, result.message)
              }

            case _ =>
              complete(StatusCodes.BadRequest, "No se pudo determinar la IP del cliente")
          }
        },
        // DELETE /msg/sesion/{token}
        path(Segment) { token =>
          delete {
            extractClientIP {
              case RemoteAddress.IP(ip, _)  =>
                val ipStr = ip.getHostAddress
                val resultF: Future[OperationResult] =
                  actor.ask(ref => SesionAgent.DeleteSesionToken(Token(token, ipStr), ref))
                onSuccess(resultF) { result =>
                  if result.success then
                    complete(StatusCodes.OK, result.message)
                  else
                    complete(StatusCodes.NotFound, result.message)
                }

              case _ =>
                complete(StatusCodes.BadRequest, "No se pudo determinar la IP del cliente")
            }
          }
        }
      )
    }
  }
}