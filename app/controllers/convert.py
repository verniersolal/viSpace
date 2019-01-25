from flask import render_template, url_for, request, redirect
from app.run import app, mongo

collection = mongo.db.file
import gzip
import os
import json

UPLOAD_FOLDER = 'data/'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/dashboard', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        files = request.files.getlist("files")
        for file in files:
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
            convert_file_to_json(file.filename)
            os.remove(app.config['UPLOAD_FOLDER'] + "/" + file.filename)
            models = json.loads(get_models())
        return render_template('graph_interface.html', converted=True, models=models)
    elif request.method == 'GET':
        models = json.loads(get_models())

        return render_template('graph_interface.html', models= models)


def get_column(array, i):
    return [row[i] for row in array]


# This function convert the imported file to json
# The file have a header which we skipped for the conversion
def convert_file_to_json(file):
    parameters = []
    split = file.split('.')
    data = []
    final = {}
    if split[-1] == 'gz':
        with gzip.open(UPLOAD_FOLDER + file, 'rt') as f:
            for i in range(3):  # we skip the header of the imported file
                next(f)
            for i, line in enumerate(f):
                if i == 0:
                    file_parameters = line.split()
                    for j in file_parameters:
                        parameters.append(j)
                elif i >= 4:
                    file_data = line.split()
                    data.append(file_data)
            for p in range(len(parameters)):
                final[parameters[p]] = list(map(float, get_column(data, p)))
            import_file(file, final)
        return final


# This function import the data in the db
def import_file(json_file_name, json_tab):
    star_status = json_file_name.split(".")[:3]
    status = star_status[0] + '.' + star_status[1] + '.' + star_status[2]
    for key in json_tab:
        collection.update_one({"prefixe": status}, {"$set": {"params." + str(key): json_tab[key]}}, upsert=True)


@app.route('/models')
def get_models():
    if request.method == 'GET':
        models = collection.find({}, {'prefixe': 1})
        result = []
        for model in models:
            result.append(model['prefixe'])
    return json.dumps(result)


@app.route('/models/<model>')
def get_parameters_by_model(model):
    parameters = collection.find_one({"prefixe": model})
    if not parameters:
        return "No parameters found"
    keys = parameters['params'].keys()
    result = []
    # We change our results to an array who is more simple to pass in JS
    for key in keys:
        result.append(key)
    return json.dumps(result)


@app.route('/axe_data', methods=['POST'])
def get_parameters():
    # Il faut chercher les deux paramètres x et y des models à construire
    models = []
    results = {}
    for model in request.form.getlist('model[]'):
        print(model)
        mod = collection.find_one({"prefixe": model})
        models.append(collection.find_one({"prefixe": model}))
        results = dict({"model": model, "x_data": mod['params'][request.form['axe_x']]})
        results.update(dict({"model": model, "y_data": mod['params'][request.form['axe_y']]}))
    return json.dumps(results)
