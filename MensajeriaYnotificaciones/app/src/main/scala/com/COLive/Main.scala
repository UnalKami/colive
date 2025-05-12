package com.COLive
import com.COLive.Actores._

import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.Behaviors
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Route

import scala.io.StdIn
import scala.util.{Failure, Success}

object Main {

  def main(args: Array[String]): Unit = {
    implicit val system = ActorSystem(Behaviors.empty, "COLiveSystem")
    implicit val ec     = system.executionContext

    // Crear actores
    val sesionActor = system.systemActorOf(SesionActor(), "sesionActor")

    // Crear rutas
    val allRoutes: Route =
      SesionActor.route(sesionActor) //~
      //SaludoActor.route(saludoActor) ~

    // Iniciar servidor
    val bindingFuture = Http().newServerAt("0.0.0.0", 8080).bind(allRoutes)

    bindingFuture.onComplete {
      case Success(binding) =>
        println(s"✅ Servidor disponible en http://${binding.localAddress}/")
      case Failure(ex) =>
        println(s"❌ Error al iniciar: ${ex.getMessage}")
        system.terminate()
    }

    println("Presiona ENTER para detener el servidor.")
    StdIn.readLine()
    bindingFuture
      .flatMap(_.unbind())
      .onComplete(_ => system.terminate())
  }
}
