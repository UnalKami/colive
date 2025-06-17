package com.COLive.Agents

import akka.actor.typed.ActorRef
import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.AskPattern._

import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._

import akka.util.Timeout

import scala.concurrent.duration._
import scala.concurrent.{Future, ExecutionContext}

import spray.json._
import spray.json.DefaultJsonProtocol._

import com.COLive.Agents.SMTPAgent.ListarSMTP

 import com.COLive.JsonSupport._
import com.COLive.Models.{RegistrarSMTPDTO, EnviarSMTPDTO, SMTPConfigs, SMTPConfigInfo, OperationResult}

object SMTPAgentRoutes {
  //Ruta
  def route(actor: ActorRef[SMTPAgent.Command])(implicit system: ActorSystem[?]): Route = {
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
        },
        path("listar") {
          get {
            implicit val timeout: Timeout = Timeout.create(java.time.Duration.ofSeconds(5))
            val configsF: Future[SMTPConfigs] = actor.ask(ref => ListarSMTP(ref))
            onSuccess(configsF) {
              case SMTPConfigs(infos) =>
                complete(SMTPConfigs(infos))
            }
          }
        }
      )
    }
  }
}