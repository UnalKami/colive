package com.COLive

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import spray.json._
import spray.json.DefaultJsonProtocol._
import com.COLive.Models._

object JsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val tokenFormat: RootJsonFormat[Token] =
    jsonFormat2(Token.apply)
  
  implicit val tokenRequestFormat: RootJsonFormat[TokenRequest] =
    jsonFormat1(TokenRequest.apply)

  implicit val operationResultFormat: RootJsonFormat[OperationResult] =
    jsonFormat2(OperationResult.apply)

  implicit val smtpConfigInfoFormat: RootJsonFormat[SMTPConfigInfo] =
    jsonFormat4(SMTPConfigInfo.apply)

  implicit val smtpConfigsFormat: RootJsonFormat[SMTPConfigs] =
    jsonFormat1(SMTPConfigs.apply)

  implicit val registrarSMTPDTOFormat: RootJsonFormat[RegistrarSMTPDTO] =
    jsonFormat5(RegistrarSMTPDTO.apply)

  implicit val enviarSMTPDTOFormat: RootJsonFormat[EnviarSMTPDTO] =
    jsonFormat4(EnviarSMTPDTO.apply)
}
