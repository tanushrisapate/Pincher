from sqlalchemy import Column, ForeignKey, Integer, String

from app.core.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    image_url = Column(String, nullable=False)
    aesthetic = Column(String, nullable=False)
    confidence = Column(Integer, nullable=False)
