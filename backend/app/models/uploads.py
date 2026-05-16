from sqlalchemy import Column, ForeignKey, Integer, String

from app.core.database import Base


class OutfitUpload(Base):
    __tablename__ = "outfit_uploads"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    image_url = Column(String, nullable=False)
    original_filename = Column(String, nullable=True)
