"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from sqlalchemy.dialects.postgresql import insert
from flask_jwt_extended import create_access_token, jwt_required, get_jwt,get_jwt_identity, current_user
from flask_bcrypt import Bcrypt
from sqlalchemy.orm.attributes import flag_modified
from src.api.utils import APIException, generate_sitemap
from .models import User
from .models import Files, db
from .models import Property, db
from flask_cors import CORS
import jwt
import os
import datetime
from src.app import db
from flask import jsonify, request
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
import requests
import pandas as pd 



app = Flask(__name__)
bcrypt = Bcrypt(app)
api = Blueprint('api', __name__)
REGRID_API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWdyaWQuY29tIiwiaWF0IjoxNzM2NDQzNDU4LCJleHAiOjE3MzkwMzU0NTgsInUiOjQ4MjQxNSwiZyI6MjMxNTMsImNhcCI6InBhOnRzOnBzOmJmOm1hOnR5OmVvOnpvOnNiIn0.GxFicvA7XmyTh2uIIgJ-HwqN1NT3eQ6NArT1KkbrAT4"
REGRID_API_URL = "https://app.regrid.com/api/v2/parcels/apn"


CORS(api)



@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

#Signup endpoint
@api.route('/signup', methods=['POST'])
def signup_user():
    body=request.get_json()
    if body['name'] is None:
        return jsonify({"msg":"This field is required."})
    if body['email'] is None:
        return jsonify({"msg":"the email is required"}),400
    if body['password'] is None:
        return jsonify({"msg":"the password is required"}),400
    
    existing_user = User.query.filter_by(email=body['email']).first()
    if existing_user:
        return jsonify({"msg":"This email is already registered."}), 400
    
    #The password is hashed and encrypted for security
    body['password']=bcrypt.generate_password_hash(body['password']).decode('utf-8')
    #It is stored in the database
    user = User(name=body['name'], last_name=body['last_name'], email=body['email'], password=body['password'], is_active=True)
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User created successfully", "user":user.serialize()})

# Login endpoint
@api.route('/login', methods=['POST'])
def login_user():
    body = request.get_json()
    print("Email recibido:", body.get('email'))
    print("Password recibido:", body.get('password'))
    if not body or not body.get('email') or not body.get('password'):
        return jsonify({"msg": "Email and password are required"}), 400

    user = User.query.filter_by(email=body['email']).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    if not check_password_hash(user.password, body['password']):
        return jsonify({"msg": "Invalid password"}), 401

    # Generate JWT
    payload = {
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # Token valid for 24 hours
    }
    token = jwt.encode(payload, 'masd56dd5sdgs158ds65dsg456s2gsg156g4ds8g9ds1s3d202ds0dsg54dsgds', algorithm='HS256')

    return jsonify({
        "msg": "Login successful",
        "token": token,
        "user": user.serialize()
    }), 200

