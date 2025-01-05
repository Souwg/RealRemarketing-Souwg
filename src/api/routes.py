"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity, current_user
from flask_bcrypt import Bcrypt
from api.utils import generate_sitemap, APIException
from .models import User
from flask_cors import CORS
import jwt
import datetime
from flask import jsonify, request
from werkzeug.security import check_password_hash
import requests
import pandas as pd 



app = Flask(__name__)
bcrypt = Bcrypt(app)
api = Blueprint('api', __name__)

# Allow CORS requests to this API
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


@api.route('/excel', methods=['GET'])
def excel_data():

    read_file = pd.read_csv('public/documento.csv')


    return jsonify(read_file.to_dict(orient='records'))
