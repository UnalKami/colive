package com.COLive.Models

case class SalidaCorreo(
  email: String,
  smtpHost: String,
  smtpPort: Int,
  username: String,
  passwordCipher: String
)