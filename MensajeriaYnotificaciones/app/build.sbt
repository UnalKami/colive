name := "COLiveMensajeriaYnotificaciones"

version := "0.1.0"

ThisBuild / scalaVersion := "3.7.0"

libraryDependencies ++= Seq(
  // Akka Typed, Streams, HTTP
  "com.typesafe.akka" %% "akka-actor-typed"     % "2.8.5",
  "com.typesafe.akka" %% "akka-stream"          % "2.8.5",
  "com.typesafe.akka" %% "akka-http"            % "10.5.2",
  "com.typesafe.akka" %% "akka-http-spray-json" % "10.5.2",
  // JSON
  "io.spray"          %% "spray-json"           % "1.3.6",
  // MongoDB Reactive Streams Java Driver
  "org.mongodb"       %  "mongodb-driver-reactivestreams" % "5.5.1",
  // JavaMail
  "com.sun.mail"      %  "javax.mail"           % "1.6.2"
)

Compile / run / mainClass := Some("com.COLive.Main")
