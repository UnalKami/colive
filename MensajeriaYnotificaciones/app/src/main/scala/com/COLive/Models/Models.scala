package com.COLive.Models

final case class TokenRequest(token: String)
final case class Token(token: String, ip: String)
final case class OperationResult(success: Boolean, message: String)

// DTO de respuesta: lista de configuraciones
final case class SMTPConfigInfo(
  email: String,
  smtpHost: String,
  smtpPort: Int,
  username: String
)
// Tipo de mensaje de respuesta
final case class SMTPConfigs(configs: List[SMTPConfigInfo])
final case class RegistrarSMTPDTO(email: String, smtpHost: String, smtpPort: Int, username: String, password: String)
final case class EnviarSMTPDTO(de: String, para: String, asunto: String, cuerpo: String)