package com.COLive.Agents

import akka.actor.typed.{ActorRef, ActorSystem, Behavior}
import akka.actor.typed.scaladsl.Behaviors
import akka.stream.scaladsl.Sink
import akka.stream.SystemMaterializer

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Success, Failure}

import com.COLive.Services.MongoService
import com.COLive.Models.SalidaCorreoConfig
import com.COLive.Models.OperationResult
import com.COLive.Models.SMTPConfigInfo
import com.COLive.Models.SMTPConfigs

// Import JavaMail con alias para evitar ambigüedades con Akka HTTP
import javax.mail.{Session => MailSession, Message => MailMessage, Transport => MailTransport, Authenticator => MailAuthenticator, PasswordAuthentication}
import javax.mail.internet.{InternetAddress, MimeMessage}

object SMTPAgent {
  sealed trait Command

  final case class RegistrarSMTP(
    email: String,
    smtpHost: String,
    smtpPort: Int,
    username: String,
    password: String,
    replyTo: ActorRef[OperationResult]
  ) extends Command

  final case class EnviarSMTP(
    de: String,
    para: String,
    asunto: String,
    cuerpo: String,
    replyTo: ActorRef[OperationResult]
  ) extends Command

  final case class ListarSMTP(replyTo: ActorRef[SMTPConfigs]) extends Command

  def apply(): Behavior[Command] =
    Behaviors.setup { context =>
      implicit val ec: ExecutionContext = context.executionContext

      Behaviors.receiveMessage {
        case RegistrarSMTP(email, host, port, user, pass, replyTo) =>
          MongoService.guardarCorreo(email, host, port, user, pass).onComplete {
            case Success(_) =>
              replyTo ! OperationResult(success = true, message = s"SMTP registrado para '$email'.")
            case Failure(ex) =>
              context.log.error("Error guardando SMTP para {}: {}", email, ex)
              replyTo ! OperationResult(success = false, message = s"Error registrando SMTP: ${ex.getMessage}")
          }
          Behaviors.same

        case EnviarSMTP(de, para, asunto, cuerpo, replyTo) =>
          MongoService.obtenerCorreoConfig(de).onComplete {
            case Success(optConfig) =>
              optConfig match {
                case None =>
                  replyTo ! OperationResult(success = false, message = s"No hay configuración SMTP para '$de'.")
                case Some(config) =>
                  Future {
                    val props = new java.util.Properties()
                    props.put("mail.smtp.auth", "true")
                    props.put("mail.smtp.starttls.enable", "true")
                    props.put("mail.smtp.host", config.smtpHost)
                    props.put("mail.smtp.port", config.smtpPort.toString)
                    // Timeouts en ms
                    props.put("mail.smtp.connectiontimeout", "5000")
                    props.put("mail.smtp.timeout", "5000")
                    props.put("mail.smtp.writetimeout", "5000")

                    val session = MailSession.getInstance(props, new MailAuthenticator() {
                      override protected def getPasswordAuthentication =
                        new PasswordAuthentication(config.username, config.passwordPlain)
                    })

                    val message = new MimeMessage(session)
                    message.setFrom(new InternetAddress(de))
                    // Se usa sobrecarga que acepta String de destinatarios (comma-separated)
                    message.setRecipients(MailMessage.RecipientType.TO, para)
                    message.setSubject(asunto)
                    message.setText(cuerpo)

                    MailTransport.send(message)
                  }(using ec).onComplete {
                    case Success(_) =>
                      replyTo ! OperationResult(success = true, message = s"Correo enviado de '$de' a '$para'.")
                    case Failure(exSend) =>
                      context.log.error("Error enviando correo de {} a {}: {}", de, para, exSend.getMessage)
                      replyTo ! OperationResult(success = false, message = s"Error al enviar correo: ${exSend.getMessage}")
                  }
              }

            case Failure(ex) =>
              context.log.error("Error obteniendo configuración SMTP para {}: {}", de, ex)
              replyTo ! OperationResult(success = false, message = s"Error interno al obtener configuración: ${ex.getMessage}")
          }(using ec)

          Behaviors.same

        case ListarSMTP(replyTo) =>
          context.log.info("SMTPAgent: ListarSMTP recibido")
          implicit val system: akka.actor.typed.ActorSystem[?] = context.system
          implicit val ec: ExecutionContext = context.executionContext
          val source = MongoService.listarTodos()
          implicit val mat = SystemMaterializer(context.system).materializer
          source.runWith(Sink.seq).onComplete {
            case Success(listSalidaCorreo) =>
              val infos = listSalidaCorreo.map(e =>
                SMTPConfigInfo(e.email, e.smtpHost, e.smtpPort, e.username)
              )
              replyTo ! SMTPConfigs(infos.toList)
            case Failure(ex) =>
              context.log.error("SMTPAgent: Error al listar configuraciones SMTP", ex)
              replyTo ! SMTPConfigs(Nil)
          }
          Behaviors.same
      }
    }
}