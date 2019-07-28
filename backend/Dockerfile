FROM python:3.7.4-alpine3.10
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
ENV FLASK_APP=server.py
ENTRYPOINT ["flask"]
CMD ["run"]