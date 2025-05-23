# models/subscriber.py
from dataclasses import dataclass, field
from typing import Optional
from firebase_admin import firestore
import uuid

@dataclass
class Subscriber:
    uid: str
    email: str
    subscribed_at: any = field(default_factory=lambda: firestore.SERVER_TIMESTAMP)
    unsubscribed_at: Optional[any] = None
    is_email_verified: bool = False
    first_name: str = ''
    first_name_search: str = ''
    last_name: str = ''
    last_name_search: str = ''
    phone_number: str = ''
    address: str = ''
    address_search: str = ''
    scid: str = ''
    fcm_token: str = ''
    gender: str = ''
    dob: Optional[any] = None

    @classmethod
    def new(cls, email: str) -> "Subscriber":
        return cls(uid=str(uuid.uuid4()), email=email)

    def to_dict(self) -> dict:
        return {
            'uid': self.uid,
            'email': self.email,
            'subscribed_at': self.subscribed_at,
            'unsubscribed_at': self.unsubscribed_at,
            'is_email_verified': self.is_email_verified,
            'first_name': self.first_name,
            'first_name_search': self.first_name.lower() if self.first_name else '',
            'last_name': self.last_name,
            'last_name_search': self.last_name.lower() if self.last_name else '',
            'phone_number': self.phone_number,
            'address': self.address,
            'address_search': self.address.lower() if self.address else '',
            'scid': self.scid,
            'fcm_token': self.fcm_token,
            'gender': self.gender,
            'dob': self.dob,
        }

    def save(self, db) -> None:
        db.collection('subscribers').document(self.uid).set(self.to_dict())
