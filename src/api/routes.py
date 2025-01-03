"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
import requests
from api.models import db, User
from flask_bcrypt import Bcrypt
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

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

#Login endpoint
@api.route('/login', methods=['POST'])
def login_user():
    body = request.get_json()
    if body["email"] is None:
        return jsonify({"msg":"The email address is missing in the form."}), 400
    user = User.query.filter_by(email=body["email"]).first()
    if user is None:
        return jsonify({"msg":"user not found"}), 401
    valid_password = bcrypt.check_password_hash(user.password, body["password"])
    if not valid_password:
        return jsonify({"msg":"Incorrect password."}), 401
    token = create_access_token(identity=str(user.id), additional_claims={"is admin": user.is_admin})
    return jsonify({"msg":"login successful", "token": token, "id": user.id, "user": user.serialize(), "is_admin": user.is_admin})


@api.route('/excel', methods=['GET'])
def excel_data():

    read_file = pd.read_csv('public/documento.csv')


    return jsonify(read_file.to_dict(orient='records'))
