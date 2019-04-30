from flask import render_template, url_for, request, redirect
from app.run import app, mongo

collection = mongo.db.file
import gzip
import os
import json
import pandas as pd
import re
import math
import numpy as np
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
        return render_template('graph_interface.html', converted=True, models=json.loads(get_models()))
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
    result = []
    models = collection.find({}, {'prefixe': 1})
    for model in models:
        if model['prefixe'] != 'observation':
            result.append(model['prefixe'])
    return json.dumps(result)


@app.route('/models/parameters', methods=['POST'])
def get_parameters_by_model():
    result = []
    for model in request.get_json()['model']:
        parameters = collection.find_one({"prefixe": model})
        if not parameters:
            return "No parameters found"
        keys = parameters['params'].keys()
        # We change our results to an array who is more simple to pass in JS
        for key in keys:
            result.append(key)
    # Here we check if parameter is in all models we want visualize
    final = [x for x in result if result.count(x) == len(request.get_json()['model'])]
    return json.dumps(list(set(final)))


@app.route('/axe_data', methods=['POST'])
def get_parameters():
    if request.form['chartType'] == "parCoord":
        return get_parameters_for_parallel_coord(request.form)
    else:
        # Il faut chercher les deux paramètres x et y des models à construire
        models = []
        if 'model' in request.form:
            models.append(request.form['model'])
        else:
            models = request.form.getlist('model[]')

        results = []
        print(request.form)
        isLogX = True if 'isLogX' in request.form else False
        isLogY = True if 'isLogY' in request.form else False

        for model in models:
            mod = collection.find_one({"prefixe": model})
            results.append(dict({
                "x_data": mod['params'][request.form['axe_x']],
                "y_data": mod['params'][request.form['axe_y']],
                "model": mod['params']['model']}))
        final = dict({
            "models": results,
            "chartType": request.form['chartType'],
            "isLogX": isLogX,
            "isLogY": isLogY,
            "model_name": models,
            "axe_x": request.form['axe_x'],
            "axe_y": request.form['axe_y']
        })
        print(final['model_name'])
        return json.dumps(final)

# Pour les coordonnées parallèles il nous faut un tableau d'axes (axe 1 , axe 2 , ...)
# et un tableau de modèles (modèle 1 modèle 2 ...)
def get_parameters_for_parallel_coord(data):
    models = []
    if 'model' in data:
        models.append(data['model'])
    else:
        models = data.getlist('model[]')
    axes_names = list(set((data.get('axe_'+str(index+1)), True)
                          if data.get('axe_'+str(index+1)) is not "" and 'isLog'+str(index+1) in data
                          else (data.get('axe_'+str(index+1)), False)
                          for index in range(len(data.getlist('axes[]')))))
    logs = [x[1] for x in axes_names if x[0] is not '']
    axes_names = [x[0] for x in axes_names if x[0] is not '']
    models_data = []
    axes_names.append('model')
    for model in models:
        data_array = []
        mod = collection.find_one({"prefixe": model})
        for i in axes_names:
            data_array.append(mod['params'][i])
        zipped_values = list(zip(*data_array))
        dict_of_parameters = []
        for tuple_values in zipped_values:
            dict_of_parameters.append(dict(
                {parameter: tuple_values[index] for index, parameter in enumerate(axes_names)}))
        models_data.append([dict(item, **{"famille": model}) for item in dict_of_parameters])
    result = dict()
    result["data"] = [item for sublist in models_data for item in sublist]
    result["models"] = models
    result["axes"] = axes_names
    result['log'] = logs
    result["chartType"] = 'parCoords'
    return json.dumps(result)


@app.route('/import-observations', methods=['GET', 'POST'])
def import_observations():
    file = request.files['file']
    print(request.files['file'].filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))

    parameters = []
    data = []
    with open(UPLOAD_FOLDER + file.filename, 'r') as f:
        lines = f.readlines()
        for index, line in enumerate(lines):
            if index == 0:
                parameters.extend(re.split(r'\s+', line))
            else:
                data.append(re.split(r'\s+', line))
    parameters[0] = parameters[0] + parameters[1]
    parameters[1] = ''
    parameters = list(filter(None, parameters))
    data = list(map(lambda x: list(filter(None, x)), data))
    df = pd.DataFrame(data, columns=parameters)
    test = df.to_json(orient='records')
    print(json.loads(test))
    test = json.loads(test)
    collection.update_one({"prefixe": 'observation'}, {"$set": {"params": test}}, upsert=True)

    return redirect(url_for('upload_file'))


