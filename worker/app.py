import pika
import time
import json

# RabbitMQ connection parameters
rabbitMQUrl = 'amqp://rabbitmq'

def callback(ch, method, properties, body):
    try:
        task = json.loads(body)
        # Process the task here
        print(f"Received task: {task}")
        # Replace this with your actual task processing logic
        time.sleep(30)
        # Acknowledge that the task is processed
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(f"Error processing task: {e}")
        # You can handle errors or requeue the task if needed

def worker():
    time.sleep(15)  # Wait for RabbitMQ to start and server to create queues/exchanges
    try:
        connection = pika.BlockingConnection(pika.URLParameters(rabbitMQUrl))
        channel = connection.channel()
        
        exchange = 'tasks'
        queue = 'worker_queue'  # You can name your queue appropriately
        
        # Declare a queue
        channel.queue_declare(queue=queue,durable=True)
        
        # Bind the queue to the exchange
        channel.queue_bind(exchange=exchange, queue=queue)
        
        # Set up the callback function to handle incoming tasks
        channel.basic_consume(queue=queue, on_message_callback=callback, auto_ack=False)
        
        print('Worker is waiting for tasks. To exit, press CTRL+C')
        
        # Start consuming tasks
        channel.start_consuming()
    except Exception as e:
        print(f"Error in worker: {e}")

if __name__ == '__main__':
    worker()
