from flask import Flask, render_template, url_for, request, session, redirect
from viSpace import *
from convert import *

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

