from flask import render_template, url_for, request, redirect
from app.run import app, mongo
collection = mongo.db.file
import gzip
UPLOAD_FOLDER = 'data/'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/upload_files', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        jsontab = []
        files = request.files.getlist("file[]")
        for file in files:
            jsontab.append(convert_file_to_json(file.filename))
        return render_template('index.html', converted=True, json_tab=jsontab)
    return render_template('index.html')


# This function convert the imported file to json
# The file have a header which we skipped for the conversion
def convert_file_to_json(file):
    parameters = []
    split = file.split('.')
    if split[-1] == 'gz':
        with gzip.open(UPLOAD_FOLDER + file, 'rt') as f:
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
        postVisu(file, json_tab)
        return json_tab


# This function create a json file which it contains the json of the imported file
def postVisu(json_file_name, json_tab):
    file_name = json_file_name.split(".")[-3] + '.' + json_file_name.split(".")[-2]
    star_status = json_file_name.split(".")[:3]
    status = star_status[0] + '.' + star_status[1] + '.' + star_status[2]
    data = {"filename": file_name, "params": json_tab}
    print(status)
    print(data['filename'])
    collection.insert({status: data}, check_keys=False)
