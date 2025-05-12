
podman run --rm -it \
  --name scala-container \
  -v "$(pwd)"/app:/app \
  -w /app \
  localhost/sbt-alpine:1.10.11 \
  run