package com.COLive.Actores

import akka.actor.{Actor, ActorLogging, Props}
import java.time.Instant
import java.util.UUID
import scala.concurrent.duration._

// Modelos de sesión
final case class SessionInfo(token: String, expiresAt: Instant)
final case class LoginRequest(user: String, password: String)
final case class TokenResponse(token: String, expiresAt: Instant)
final case class RefreshRequest(token: String)
final case class StatusRequest(token: String)
final case class StatusResponse(active: Boolean, expiresAt: Option[Instant])
final case class LogoutRequest(token: String)

object SessionManager {
  def props(sessionTimeout: FiniteDuration): Props =
    Props(new SessionManager(sessionTimeout))

  // Mensajes
  case class CreateSession(user: String, replyTo: akka.actor.ActorRef)
  case class RefreshSession(token: String, replyTo: akka.actor.ActorRef)
  case class CheckSession(token: String, replyTo: akka.actor.ActorRef)
  case class EndSession(token: String, replyTo: akka.actor.ActorRef)

  // Respuestas
  sealed trait SessionResult
  case class SessionCreated(info: SessionInfo)                              extends SessionResult
  case class SessionRefreshed(info: SessionInfo)                            extends SessionResult
  case class SessionStatus(active: Boolean, infoOpt: Option[SessionInfo])   extends SessionResult
  case object SessionEnded                                                  extends SessionResult
  case object SessionNotFound                                               extends SessionResult
}

class SessionManager(sessionTimeout: FiniteDuration) extends Actor with ActorLogging {
  import SessionManager._
  import context.dispatcher

  private var sessions = Map.empty[String, SessionInfo]

  def receive: Receive = {
    case CreateSession(user, replyTo) =>
      val token   = UUID.randomUUID().toString
      val expires = Instant.now().plusMillis(sessionTimeout.toMillis)
      val info    = SessionInfo(token, expires)
      sessions += token -> info
      replyTo ! SessionCreated(info)

    case RefreshSession(token, replyTo) =>
      sessions.get(token) match {
        case Some(old @ SessionInfo(_, exp)) if exp.isAfter(Instant.now()) =>
          val info2 = old.copy(expiresAt = Instant.now().plusMillis(sessionTimeout.toMillis))
          sessions += token -> info2
          replyTo ! SessionRefreshed(info2)
        case _ =>
          sessions -= token
          replyTo ! SessionNotFound
      }

    case CheckSession(token, replyTo) =>
      sessions.get(token) match {
        case Some(info) if info.expiresAt.isAfter(Instant.now()) =>
          replyTo ! SessionStatus(active = true, Some(info))
        case _ =>
          sessions -= token
          replyTo ! SessionStatus(active = false, None)
      }

    case EndSession(token, replyTo) =>
      sessions -= token
      replyTo ! SessionEnded
  }
}