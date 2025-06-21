package com.COLive.Agents

import akka.actor.typed.{ActorRef, ActorSystem, Behavior}
import akka.actor.typed.scaladsl.Behaviors
import akka.stream.scaladsl.Sink
import akka.stream.SystemMaterializer
import akka.util.Timeout

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Success, Failure}
import scala.concurrent.duration._

import com.COLive.Services.MongoService
import com.COLive.Models.SalidaCorreoConfig
import com.COLive.Models.OperationResult
import com.COLive.Models.SMTPConfigInfo
import com.COLive.Models.SMTPConfigs

// Import JavaMail con alias para evitar ambigüedades con Akka HTTP
import javax.mail.{Session => MailSession, Message => MailMessage, Transport => MailTransport, Authenticator => MailAuthenticator, PasswordAuthentication}
import javax.mail.internet.{InternetAddress, MimeMessage}
import org.slf4j.LoggerFactory

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
  private case object ProcesarColaTick extends Command

  def apply(): Behavior[Command] =
    Behaviors.setup { context =>
      implicit val ec: ExecutionContext = context.executionContext
      implicit val timeout: Timeout = Timeout(15.seconds)
      val logger = LoggerFactory.getLogger(getClass)

      context.system.scheduler.scheduleAtFixedRate(5.seconds, 60.seconds) { () =>
        context.self ! ProcesarColaTick
      }(using context.executionContext)

      Behaviors.receiveMessage {
        case RegistrarSMTP(email, host, port, user, pass, replyTo) =>
          MongoService.guardarCorreo(email, host, port, user, pass).onComplete {
            case Success(_) =>
              replyTo ! OperationResult(success = true, message = s"SMTP registrado para '$email'.")
            case Failure(ex) =>
              logger.error("Error guardando SMTP para {}: {}", email, ex)
              replyTo ! OperationResult(success = false, message = s"Error registrando SMTP: ${ex.getMessage}")
          }
          Behaviors.same

        case EnviarSMTP(de, para, asunto, cuerpo, replyTo) =>
          logger.info(s"Recibido EnviarSMTP de=$de para=$para asunto=$asunto")
          MongoService.obtenerCorreoConfig(de).onComplete {
            case Success(optConfig) =>
              optConfig match {
                case None =>
                  logger.warn(s"No hay configuración SMTP para '$de'")
                  replyTo ! OperationResult(success = false, message = s"No hay configuración SMTP para '$de'.")
                case Some(config) =>
                  logger.info(s"Configuración SMTP encontrada para $de")
                  MongoService.agregarAColaEnvio(
                    de = de,
                    para = para,
                    asunto = asunto,
                    cuerpo = cuerpo
                  ).onComplete {
                    case Success(idCola) =>
                      logger.info(s"Correo encolado con id $idCola")
                      replyTo ! OperationResult(success = true, message = s"Correo encolado para envío.")
                    case Failure(ex) =>
                      logger.error(s"Error encolando correo: ${ex.getMessage}")
                      replyTo ! OperationResult(success = false, message = s"Error encolando correo: ${ex.getMessage}")
                  }
              }
            case Failure(ex) =>
              logger.error(s"Error obteniendo configuración SMTP para $de: ${ex.getMessage}")
              replyTo ! OperationResult(success = false, message = s"Error interno al obtener configuración: ${ex.getMessage}")
          }(using ec)
          Behaviors.same

        case ListarSMTP(replyTo) =>
          logger.info("SMTPAgent: ListarSMTP recibido")
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
              logger.error("SMTPAgent: Error al listar configuraciones SMTP", ex)
              replyTo ! SMTPConfigs(Nil)
          }
          Behaviors.same

        case ProcesarColaTick =>
          procesarCola()(using ec, logger)
          Behaviors.same
      }
    }

  def procesarCola()(using ec: ExecutionContext, logger: org.slf4j.Logger): Unit = {
    MongoService.obtenerPrimerCorreoEnCola().foreach {
      case Some(correo) =>
        MongoService.obtenerCorreoConfig(correo.de).foreach {
          case Some(config) =>
            val props = new java.util.Properties()
            props.put("mail.smtp.auth", "true")
            props.put("mail.smtp.ssl.enable", "true")
            props.put("mail.smtp.host", config.smtpHost)
            props.put("mail.smtp.port", config.smtpPort.toString)
            val session = MailSession.getInstance(props, new MailAuthenticator() {
              override protected def getPasswordAuthentication =
                new PasswordAuthentication(config.username, config.passwordPlain)
            })
            val message = new MimeMessage(session)
            message.setFrom(new InternetAddress(correo.de))
            message.setRecipients(MailMessage.RecipientType.TO, correo.para)
            message.setSubject(correo.asunto)
            message.setText(correo.cuerpo)
            try {
              logger.info(s"Enviando correo de ${correo.de} a ${correo.para}")
              MailTransport.send(message)
              MongoService.eliminarDeColaEnvio(correo.id)
              logger.info(s"Correo enviado y eliminado de la cola: ${correo.id}")
            } catch {
              case ex: Throwable =>
                logger.error(s"Error enviando correo de ${correo.de} a ${correo.para}: ${ex.getMessage}")
            }
          case None =>
            logger.warn(s"No hay configuración SMTP para el correo de ${correo.de} a ${correo.para}")
        }
      case None =>
        logger.info("No hay correos pendientes en la cola de envío.")
    }
  }
}