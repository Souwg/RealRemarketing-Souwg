"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity, current_user
from flask_bcrypt import Bcrypt
from src.api.utils import APIException, generate_sitemap
from .models import User
from .models import Files, db
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

#upload endpoint
@api.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No se envió ningún archivo"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "El archivo no tiene un nombre válido"}), 400

    try:
        # Asegurar un nombre de archivo seguro
        filename = secure_filename(file.filename)

        # Verificar si ya existe un archivo con el mismo nombre
        existing_file = Files.query.filter_by(Filename=filename).first()
        if existing_file:
            return jsonify({"error": f"El archivo '{filename}' ya existe en la base de datos"}), 400

        # Leer el archivo como DataFrame
        df = pd.read_csv(file)

        # Validar que el DataFrame no esté vacío
        if df.empty:
            return jsonify({"error": "El archivo está vacío"}), 400

        # Iterar sobre las filas y guardarlas en la base de datos
        for _, row in df.iterrows():
            file_row = Files(
                Filename=filename,
                Acres=row.get('Acres'),
                County=row.get('County'),
                Owner=row.get('Owner'),
                Parcel=row.get('Parcel #'),
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
        db.session.rollback()  # Revertir en caso de error
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
        #get all register
        files = Files.query.all()

        #serialize all data
        return jsonify([file.serialize() for file in files]), 200
    except Exception as e:
        print(f"Error al obtener los archivos: {e}")
        return jsonify({"error": f"Error al obtener los archivos: {str(e)}"}), 500




#@api.route('/excel', methods=['GET'])
#def excel_data():

#    read_file = pd.read_csv('public/documento.csv')


#    return jsonify(read_file.to_dict(orient='records'))
