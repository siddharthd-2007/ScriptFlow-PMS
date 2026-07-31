from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Date,
    ForeignKey,
    DateTime,
    Boolean
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base


class Module(Base):

    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    name = Column(
        String(200),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    status = Column(
        String(50),
        default="Planning"
    )

    priority = Column(
        String(20),
        default="Medium"
    )

    start_date = Column(
        Date,
        nullable=True
    )

    end_date = Column(
        Date,
        nullable=True
    )

    lead_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    progress = Column(
        Integer,
        default=0
    )

    is_active = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
    files = relationship(
    "File",
    back_populates="module",
    cascade="all, delete-orphan"
)