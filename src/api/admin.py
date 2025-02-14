  
import os
from flask_admin import Admin
from .models import db, User
from .models import db, Files
from .models import db, Property
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='RealRemarketing', template_mode='bootstrap3')

    

    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Files,db.session))
    admin.add_view(ModelView(Property,db.session))


