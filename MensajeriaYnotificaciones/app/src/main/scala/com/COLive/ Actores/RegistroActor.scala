package com.COLive.Actores

import akka.actor.{Actor, ActorLogging}

// Mensajes de registro
case class Registrar(nombre: String)
case class Consultar(nombre: String)

class RegistroActor extends Actor with ActorLogging {
  private var base = Set.empty[String]

  def receive: Receive = {
    case Registrar(nombre) =>
      base += nombre
      log.info(s"Registrado: $nombre")

    case Consultar(nombre) =>
      sender() ! base.contains(nombre)
  }
}