#upload file
@api.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No se envió ningún archivo"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "El archivo no tiene un nombre válido"}), 400

    try:
        
        filename = secure_filename(file.filename)
        existing_file = Files.query.filter_by(Filename=filename).first()

        if existing_file:
            return jsonify({"error": f"El archivo '{filename}' ya existe en la base de datos"}), 400
        df = pd.read_csv(file)

        if df.empty:
            return jsonify({"error": "El archivo está vacío"}), 400

        for _, row in df.iterrows():
            file_row = Files(
                Filename=filename,
                Acres=row.get('Acres') ,
                County=row.get('County'),
                Owner=row.get('Owner'),
                Parcel=row.get('Parcel #') or row.get('Account Number'),
                Range=row.get('Range'),
                Section=row.get('Section'),
                StartingBid=row.get('Starting Bid'),
                State=row.get('State'),
                Township=row.get('Township'),
            )
            db.session.add(file_row)

        db.session.commit()

        return jsonify({"message": f"Archivo '{filename}' procesado y guardado en la base de datos"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al procesar el archivo: {e}")
        return jsonify({"error": f"Error al procesar el archivo: {str(e)}"}), 500


    except Exception as e:
        db.session.rollback() 
        print(f"Error al procesar el archivo: {e}") 
        return jsonify({"error": f"Error al procesar el archivo: {str(e)}"}), 500
    

#Delete all Files
@api.route('/delete-all-files', methods=['DELETE'])
def delete_all_files():
    try:
        db.session.query(Files).delete()
        db.session.commit()
        return jsonify({"message": "Todos los registros han sido eliminados"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error al eliminar los registros: {e}")
        return jsonify({"error": f"Error al eliminar los registros: {str(e)}"}), 500
    
@api.route('/files', methods=['GET'])
def get_all_files():
    try:
        files = Files.query.all()
        return jsonify([file.serialize() for file in files]), 200
    except Exception as e:
        print(f"Error al obtener los archivos: {e}")
        return jsonify({"error": f"Error al obtener los archivos: {str(e)}"}), 500
    

#upload properties with regrid
@api.route('/uploadproperties', methods=['POST'])
def upload_properties():
    body = request.get_json()

    if not body or not body.get('parcels'):
        return jsonify({"msg": "No data provided"}), 400

    parcels = body.get('parcels')
    inserted_count = 0
    skipped_count = 0

    for parcel in parcels:
        property_data = parcel.get('properties', {}).get('fields', {})

        stmt = insert(Property).values(
            parcel_number=property_data.get('parcelnumb'),
            owner=property_data.get('owner'),
            zoning=property_data.get('zoning'),
            year_built=property_data.get('yearbuilt'),
            improvement_value=property_data.get('improvval'),
            land_value=property_data.get('landval'),
            parcel_value=property_data.get('parval'),
            mail_address=property_data.get('mailadd'),
            mail_city=property_data.get('mail_city'),
            mail_state=property_data.get('mail_state2'),
            mail_zip=property_data.get('mail_zip'),
            mail_country=property_data.get('mail_country'),
            address=property_data.get('address'),
            zip_code=property_data.get('szip'),
            building_SQFT=property_data.get('ll_bldg_footprint_sqft'),
            building_count=property_data.get('ll_bldg_count'),
            legal_description=property_data.get('legaldesc'),
            county=property_data.get('county'),
            state=property_data.get('state2'),
            latitude=property_data.get('lat'),
            longitude=property_data.get('lon'),
            acre=property_data.get('ll_gisacre'),
            acre_sqft=property_data.get('ll_gissqft'),
            fema_flood_zone=property_data.get('fema_flood_zone_raw'),
        ).on_conflict_do_nothing(index_elements=['parcel_number'])  # 🔥 Ignorar duplicados

        result = db.session.execute(stmt)
        if result.rowcount > 0:
            inserted_count += 1
        else:
            skipped_count += 1

    db.session.commit()

    return jsonify({
        "msg": f"Upload completed: {inserted_count} new properties added, {skipped_count} duplicates skipped."
    }), 200

#delete all properties
@api.route('/delete/properties', methods=['DELETE'])
def delete_properties():
    try:
        db.session.query(Property).delete()
        db.session.commit()
        return jsonify({"message": "Todos los archivos han sido eliminados"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error al eliminar los registros: {e}")
        return jsonify({"error": f"Error al eliminar los registros: {str(e)}"}), 500
    
#delete one by one property
@api.route('/delete/property/<string:parcel_number>', methods=['DELETE'])
def delete_property(parcel_number):
    try:
        property_to_delete = Property.query.filter_by(parcel_number=parcel_number).first()
        if not property_to_delete:
            return jsonify({"message": "Property not found"}), 404
        db.session.delete(property_to_delete)
        db.session.commit()
        return jsonify({"message": f"Property with parcel number {parcel_number} has been deleted"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error while deleting the property: {e}")
        return jsonify({"error": f"Error while deleting the property: {str(e)}"}), 500

#Get all properties
@api.route('/properties', methods=['GET'])
def get_properties():
    try:
        properties = Property.query.all()
        return jsonify([property.serialize() for property in properties]), 200
    except Exception as e:
        print(f"Error al obtener los archivos: {e}")
        return jsonify({"error": f"Error al obtener los archivos: {str(e)}"}), 500
    
#Get one by one property
@api.route('/property/<string:parcel_number>', methods=['GET'])
def get_property(parcel_number):
    try:
        property_data = Property.query.filter_by(parcel_number=parcel_number).first()
        if not property_data:
            return jsonify({"error": "Property not found"}), 404
        return jsonify(property_data.serialize()), 200
    except Exception as e:
        print(f"Error al obtener la propiedad: {e}")
        return jsonify({"error": f"Error al obtener la propiedad: {str(e)}"}), 500
    
#Edit column property
@api.route('/update/property/<string:parcel_number>', methods=['PUT'])
def update_property(parcel_number):
    try:
        body = request.get_json()
        print("📌 Datos recibidos en el backend:", body)  # Debugging

        if not body:
            return jsonify({"error": "No data provided"}), 400

        # Buscar la propiedad
        property_to_update = Property.query.filter_by(parcel_number=parcel_number).first()
        if not property_to_update:
            return jsonify({"message": "Property not found"}), 404

        # Lista de campos numéricos en la base de datos (ajusta según tu modelo)
        numeric_fields = [
            "acre", "acre_sqft", "building_SQFT", "building_count",
            "improvement_value", "land_value", "latitude", "longitude",
            "parcel_value", "year_built"
        ]

        # Validar y convertir los datos antes de actualizar
        for key, value in body.items():
            print(f"🔄 Intentando actualizar {key}: {value}")  # Debugging

            if hasattr(property_to_update, key):  
                # Si es un campo numérico, intentamos convertirlo a número
                if key in numeric_fields:
                    try:
                        value = float(value) if value is not None else None
                    except ValueError:
                        return jsonify({"error": f"Invalid value for {key}: {value}"}), 400
                
                setattr(property_to_update, key, value)

            else:
                # Si el campo no existe en la tabla, guardarlo en additional_data
                if property_to_update.additional_data is None:
                    property_to_update.additional_data = {}

                if value is None:
                    property_to_update.additional_data.pop(key, None)
                else:
                    property_to_update.additional_data[key] = value

        flag_modified(property_to_update, "additional_data")
        db.session.commit()

        return jsonify({"message": "Property updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print("❌ Error en el backend:", str(e))
        return jsonify({"error": str(e)}), 500
    
#Delete one by one cell
@api.route('/delete/property-field/<string:parcel_number>/<string:field_name>', methods=['DELETE'])
def delete_property_field(parcel_number, field_name):
    try:
        property_to_update = Property.query.filter_by(parcel_number=parcel_number).first()

        if not property_to_update:
            return jsonify({"message": "Property not found"}), 404

        field_name = field_name.strip()  # Normalizar el nombre del campo

        print(f"\n🗑️ Intentando eliminar el campo: '{field_name}' de la propiedad {parcel_number}")
        print("📌 Estado actual de la propiedad antes de eliminar:", property_to_update.__dict__)
        print("📌 Campos en additional_data antes de eliminar:", property_to_update.additional_data)

        field_found = False  # Bandera para saber si eliminamos algo

        # Verificar si el campo es un atributo normal de la tabla
        if hasattr(property_to_update, field_name):
            print(f"✅ Eliminando campo '{field_name}' de la tabla Property.")
            setattr(property_to_update, field_name, None)  # También podrías usar `""`
            field_found = True

        # Verificar si `additional_data` es un diccionario válido y corregir estructura
        if isinstance(property_to_update.additional_data, dict):
            additional_data = property_to_update.additional_data

            # Si `additional_data` tiene otro nivel anidado incorrectamente, corregirlo
            if "additional_data" in additional_data and isinstance(additional_data["additional_data"], dict):
                print("⚠️ Se encontró additional_data anidado incorrectamente, corrigiéndolo...")
                additional_data = additional_data["additional_data"]

            # Buscar y eliminar el campo dentro de `additional_data`
            if field_name in additional_data:
                print(f"✅ Eliminando campo '{field_name}' de additional_data.")
                del additional_data[field_name]
                property_to_update.additional_data = additional_data
                flag_modified(property_to_update, "additional_data")  # Notificar a SQLAlchemy
                field_found = True

        if not field_found:
            print(f"❌ Campo '{field_name}' no encontrado en la propiedad.")
            return jsonify({"message": f"Field '{field_name}' not found in the property"}), 404

        db.session.commit()
        print(f"✅ Campo '{field_name}' eliminado correctamente.")
        return jsonify({"message": f"Field '{field_name}' deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
#@api.route('/excel', methods=['GET'])
#def excel_data():

#    read_file = pd.read_csv('public/documento.csv')


#    return jsonify(read_file.to_dict(orient='records'))