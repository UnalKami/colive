package com.COLive.Agents

import akka.actor.typed.ActorRef
import akka.actor.typed.ActorSystem
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.model.StatusCodes
import akka.util.Timeout
import akka.actor.typed.scaladsl.AskPattern._
import scala.concurrent.duration._
import scala.concurrent.{Future, ExecutionContext}
import spray.json._
import spray.json.DefaultJsonProtocol._
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._

import com.COLive.Agents.OperationResult

object SMTPAgentRoutes {
  // 1) DTOs
  final case class RegistrarSMTPDTO(email: String, smtpHost: String, smtpPort: Int, username: String, password: String)
  final case class EnviarSMTPDTO(de: String, para: String, asunto: String, cuerpo: String)

  // 2) JsonFormats (implicits) — definidas justo después de las case classes
  implicit val registrarFormat: RootJsonFormat[RegistrarSMTPDTO] = jsonFormat5(RegistrarSMTPDTO.apply)
  implicit val enviarFormat:   RootJsonFormat[EnviarSMTPDTO]    = jsonFormat4(EnviarSMTPDTO.apply)

  // 3) Ruta
  def route(actor: ActorRef[SMTPAgent.Command])(implicit system: ActorSystem[_]): Route = {
    implicit val timeout: Timeout = Timeout(5.seconds)
    implicit val ec: ExecutionContext = system.executionContext
    implicit val scheduler = system.scheduler

    pathPrefix("msg" / "smtp") {
      concat(
        path("registrar") {
          post {
            entity(as[RegistrarSMTPDTO]) { (dto: RegistrarSMTPDTO) =>
              val askF: Future[OperationResult] =
                actor.ask(ref => SMTPAgent.RegistrarSMTP(dto.email, dto.smtpHost, dto.smtpPort, dto.username, dto.password, ref))
              onSuccess(askF) { result =>
                if result.success then complete(StatusCodes.Created, result.message)
                else            complete(StatusCodes.BadRequest, result.message)
              }
            }
          }
        },
        path("enviar") {
          post {
            entity(as[EnviarSMTPDTO]) { (dto: EnviarSMTPDTO) =>
              val askF: Future[OperationResult] =
                actor.ask(ref => SMTPAgent.EnviarSMTP(dto.de, dto.para, dto.asunto, dto.cuerpo, ref))
              onSuccess(askF) { result =>
                if result.success then complete(StatusCodes.OK, result.message)
                else            complete(StatusCodes.BadRequest, result.message)
              }
            }
          }
        }
      )
    }
  }
}