@app.route('/get-observations/<x_axe>&<y_axe>', methods=['GET'])
def get_observations(x_axe, y_axe):
    # in this method we want take the obs coords of several parameters
    # which are Teff, geff, L in hr case
    # so we need to check if x and y axes are in observations and returns that like a json object
    # And draw error in graph
    observations = collection.find_one({'prefixe': 'observation'})['params']
    available_parameters = ['Teff', 'geff', 'L']
    print('before available')
    print('x_axe: ', x_axe, ' y_axe : ', y_axe)
    if x_axe in available_parameters and y_axe in available_parameters:
        if x_axe == 'Teff':
            x_axe_obs = 'Teff_jg'
        if y_axe == 'Teff':
            y_axe_obs = 'Teff_jg'
        if x_axe == 'geff':
            x_axe_obs = 'log_g_jg'
        if y_axe == 'geff':
            y_axe_obs = 'log_g_jg'
        if x_axe == 'L':
            x_axe_obs = 'L_adopted'
        if y_axe == 'L':
            y_axe_obs = 'L_adopted'
        print('in available')
        print(observations)
        needed_parameters = list(map(lambda x: {x_axe: x[x_axe_obs], y_axe: x[y_axe_obs]}, observations))
        return json.dumps(needed_parameters)
    else:
        return {'message': 'Not good parameters'}


@app.route('/prediction', methods=['GET'])
def predict_rendering():

    return render_template('prediction_interface.html', keys=get_obs_params(), models=get_models_name(), method='GET')


def getHrParams():
    pass


def get_obs_params():
    return collection.find_one({'prefixe': 'observation'})['params'][0].keys()


@app.route('/predict', methods=['POST'])
def predict():
    request_data = json.loads(list(request.form)[0])
    observations = list(map(lambda x: x['value'], list(filter(lambda x: x['name'] == 'parameters', request_data))))
    errors = list(map(lambda x: 'e'+x, observations))
    model_data = {}
    model_data['M'] = []
    model_data['R'] = []
    model_data['t'] = []
    models = list(map(lambda x: x['value'], list(filter(lambda x: x['name'] == 'predictModel', request_data))))
    for model in models:  # pour chaque model dans la base de données
        model_parameters = collection.find_one({'prefixe': model})['params']  # parametres du model model
        for obs in observations:  # pour chaque observation
            if obs in model_parameters.keys():
                if obs in model_data.keys():
                    model_data[obs].extend(model_parameters[obs])
                else:
                    model_data[obs] = model_parameters[obs]
        model_data['M'].extend(model_parameters['M'])
        model_data['R'].extend(model_parameters['R'])
        model_data['t'].extend(model_parameters['t'])
    obs_in_db = collection.find_one({'prefixe': 'observation'})['params']
    obs = list(map(lambda o: list(map(lambda l: {l: o[l]}, list(filter(lambda x: x in observations or x in errors, o)))), obs_in_db))
    result_obs = []
    for ob in obs:
        tmp = {}
        for i in ob:
            tmp.update(i)
        result_obs.append(tmp)
    df_obs = pd.DataFrame(result_obs)
    hr = pd.DataFrame.from_dict(model_data)
    obs = df_obs.sample(3)
    logList = []
    maxi = []
    for index in obs.index:
        logV = []
        for value in range(len(hr)):
            dist = []
            prod = []
            for column in obs.columns:
                if column in hr.columns:
                    dist.append(((float(obs[column][index]) - float(hr[column][value]))
                                 / float(obs["e" + column][index])) ** 2)
                    prod.append(1 / (math.sqrt(2 * math.pi) * float(obs["e" + column][index])))
            logV.append(np.prod(prod) * np.exp(-(sum(dist)) / 2))
        logList.append(logV)
        maxi.append(max(logV))
    indexes = []
    for k in range(len(obs)):
        indexes.append([index for index, value in enumerate(logList[k]) if value >= 0.95 * maxi[k]])
    M = []
    R = []
    T = []
    m = []
    r = []
    t = []
    for log_index in indexes:
        m = []
        r = []
        t = []
        for ind in log_index:
            m.append(hr['M'][ind])
            r.append(hr['R'][ind])
            t.append(hr['t'][ind])
        M.append(m)
        R.append(r)
        T.append(t)
    Mestim = 0
    Restim = 0
    Testim = 0
    LM = []
    LR = []
    LT = []
    for o in range(len(M)):
        for e in range(len(M[o])):
            Mestim = np.mean(M[o][e])
            Restim = np.mean(R[o][e])
            Testim = np.mean(T[o][e])
        LM.append(Mestim)
        LR.append(Restim)
        LT.append(Testim)
    obs['M'] = LM
    obs['R'] = LR
    obs['t'] = LT
    resp = obs.to_json(orient='records')
    return resp


def get_models_name():
    result = []
    models = collection.find({}, {'prefixe': 1})
    for model in models:
        if model['prefixe'] != 'observation':
            result.append(model['prefixe'])
    return result
