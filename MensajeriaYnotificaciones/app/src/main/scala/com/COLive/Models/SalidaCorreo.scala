package com.COLive.Models

/**
 * Modelo persistido en MongoDB: guarda la contraseña cifrada en `passwordCipher`.
 */
case class SalidaCorreo(
  email: String,
  smtpHost: String,
  smtpPort: Int,
  username: String,
  passwordCipher: String
)