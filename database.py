"""Database configuration for the Japanese learning API."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Generator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


BASE_DIR = Path(__file__).resolve().parent
DATABASE_URL = os.getenv(
    "DATABASE_URL", f"sqlite:///{(BASE_DIR / 'japanese_learning.db').as_posix()}"
)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


if DATABASE_URL.startswith("sqlite"):

    @event.listens_for(engine, "connect")
    def enable_sqlite_foreign_keys(dbapi_connection, _connection_record) -> None:
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_db_and_tables() -> None:
    # Import registers every mapped table before create_all runs.
    import models  # noqa: F401

    Base.metadata.create_all(bind=engine)

