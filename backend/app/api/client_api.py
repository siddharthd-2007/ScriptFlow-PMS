from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.repositories.client_repository import ClientRepository
from app.schemas.client import (
    ClientCreate,
    ClientUpdate,
    ClientResponse,
)
from app.services.client_service import ClientService

router = APIRouter(
    prefix="/clients",
    tags=["Clients"]
)


@router.get("/", response_model=list[ClientResponse])
def get_clients(db: Session = Depends(get_db)):
    service = ClientService(ClientRepository(db))
    return service.get_all_clients()


@router.get("/{client_id}", response_model=ClientResponse)
def get_client(client_id: int, db: Session = Depends(get_db)):
    service = ClientService(ClientRepository(db))

    client = service.get_client_by_id(client_id)

    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    return client


@router.post("/", response_model=ClientResponse)
def create_client(
    client: ClientCreate,
    db: Session = Depends(get_db)
):
    service = ClientService(ClientRepository(db))
    return service.create_client(client)


@router.put("/{client_id}", response_model=ClientResponse)
def update_client(
    client_id: int,
    client: ClientUpdate,
    db: Session = Depends(get_db)
):
    service = ClientService(ClientRepository(db))

    db_client = service.get_client_by_id(client_id)

    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")

    return service.update_client(db_client, client)


@router.delete("/{client_id}")
def delete_client(
    client_id: int,
    db: Session = Depends(get_db)
):
    service = ClientService(ClientRepository(db))

    db_client = service.get_client_by_id(client_id)

    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")

    service.delete_client(db_client)

    return {"message": "Client deactivated successfully"}