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
    year_built = db.Column(db.Integer, nullable=True)
    building_SQFT = db.Column(db.String(100), nullable=True)
    building_count = db.Column(db.String(50), nullable=True)
    acre = db.Column(db.Float, nullable=True)
    acre_sqft = db.Column(db.Float, nullable=True)
    address = db.Column(db.String(200), nullable=True)
    mail_address = db.Column(db.String(200), nullable=True)
    mail_city = db.Column(db.String(50), nullable=True)
    mail_state = db.Column(db.String(50), nullable=True)
    mail_zip = db.Column(db.String(20), nullable=True)
    mail_country = db.Column(db.String(50), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    zip_code = db.Column(db.String(50), nullable=True)
    improvement_value = db.Column(db.Float, nullable=True)
    land_value = db.Column(db.Float, nullable=True)
    parcel_value = db.Column(db.Float, nullable=True)
    zoning = db.Column(db.String(50), nullable=True)
    county = db.Column(db.String(50), nullable=True)
    state = db.Column(db.String(50), nullable=True)
    legal_description = db.Column(db.String(180), nullable=True)
    fema_flood_zone = db.Column(db.String(150), nullable=True)
    block = db.Column(db.Float, nullable=True)


def serialize(self):
    return {
        "id": self.id,
        "parcel_number": self.parcel_number,
        "owner": self.owner,
        "address": self.address,
        "mail_address": self.mail_address,
        "mail_city": self.mail_city,
        "mail_state": self.mail_state,
        "mail_zip": self.mail_zip,
        "mail_country": self.mail_country,
        "zip_code": self.zip_code,
        "latitude": self.latitude,
        "longitude": self.longitude,
        "improvement_value": self.improvement_value,
        "land_value": self.land_value,
        "parcel_value": self.parcel_value,
        "acre": self.acre,
        "acre_sqft": self.acre_sqft,
        "building_SQFT": self.building_SQFT,
        "building_count": self.building_count,
        "zoning": self.zoning,
        "county": self.county,
        "state": self.state,
        "legal_description": self.legal_description,
        "fema_flood_zone": self.fema_flood_zone,
        "block": self.block,
     }
