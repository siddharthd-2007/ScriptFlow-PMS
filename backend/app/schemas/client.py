from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


# -------------------------
# Base Schema
# -------------------------

class ClientBase(BaseModel):
    company_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    website: Optional[str] = None

    industry: Optional[str] = None

    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None

    gst_number: Optional[str] = None

    contact_person: str
    contact_designation: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None

    status: str = "Prospect"

    notes: Optional[str] = None


# -------------------------
# Create Schema
# -------------------------

class ClientCreate(ClientBase):
    pass


# -------------------------
# Update Schema
# -------------------------

class ClientUpdate(BaseModel):
    company_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    website: Optional[str] = None

    industry: Optional[str] = None

    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None

    gst_number: Optional[str] = None

    contact_person: Optional[str] = None
    contact_designation: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None

    status: Optional[str] = None

    notes: Optional[str] = None


# -------------------------
# Response Schema
# -------------------------

class ClientResponse(ClientBase):
    id: int
    company_code: str
    is_active: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)