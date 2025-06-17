package com.COLive

import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.Behaviors
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives._   // para concatenar rutas con ~
import scala.util.{Success, Failure}
import scala.concurrent.Await
import scala.concurrent.duration.Duration

import com.COLive.Agents.{SesionAgent, SesionAgentRoutes, SMTPAgent, SMTPAgentRoutes}

object Main {
  def main(args: Array[String]): Unit = {
    // Crear ActorSystem vacío para coordinar
    implicit val system = ActorSystem(Behaviors.empty, "COLiveSystem")
    implicit val ec = system.executionContext

    // Crear actores
    val sesionActor = system.systemActorOf(SesionAgent(), "sesionActor")
    val smtpActor   = system.systemActorOf(SMTPAgent(),   "smtpActor")

    // Componer rutas
    val allRoutes = SesionAgentRoutes.route(sesionActor) ~ SMTPAgentRoutes.route(smtpActor)

    // Bind del servidor HTTP en puerto 9000
    val bindingFuture = Http().newServerAt("0.0.0.0", 7000).bind(allRoutes)

    bindingFuture.onComplete {
      case Success(binding) =>
        val address = binding.localAddress
        system.log.info(s"✅ Servidor HTTP iniciado en http://$address/")
      case Failure(ex) =>
        system.log.error("❌ Error al iniciar servidor HTTP: {}", ex.getMessage)
        system.terminate()
    }

    // Agregar hook de JVM para cerrar el servidor y ActorSystem al recibir SIGTERM/SIGINT
    sys.addShutdownHook {
      system.log.info("🔴 Shutdown hook iniciado: desbindear servidor y terminar ActorSystem")
      // Desbindear y luego terminar actor system
      bindingFuture
        .flatMap(_.unbind())(using system.executionContext)
        .onComplete { _ =>
          system.terminate()
          system.log.info("ActorSystem terminado")
        }(using system.executionContext)
      // Esperamos a que el sistema realmente termine (opcionalmente)
      Await.result(system.whenTerminated, Duration.Inf)
    }
    Await.ready(system.whenTerminated, Duration.Inf)
  }
}