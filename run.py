from flask import Flask
from flask_pymongo import PyMongo
from db.db_conf import vispace_uri

app = Flask(__name__)
mongo = PyMongo(app, uri=vispace_uri)
from app.index import *

if __name__ == '__main__':
    app.run()
