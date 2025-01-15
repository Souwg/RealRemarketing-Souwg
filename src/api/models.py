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
    Parcel = db.Column(db.String(255), nullable=True)   
    Acres = db.Column(db.String(255), nullable=True)  
    County = db.Column(db.String(255), nullable=True)  
    Owner = db.Column(db.String(255), nullable=True)  
    Range = db.Column(db.String(255), nullable=True)
    Section = db.Column(db.String(255), nullable=True)
    StartingBid = db.Column(db.String(255), nullable=True)
    State= db.Column(db.String(255), nullable=True)
    Township= db.Column(db.String(255), nullable=True)
    Filename = db.Column(db.String(255), nullable=False)

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
    
class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parcel_number = db.Column(db.String(50), nullable=False)
    owner = db.Column(db.String(120), nullable=True)
    zoning = db.Column(db.String(50), nullable=True)
    year_built = db.Column(db.Integer, nullable=True)
    improvement_value = db.Column(db.Float, nullable=True)
    land_value = db.Column(db.Float, nullable=True)
    parcel_value = db.Column(db.Float, nullable=True)
    mail_address = db.Column(db.String(200), nullable=True)
    mail_city = db.Column(db.String(50), nullable=True)
    mail_state = db.Column(db.String(50), nullable=True)
    mail_zip = db.Column(db.String(20), nullable=True)
    mail_country = db.Column(db.String(50), nullable=True)
    address = db.Column(db.String(200), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    acre = db.Column(db.Float, nullable=True)
    acre_sqft = db.Column(db.Float, nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "parcel_number": self.parcel_number,
            "owner": self.owner,
            "zoning": self.zoning,
            "year_built": self.year_built,
            "improvement_value": self.improvement_value,
            "land_value": self.land_value,
            "parcel_value": self.parcel_value,
            "mail_address": self.mail_address,
            "mail_city": self.mail_city,
            "mail_state": self.mail_state,
            "mail_zip": self.mail_zip,
            "mail_country": self.mail_country,
            "address": self.address,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "acre": self.acre,
            "acre_sqft": self.acre_sqft,
        }
