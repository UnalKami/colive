name := "COLiveServer"

version := "0.1.0"

scalaVersion := "2.13.12"

// Dependencias mínimas para Akka clásico y HTTP con JSON
libraryDependencies ++= Seq(
  "com.typesafe.akka" %% "akka-actor"              % "2.6.21",
  "com.typesafe.akka" %% "akka-http"               % "10.2.10",
  "com.typesafe.akka" %% "akka-http-spray-json"    % "10.2.10"
)

// Clase principal para 'run'
Compile / mainClass := Some("com.COLive.Main")