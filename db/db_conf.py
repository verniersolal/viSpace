from pymongo import MongoClient

vispace_uri = 'mongodb://admin:vispace34@ds137643.mlab.com:37643/vispace'

client = MongoClient(vispace_uri)

db = client.vispace

collection = db.file
