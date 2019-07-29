FROM node:12-alpine AS frontend
COPY ./frontend /web
WORKDIR /web
RUN npm install --global yarn
RUN yarn
RUN yarn build

FROM python:3.7.4-alpine3.10
COPY ./backend /app
WORKDIR /app
RUN pip install -r requirements.txt
ENV FLASK_APP=server.py
ENV PROD=true
# copy dist dir
COPY --from=frontend /web/dist ./dist
ENTRYPOINT ["python"]
CMD ["server.py"]
