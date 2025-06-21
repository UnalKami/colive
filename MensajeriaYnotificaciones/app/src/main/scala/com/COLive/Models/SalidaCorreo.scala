package com.COLive.Models

import org.bson.types.ObjectId
import scala.beans.BeanProperty
import java.util.{List => JList}
import scala.compiletime.uninitialized

class SalidaCorreo() {
  @BeanProperty var id: ObjectId = uninitialized
  @BeanProperty var email: String = uninitialized
  @BeanProperty var smtpHost: String = uninitialized
  @BeanProperty var smtpPort: Int = uninitialized
  @BeanProperty var username: String = uninitialized
  @BeanProperty var passwordCipher: String = uninitialized
  @BeanProperty var tags: JList[String] = uninitialized

  // Constructor con tags
  def this(
    email: String,
    smtpHost: String,
    smtpPort: Int,
    username: String,
    passwordCipher: String,
    tags: JList[String]
  ) = {
    this()
    this.email = email
    this.smtpHost = smtpHost
    this.smtpPort = smtpPort
    this.username = username
    this.passwordCipher = passwordCipher
    this.tags = tags
  }

  // Constructor sin tags (para compatibilidad)
  def this(
    email: String,
    smtpHost: String,
    smtpPort: Int,
    username: String,
    passwordCipher: String
  ) = {
    this()
    this.email = email
    this.smtpHost = smtpHost
    this.smtpPort = smtpPort
    this.username = username
    this.passwordCipher = passwordCipher
    this.tags = null
  }

  override def toString: String =
    s"\nSalidaCorreo {\n\tid: $id\n\temail: $email\n\tsmtpHost: $smtpHost\n\tsmtpPort: $smtpPort\n\tusername: $username\n\tpasswordCipher: $passwordCipher\n\ttags: $tags\n}"
}