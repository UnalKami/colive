package com.COLive

import spray.json._
import com.COLive.Actores._

trait JsonSupport extends DefaultJsonProtocol {
  implicit val loginReqFormat   = jsonFormat2(LoginRequest)
  implicit val tokenRespFormat  = jsonFormat2(TokenResponse)
  implicit val refreshReqFormat = jsonFormat1(RefreshRequest)
  implicit val statusReqFormat  = jsonFormat1(StatusRequest)
  implicit val statusRespFormat = jsonFormat2(StatusResponse)
  implicit val logoutReqFormat  = jsonFormat1(LogoutRequest)
}