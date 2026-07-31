from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.repositories.settings_repository import SettingsRepository
from app.services.settings_service import SettingsService
from app.schemas.settings import (
    SettingsUpdate,
    SettingsResponse,
)

router = APIRouter(
    prefix="/settings",
    tags=["Settings"]
)


@router.get(
    "/",
    response_model=SettingsResponse
)
def get_settings(
    db: Session = Depends(get_db)
):

    service = SettingsService(
        SettingsRepository(db)
    )

    return service.get_settings()


@router.put(
    "/",
    response_model=SettingsResponse
)
def update_settings(
    settings: SettingsUpdate,
    db: Session = Depends(get_db)
):

    service = SettingsService(
        SettingsRepository(db)
    )

    return service.update_settings(
        settings.model_dump(exclude_unset=True)
    )