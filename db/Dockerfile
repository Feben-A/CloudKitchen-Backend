FROM postgres

ENV POSTGRES_PASSWORD=docker
ENV POSTGRES_DB=cloudkitchen-db

COPY cloudkitchen.sql /docker-entrypoint-initdb.d/
