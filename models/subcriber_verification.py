# models/subscriber_verification.py
from dataclasses import dataclass
from datetime import datetime, timezone
import uuid

@dataclass
class SubscriberVerification:
    uid: str
    token: str
    created_stamp: int
    updated_stamp: int
    expired_stamp: int
    email: str

    @classmethod
    def new_for(cls, email: str, days_valid: int = 7) -> "SubscriberVerification":
        now = int(datetime.now(tz=timezone.utc).timestamp() * 1000)
        uid = str(uuid.uuid4())
        token = str(uuid.uuid4())
        return cls(
            uid=uid,
            token=token,
            created_stamp=now,
            updated_stamp=now,
            expired_stamp=now + days_valid * 24 * 60 * 60 * 1000,
            email=email
        )

    def to_dict(self) -> dict:
        return {
            'uid': self.uid,
            'token': self.token,
            'created_stamp': self.created_stamp,
            'updated_stamp': self.updated_stamp,
            'expired_stamp': self.expired_stamp,
            'email': self.email
        }

    def save(self, db) -> None:
        db.collection('email_verifications').document(self.uid).set(self.to_dict())
