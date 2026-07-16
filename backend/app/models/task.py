from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Date,
    Boolean,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func

from app.database.base import Base


class Task(Base):

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)

    description = Column(Text, nullable=True)

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    assigned_to = Column(
    Integer,
    ForeignKey("users.id"),
    nullable=True
)

    priority = Column(
        String(20),
        default="Medium"
    )

    status = Column(
        String(30),
        default="To Do"
    )

    start_date = Column(Date, nullable=True)

    due_date = Column(Date, nullable=True)

    estimated_hours = Column(Integer, default=0)

    actual_hours = Column(Integer, default=0)

    is_active = Column(Boolean, default=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )