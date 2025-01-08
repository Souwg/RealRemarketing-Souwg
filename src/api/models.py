from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), default=True)
    is_admin = db.Column(db.Boolean(), default=False)

    def __repr__(self):
        return f'<User {self.email, self.is_admin,}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            "is_admin": self.is_admin,
        }
class Files(db.Model):
    id = db.Column(db.Integer, primary_key=True)  
    Filename = db.Column(db.String(255), nullable=False)  
    Acres = db.Column(db.String(255), nullable=True)  
    County = db.Column(db.String(255), nullable=True)  
    Owner = db.Column(db.String(255), nullable=True) 
    Parcel = db.Column(db.String(255), nullable=True)
    Range = db.Column(db.String(255), nullable=True)
    Section = db.Column(db.String(255), nullable=True)
    StartingBid = db.Column(db.String(255), nullable=True)
    State= db.Column(db.String(255), nullable=True)
    Township= db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f'<FileRow {self.Filename}>'

    def serialize(self):
        return {
            "id": self.id,
            "Filename": self.Filename,
            "Acres": self.Acres,
            "County": self.County,
            "Owner": self.Owner,
            "Parcel": self.Parcel,
            "Range": self.Range,
            "Section": self.Section,
            "StartingBid": self.StartingBid,
            "State": self.State,
            "Township": self.Township,
        }