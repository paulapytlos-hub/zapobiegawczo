from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    ended_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    interval_minutes = Column(Integer, default=60)

    breaks = relationship("Break", back_populates="session")


class Break(Base):
    __tablename__ = "breaks"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    exercise_id = Column(String)
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    snoozed = Column(Boolean, default=False)

    session = relationship("Session", back_populates="breaks")
