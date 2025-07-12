package com.COLive.Agents

import akka.actor.typed.{ActorRef, ActorSystem, Behavior}
import akka.actor.typed.scaladsl.AskPattern._
import akka.actor.typed.scaladsl.{Behaviors, TimerScheduler}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.model.StatusCodes
import akka.util.Timeout

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import com.COLive.Models.{TokenRequest, OperationResult, RolToken}
import com.COLive.JsonSupport._
import com.COLive.Services.RolTokenService

object SesionAgent {
  // Comandos
  sealed trait Command
  final case class SetSesionToken(tokenObj: TokenRequest, replyTo: ActorRef[OperationResult])    extends Command
  final case class ActiveSesionToken(token: String, replyTo: ActorRef[OperationResult]) extends Command
  private case object Cleanup extends Command

  def apply()(implicit ec: ExecutionContext): Behavior[Command] =
    Behaviors.withTimers { timers =>
      timers.startTimerAtFixedRate(Cleanup, 10.minutes)
      active(Map.empty)
    }

  private def active(tokens: Map[String, Long])(implicit ec: ExecutionContext): Behavior[Command] =
    Behaviors.receive { (context, message) =>
      message match {
        case SetSesionToken(tokenObj, replyTo) =>
          // Guardar en Mongo
          val rolToken = new RolToken(tokenObj.idRol, tokenObj.token)
          RolTokenService.guardarRolToken(rolToken).onComplete {
            case scala.util.Success(_) =>
              replyTo ! OperationResult(success = true, message = s"Token registrado; expira en ${rolToken.expiry}")
            case scala.util.Failure(ex) =>
              replyTo ! OperationResult(success = false, message = s"Error al guardar token: ${ex.getMessage}")
          }
          active(tokens + (rolToken.token -> rolToken.expiry))

        case ActiveSesionToken(token, replyTo) =>
          val now = System.currentTimeMillis()
          tokens.get(token) match {
            case Some(expiry) if expiry > now =>
              // Buscar en Mongo y devolver el rolId en JSON
              RolTokenService.obtenerRolToken(token).onComplete {
                case scala.util.Success(Some(idRol)) =>
                  replyTo ! OperationResult(success = true, message = s"""{"idRol":"${idRol}"}""")
                case scala.util.Success(None) =>
                  replyTo ! OperationResult(success = false, message = "Token no encontrado")
                case scala.util.Failure(ex) =>
                  replyTo ! OperationResult(success = false, message = s"Error: ${ex.getMessage}")
              }
              Behaviors.same
            case Some(_) =>
              // Token expirado, eliminar de Mongo
              RolTokenService.eliminarRolToken(token)
              active(tokens - token)
            case None =>
              replyTo ! OperationResult(success = false, message = "Token no encontrado")
              Behaviors.same
          }

        case Cleanup =>
          val now = System.currentTimeMillis()
          val expiredTokens = tokens.filter { case (_, expiry) => expiry <= now }
          expiredTokens.keys.foreach { token =>
            RolTokenService.eliminarRolToken(token)
          }
          val cleaned = tokens.filter { case (_, expiry) => expiry > now }
          active(cleaned)
      }
    }
}

// Rutas HTTP para SesionAgent, bajo /msg/sesion.
object SesionAgentRoutes {
  def route(actor: ActorRef[SesionAgent.Command])(implicit system: ActorSystem[?]): Route = {
    implicit val timeout: Timeout = Timeout(3.seconds)
    implicit val ec: ExecutionContext = system.executionContext
    implicit val scheduler = system.scheduler

    pathPrefix("msg" / "sesion") {
      concat(
        // POST /msg/sesion/crear
        path("crear") {
          post {
            extractClientIP { clientIp =>
              val ipStr = clientIp.toOption.map(_.getHostAddress).getOrElse("desconocido")
              entity(as[TokenRequest]) { dto =>
                val resultF: Future[OperationResult] =
                  actor.ask(ref => SesionAgent.SetSesionToken(dto, ref))
                onSuccess(resultF) { result =>
                  if result.success then complete(StatusCodes.Created, result.message)
                  else complete(StatusCodes.InternalServerError, result.message)
                }
              }
            }
          }
        },

        // GET /msg/sesion/activo/{token}
        path("activo" / Segment) { token =>
          extractClientIP { clientIp =>
            val ipStr = clientIp.toOption.map(_.getHostAddress).getOrElse("desconocido")
            val resultF: Future[OperationResult] =
              actor.ask(ref => SesionAgent.ActiveSesionToken(token, ref))
            onSuccess(resultF) { result =>
              if result.success then complete(StatusCodes.OK, result.message)
              else complete(StatusCodes.Unauthorized, result.message)
            }
          }
        }
      )
    }
  }
}