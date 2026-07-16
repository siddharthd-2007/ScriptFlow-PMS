from sqlalchemy.orm import Session

from app.models.user import User

from app.core.security import (
    verify_password,
    create_access_token,
    hash_password
)

from app.schemas.user import UserCreate

from app.repositories.user_repository import UserRepository


class AuthService:

    @staticmethod
    def login(db: Session, email: str, password: str):

        user = UserRepository.get_by_email(db, email)

        if not user:
            return None

        if not verify_password(password, user.password):
            return None

        token = create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "role": user.role
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user
        }

    @staticmethod
    def register(db: Session, user_data: UserCreate):

        # Check if email already exists
        existing_user = UserRepository.get_by_email(
            db,
            user_data.email
        )

        if existing_user:
            return None

        # Create new user
        new_user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            password=hash_password(user_data.password),
            role=user_data.role,
            department=user_data.department,
        )

        return UserRepository.create(db, new_user)