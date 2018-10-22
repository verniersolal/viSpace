from app.run import app
from app.controllers.convert import *

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

