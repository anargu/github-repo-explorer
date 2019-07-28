FROM python:3.7.4-alpine3.10
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
ENTRYPOINT ["python"]
CMD ["server.py"]