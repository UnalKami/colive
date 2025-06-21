package com.COLive.Models

import org.bson.types.ObjectId
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

class CorreoEnCola() {
  @BeanProperty var id: ObjectId = uninitialized
  @BeanProperty var de: String = uninitialized
  @BeanProperty var para: String = uninitialized
  @BeanProperty var asunto: String = uninitialized
  @BeanProperty var cuerpo: String = uninitialized

  // Constructor completo
  def this(
    de: String,
    para: String,
    asunto: String,
    cuerpo: String
  ) = {
    this()
    this.de = de
    this.para = para
    this.asunto = asunto
    this.cuerpo = cuerpo
  }

  override def toString: String =
    s"\nCorreoEnCola {\n\tid: $id\n\tde: $de\n\tpara: $para\n\tasunto: $asunto\n\tcuerpo: $cuerpo\n}"
}