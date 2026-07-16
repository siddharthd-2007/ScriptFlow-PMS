from app.models.client import Client
from app.repositories.client_repository import ClientRepository
from app.schemas.client import ClientCreate, ClientUpdate


class ClientService:
    def __init__(self, repository: ClientRepository):
        self.repository = repository

    def get_all_clients(self):
        return self.repository.get_all_clients()

    def get_client_by_id(self, client_id: int):
        return self.repository.get_client_by_id(client_id)

    def create_client(self, client: ClientCreate):
        return self.repository.create_client(client)

    def update_client(
        self,
        db_client: Client,
        client: ClientUpdate
    ):
        return self.repository.update_client(db_client, client)

    def delete_client(self, db_client: Client):
        return self.repository.delete_client(db_client)