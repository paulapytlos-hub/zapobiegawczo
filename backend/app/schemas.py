from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SessionCreate(BaseModel):
    interval_minutes: int = 60

class SessionResponse(BaseModel):
    id: int
    started_at: datetime
    interval_minutes: int

    model_config = {"from_attributes": True}

class SessionEnd(BaseModel):
    duration_seconds: int

class BreakCreate(BaseModel):
    exercise_id: str
    snoozed: bool = False

class BreakResponse(BaseModel):
    id: int
    exercise_id: str
    completed_at: datetime
    snoozed: bool

    model_config = {"from_attributes": True}

class TodayStats(BaseModel):
    breaks_done: int
    reminders_ignored: int
    total_sitting_minutes: int
    sessions_today: int
