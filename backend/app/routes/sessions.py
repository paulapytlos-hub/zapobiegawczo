from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession
from sqlalchemy import func
from datetime import datetime, timezone, timedelta
from ..database import get_db
from ..models import Session, Break
from ..schemas import SessionCreate, SessionResponse, SessionEnd, BreakCreate, BreakResponse, TodayStats

router = APIRouter()


@router.post("/start", response_model=SessionResponse)
def start_session(data: SessionCreate, db: DBSession = Depends(get_db)):
    session = Session(interval_minutes=data.interval_minutes)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.patch("/{session_id}/end", response_model=SessionResponse)
def end_session(session_id: int, data: SessionEnd, db: DBSession = Depends(get_db)):
    session = db.get(Session, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sesja nie znaleziona")
    session.ended_at = datetime.now(timezone.utc)
    session.duration_seconds = data.duration_seconds
    db.commit()
    db.refresh(session)
    return session


@router.post("/{session_id}/breaks", response_model=BreakResponse)
def log_break(session_id: int, data: BreakCreate, db: DBSession = Depends(get_db)):
    session = db.get(Session, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sesja nie znaleziona")
    brk = Break(session_id=session_id, exercise_id=data.exercise_id, snoozed=data.snoozed)
    db.add(brk)
    db.commit()
    db.refresh(brk)
    return brk


@router.get("/today", response_model=TodayStats)
def today_stats(db: DBSession = Depends(get_db)):
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

    sessions_today = db.query(Session).filter(Session.started_at >= today_start).all()
    session_ids = [s.id for s in sessions_today]

    breaks_done = db.query(Break).filter(
        Break.session_id.in_(session_ids),
        Break.snoozed == False
    ).count() if session_ids else 0

    reminders_ignored = db.query(Break).filter(
        Break.session_id.in_(session_ids),
        Break.snoozed == True
    ).count() if session_ids else 0

    total_seconds = sum(
        s.duration_seconds for s in sessions_today if s.duration_seconds
    )

    return TodayStats(
        breaks_done=breaks_done,
        reminders_ignored=reminders_ignored,
        total_sitting_minutes=total_seconds // 60,
        sessions_today=len(sessions_today),
    )
