from sqlalchemy.orm import Session

from app.models.client import Client
from app.schemas.client import ClientCreate, ClientUpdate


class ClientRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_clients(self):
        return (
            self.db.query(Client)
            .filter(Client.is_active == True)
            .all()
        )

    def get_client_by_id(self, client_id: int):
        return (
            self.db.query(Client)
            .filter(
                Client.id == client_id,
                Client.is_active == True
            )
            .first()
        )

    def create_client(self, client: ClientCreate):

        db_client = Client(
            **client.model_dump(),
            company_code=f"CL{str(self.db.query(Client).count()+1).zfill(4)}"
        )

        self.db.add(db_client)
        self.db.commit()
        self.db.refresh(db_client)

        return db_client

    def update_client(
        self,
        db_client: Client,
        client: ClientUpdate
    ):

        update_data = client.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_client, key, value)

        self.db.commit()
        self.db.refresh(db_client)

        return db_client

    def delete_client(self, db_client: Client):

        db_client.is_active = False

        self.db.commit()

        return db_client