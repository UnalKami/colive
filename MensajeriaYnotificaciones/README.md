podman build -f Dockerfile.sbt-alpine -t sbt-alpine:1.10.11 .

podman run --rm -it   --name scala-container   -w /app   -p 8081:8080   localhost/sbt-alpine:1.10.11   sbt run