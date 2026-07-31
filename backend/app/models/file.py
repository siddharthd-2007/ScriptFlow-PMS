from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    BigInteger
)

from sqlalchemy.sql import func

from sqlalchemy.orm import relationship

from app.database.base import Base


class File(Base):

    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)

    module_id = Column(
        Integer,
        ForeignKey("modules.id", ondelete="CASCADE"),
        nullable=False
    )

    uploaded_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    original_name = Column(
        String(255),
        nullable=False
    )

    stored_name = Column(
        String(255),
        nullable=False,
        unique=True
    )

    file_path = Column(
        String(500),
        nullable=False
    )

    file_size = Column(
        BigInteger,
        nullable=False
    )

    content_type = Column(
        String(100)
    )

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # Relationships

    module = relationship(
        "Module",
        back_populates="files"
    )

    uploader = relationship(
        "User"
    )