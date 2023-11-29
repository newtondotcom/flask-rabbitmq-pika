# flask-rabbitmq-pika

This repo contains a simple example of how to use RabbitMQ with Flask and Pika, both in the producer and consumer side.

I have added the server written in JavaScript using Node.js and the library amqplib. You can find it in the folder `serverjs`.

## How to run it

Just run ```docker-compose up``` and you will have RabbitMQ running in your localhost, as well as 2 workers and the Node.js app.
