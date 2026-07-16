from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Date,
    DateTime
)
from sqlalchemy.sql import func

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, index=True, nullable=False)

    password = Column(String(255), nullable=False)

    role = Column(String(50), nullable=False)

    department = Column(String(100), nullable=True)

    # -------- Employee Information --------

    employee_code = Column(String(20), unique=True, nullable=True)

    phone = Column(String(15), nullable=True)

    designation = Column(String(100), nullable=True)

    joining_date = Column(Date, nullable=True)

    # --------------------------------------

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