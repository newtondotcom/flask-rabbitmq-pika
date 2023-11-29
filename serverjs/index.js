/*
from flask import Flask
import pika


@app.route('/create-job/<msg>')
def add(cmd):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host="rabbitmq"))
    except pika.exceptions.AMQPConnectionError as exc:
        print("Failed to connect to RabbitMQ service. Message wont be sent.")
        return

    channel = connection.channel()
    channel.queue_declare(queue='task_queue', durable=True)
    channel.basic_publish(
        exchange='',
        routing_key='task_queue',
        body=cmd,
        properties=pika.BasicProperties(
            delivery_mode=2,  # make message persistent
        ))
   
    connection.close()
    return " ___ Sent: %s" % cmd

    BODY must contains : 
    file_s3_id = "server1"
    file_s3_name = "file1"
    emoji = True
    gpu = True
*/
    
const amqplib = require('amqplib/callback_api');
const queue = 'tasks';

const rabbitmq_gpu = "amqp://rabbitmqtest:5672";
const rabbitmq_cpu = "amqp://rabbitmq:5672";

amqplib.connect(rabbitmq_cpu, (err, conn) => {
  if (err) throw err;

  // Listener
  conn.createChannel((err, ch2) => {
    if (err) throw err;

    ch2.assertQueue(queue);

    ch2.consume(queue, (msg) => {
      if (msg !== null) {
        console.log(msg.content.toString());
        ch2.ack(msg);
      } else {
        console.log('Consumer cancelled by server');
      }
    });
  });

  // Sender
  conn.createChannel((err, ch1) => {
    if (err) throw err;

    ch1.assertQueue(queue);

    setInterval(() => {
      ch1.sendToQueue(queue, Buffer.from('something to do'));
    }, 1000);
  });
});
