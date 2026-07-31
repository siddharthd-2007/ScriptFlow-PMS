from pydantic import BaseModel
from typing import Optional


class SettingsUpdate(BaseModel):

    company_name: Optional[str] = None
    company_email: Optional[str] = None
    company_phone: Optional[str] = None
    company_website: Optional[str] = None
    company_address: Optional[str] = None

    language: Optional[str] = None
    timezone: Optional[str] = None
    date_format: Optional[str] = None
    theme: Optional[str] = None

    email_notifications: Optional[bool] = None
    browser_notifications: Optional[bool] = None
    task_reminders: Optional[bool] = None
    weekly_reports: Optional[bool] = None


class SettingsResponse(BaseModel):

    id: int

    company_name: Optional[str]
    company_email: Optional[str]
    company_phone: Optional[str]
    company_website: Optional[str]
    company_address: Optional[str]

    language: Optional[str]
    timezone: Optional[str]
    date_format: Optional[str]
    theme: Optional[str]

    email_notifications: bool
    browser_notifications: bool
    task_reminders: bool
    weekly_reports: bool

    class Config:
        from_attributes = True