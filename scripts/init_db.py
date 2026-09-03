from app.db.postgres.base import Base
from app.db.postgres.connection import engine

# Important: importing models registers them with Base.metadata
from app.db.postgres import models


def init_db():
    Base.metadata.create_all(bind=engine)

    print("PostgreSQL database initialized successfully.")


if __name__ == "__main__":
    init_db()