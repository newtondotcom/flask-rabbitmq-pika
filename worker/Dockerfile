FROM python:3.8-slim

RUN pip install pika

WORKDIR /app

COPY . /app

ENTRYPOINT [ "python3" ]

CMD [ "app.py" ]