from flask import Flask, render_template, url_for, request, session, redirect
from run import app

import json
import os
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'data/'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)

        # check if the post request has the file part
        if 'file' not in request.files:
            print('No file part')
            return redirect(request.url)

        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            print('No selected file')
            return redirect(request.url)

        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        return redirect(url_for('convert_file', filename=filename))
    return render_template('index.html')


# This route is called after the importation of the file
@app.route('/convert-file/<filename>')
def convert_file(filename):
    json_tab = convert_file_to_json(filename)

    return render_template('index.html', converted=True, filename=filename, json_tab=json_tab)


# This function convert the imported file to json
# The file have a header which we skipped for the conversion
def convert_file_to_json(file):
    parameters = []
    with open(UPLOAD_FOLDER + file, "r") as f:

        json_tab = []
        for i in range(3):  # we skip the header of the imported file
            next(f)
        for i, line in enumerate(f):
            if i == 0:
                file_parameters = line.split()
                for j in file_parameters:
                    parameters.append(j)
            elif i >= 4:
                file_data = line.split()
                json_tab.append(dict(zip(parameters, file_data)))
        create_json_file(file + 'json', json_tab)
    return json_tab


# This function create a json file which it contains the json of the imported file
def create_json_file(json_file_name, json_tab):
    json_file = open("data/json/" + json_file_name, "w")
    json_file.write(json.dumps(json_tab))
    json_file.close()