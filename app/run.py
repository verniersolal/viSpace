from flask import Flask
from flask_pymongo import PyMongo
from db.db_conf import vispace_uri

app = Flask(__name__)
app.config['MONGO_URI'] = vispace_uri
mongo = PyMongo(app)

from app.index import *

if __name__ == '__main__':
    app.run()
