"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

# Inicialización de la app
app = Flask(__name__)

# Permitir todas las solicitudes (solo para desarrollo)
CORS(app)

# Configuración de entorno
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app.url_map.strict_slashes = False

# Obtener la URL de la base de datos desde las variables de entorno
db_url = os.getenv("DATABASE_URL")

# Verificar si está en un contenedor Docker
if not db_url:
    if os.getenv("IN_DOCKER") == "true":
        db_url = "postgresql://gitpod:postgres@db:5432/example"  # 🚀 Cuando corre en Docker
    else:
        db_url = "postgresql://gitpod:postgres@localhost:5432/example"  # 🖥️ Cuando corre en DevContainer

# Reemplazar "postgres://" con "postgresql://" si es necesario
db_url = db_url.replace("postgres://", "postgresql://")

# Imprimir la conexión a la base de datos para depuración
print(f"🔗 Conectando a la base de datos en: {db_url}")

app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Configuración adicional
setup_admin(app)
setup_commands(app)

# Registrar las rutas del blueprint
app.register_blueprint(api, url_prefix='/api')

# Manejar errores como JSON
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Generar el sitemap con todos los endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Manejar cualquier otro archivo estático
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # Evitar caché
    return response

# Ejecutar la app si se llama directamente
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
