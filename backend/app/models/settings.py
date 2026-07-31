from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime
)
from sqlalchemy.sql import func

from app.database.base import Base


class Settings(Base):

    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)

    company_name = Column(String(200), nullable=True)
    company_email = Column(String(200), nullable=True)
    company_phone = Column(String(30), nullable=True)
    company_website = Column(String(255), nullable=True)
    company_address = Column(String(500), nullable=True)

    language = Column(String(50), default="English")
    timezone = Column(String(100), default="Asia/Kolkata")
    date_format = Column(String(30), default="DD/MM/YYYY")
    theme = Column(String(30), default="System Default")

    email_notifications = Column(Boolean, default=True)
    browser_notifications = Column(Boolean, default=True)
    task_reminders = Column(Boolean, default=True)
    weekly_reports = Column(Boolean, default=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )