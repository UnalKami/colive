package com.COLive

import akka.actor.{ActorSystem, Props}
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.pattern.ask
import akka.stream.ActorMaterializer
import akka.util.Timeout
import com.COLive.Actores._
import scala.concurrent.duration._

object Main extends App with JsonSupport {
  implicit val system       = ActorSystem("COLiveSystem")
  implicit val materializer = ActorMaterializer()
  implicit val ec           = system.dispatcher
  implicit val timeout: Timeout = Timeout(3.seconds)

  // Creamos los actores
  val sessionManager = system.actorOf(SessionManager.props(30.minutes), "session-manager")
  val registroActor  = system.actorOf(Props[RegistroActor], "registro-actor")

  // Definición de rutas
  val route =
    pathPrefix("api") {
      concat(
        pathPrefix("session") {
          concat(
            // LOGIN
            (post & path("login") & entity(as[LoginRequest])) { req =>
              onSuccess((sessionManager ? SessionManager.CreateSession(req.user, _))
                .mapTo[SessionManager.SessionCreated]) {
                case SessionManager.SessionCreated(info) =>
                  complete(TokenResponse(info.token, info.expiresAt))
              }
            },
            // REFRESH
            (post & path("refresh") & entity(as[RefreshRequest])) { req =>
              onSuccess((sessionManager ? SessionManager.RefreshSession(req.token, _))
                .mapTo[SessionManager.SessionResult]) {
                case SessionManager.SessionRefreshed(info) =>
                  complete(TokenResponse(info.token, info.expiresAt))
                case SessionManager.SessionNotFound =>
                  complete(StatusCodes.NotFound, "Token inválido o expirado")
              }
            },
            // STATUS
            (get & path("status") & parameter('token)) { token =>
              onSuccess((sessionManager ? SessionManager.CheckSession(token, _))
                .mapTo[SessionManager.SessionStatus]) {
                case SessionManager.SessionStatus(active, infoOpt) =>
                  complete(StatusRequest(token) /* sólo para tipado */)
                  complete(StatusResponse(active, infoOpt.map(_.expiresAt)))
              }
            },
            // LOGOUT
            (post & path("logout") & entity(as[LogoutRequest])) { req =>
              onSuccess((sessionManager ? SessionManager.EndSession(req.token, _))
                .mapTo[SessionManager.SessionEnded.type]) { _ =>
                  complete(StatusCodes.OK, "Sesión finalizada")
              }
            }
          )
        },
        pathPrefix("registro") {
          concat(
            // REGISTRO NUEVO
            (post & path("nuevo") & parameter('nombre)) { nombre =>
              registroActor ! Registrar(nombre)
              complete(s"Registrado $nombre")
            },
            // CONSULTA EXISTENCIA
            (get & path("existe") & parameter('nombre)) { nombre =>
              onSuccess((registroActor ? Consultar(nombre)).mapTo[Boolean]) { exists =>
                complete(Map("existe" -> exists))
              }
            }
          )
        }
      )
    }

  // Arrancamos el servidor
  Http().bindAndHandle(route, "0.0.0.0", 8080)
  println("Servidor arrancado en http://localhost:8080/")
}