from flask import render_template, url_for, request, redirect
from app.run import app, mongo
collection = mongo.db.file
import gzip
import os
UPLOAD_FOLDER = 'data/'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/upload_files', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        files = request.files.getlist("file[]")
        for file in files:
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
            convert_file_to_json(file.filename)
        return render_template('graph_interface.html', converted=True)
    return render_template('index.html')


def get_column(array, i):
    return [row[i] for row in array]


# This function convert the imported file to json
# The file have a header which we skipped for the conversion
def convert_file_to_json(file):
    parameters = []
    split = file.split('.')
    data = []
    final= {}
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
                final[parameters[p]] = get_column(data, p)
            import_file(file, final)
        return final


# This function import the data in the db
def import_file(json_file_name, json_tab):
    star_status = json_file_name.split(".")[:3]
    status = star_status[0] + '.' + star_status[1] + '.' + star_status[2]
    for key in json_tab:
        collection.update_one({"prefixe": status}, {"$set": {"params."+str(key): json_tab[key]}}, upsert=True)


@app.route('/dashboard', methods=['GET'])
def get_models():
    if request.method == 'GET':
        models = collection.find({}, {'prefixe':1})
        result = []
        for model in models:
            result.append(model['prefixe'])
        get_parameters_by_model(result[0])
        get_parameters(result[0])
    return render_template('index.html')


def get_parameters_by_model(model):
    parameters = collection.find_one({"prefixe": model})
    keys = parameters['params'].keys()
    result = []
    # We change our results to an array who is more simple to pass in JS
    for key in keys:
        result.append(key)
    return result


@app.route('/dashboard', methods=['POST'])
def get_parameters(model):
    results = dict()
    # Ici nous aurons dans la variable request les parametres des axes ainsi que le nom du model
    parameters = collection.find_one({"prefixe": model})
    for k in parameters['params'].keys():
        if k in request.parameters:
            results[k] = parameters['params'][k]
    return results

