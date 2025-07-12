package com.COLive.Models

import org.bson.types.ObjectId
import scala.beans.BeanProperty
import scala.compiletime.uninitialized

val HOURS_24_MILLIS: Long = 24L * 60 * 60 * 1000

class RolToken() {
  @BeanProperty var idRol: Int = uninitialized
  @BeanProperty var token: String = uninitialized
  @BeanProperty var expiry: Long = uninitialized
  @BeanProperty var _id: ObjectId = new ObjectId()

  // Constructor completo
  def this(
    idRol: Int,
    token: String

  ) = {
    this()
    this.idRol = idRol
    this.token = token
    this.expiry = System.currentTimeMillis() + HOURS_24_MILLIS
  }

  override def toString: String =
    s"\nRolToken {\n\tidRol: $idRol\n\ttoken: $token\n\t_id: ${_id.toHexString}\n}"
}