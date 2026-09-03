from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.postgres.base import Base


class Investigation(Base):
    __tablename__ = "investigations"

    id: Mapped[str] = mapped_column(
        String(100),
        primary_key=True,
    )

    incident: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    logs: Mapped[str] = mapped_column(
        Text,
        default="",
        nullable=False,
    )

    indicators: Mapped[str] = mapped_column(
        Text,
        default="",
        nullable=False,
    )

    triage_result: Mapped[dict[str, Any] | None] = mapped_column(
        JSONB,
        nullable=True,
    )

    log_analysis: Mapped[dict[str, Any] | None] = mapped_column(
        JSONB,
        nullable=True,
    )

    threat_intelligence: Mapped[dict[str, Any] | None] = mapped_column(
        JSONB,
        nullable=True,
    )

    risk_assessment: Mapped[dict[str, Any] | None] = mapped_column(
        JSONB,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="COMPLETED",
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )