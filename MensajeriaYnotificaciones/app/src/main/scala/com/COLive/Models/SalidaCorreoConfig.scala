package com.COLive.Models

/**
 * Modelo usado al enviar correo: contraseña descifrada en `passwordPlain`.
 */
case class SalidaCorreoConfig(
  email: String,
  smtpHost: String,
  smtpPort: Int,
  username: String,
  passwordPlain: String
)