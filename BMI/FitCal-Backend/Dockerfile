FROM golang:1.22-alpine AS build

WORKDIR /app
COPY go.mod ./
COPY main.go ./
RUN go build -o /fitcal-backend .

FROM alpine:3.20

WORKDIR /app
COPY --from=build /fitcal-backend /app/fitcal-backend
EXPOSE 48791
CMD ["/app/fitcal-backend"]
