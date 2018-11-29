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
        return render_template('graph_interface.html', converted=True)
    elif request.method == 'GET':
        return render_template('graph_interface.html')


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
    if request.method == 'POST':
        results = dict()
        if 'family_chart' in request.form and 'axe_x' in request.form and 'axe_y' in request.form and 'position' in request.form:
            if request.form['family_chart'] == "linearChart" or request.form['family_chart'] == "pointCloud":
                model_x = collection.find_one({"prefixe": request.form['model_x']})
                if request.form['axe_x'] in model_x['params'].keys():
                    axe_x = request.form['axe_x']
                    results = dict({"axe_x": {"name": axe_x, "values": model_x['params'][axe_x]}})
                model_y = collection.find_one({"prefixe": request.form['model_y']})
                if request.form['axe_y'] in model_y['params'].keys():
                    results.update(dict({"axe_y": {"name": request.form['axe_y'], "values": model_y['params'][request.form['axe_y']]}}))

                results['family_chart'] = request.form['family_chart']
                if 'isLog_y' in request.form:
                    results['isLog_y'] = True
                else:
                    results['isLog_y'] = False
                if 'isLog_x' in request.form:
                    results['isLog_x'] = True
                else:
                    results['isLog_x'] = False

                results['position'] = request.form['position']
                return json.dumps(results)
            else:
                return json.dumps({"message": "CP in construct", "error": True})
        else:
            return json.dumps({"message": "Not valid parameters", "error": True})
