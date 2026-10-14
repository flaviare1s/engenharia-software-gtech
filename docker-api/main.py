import os

import psycopg
from fastapi import FastAPI, HTTPException, status

APP_VERSION = "1.1.0"
DATABASE_CONNECT_TIMEOUT_SECONDS = 3

app = FastAPI(title="Geração Tech API", version=APP_VERSION)


def connect_to_database() -> psycopg.Connection:
    return psycopg.connect(
        host=os.environ["POSTGRES_HOST"],
        dbname=os.environ["POSTGRES_DB"],
        user=os.environ["POSTGRES_USER"],
        password=os.environ["POSTGRES_PASSWORD"],
        connect_timeout=DATABASE_CONNECT_TIMEOUT_SECONDS,
    )


@app.get("/health")
def get_health() -> dict[str, str]:
    try:
        with connect_to_database() as connection:
            connection.execute("SELECT 1")
    except psycopg.OperationalError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="database unavailable",
        ) from error
    return {"status": "ok"}


@app.get("/version")
def get_version() -> str:
    return APP_VERSION
