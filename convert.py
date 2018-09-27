import json


def converter(file, myjson):
    data = []
    with open(file, "r") as f:

        json_tab = []
        for i in range(3): # On saute les premieres colonnes
            next(f)
        for i,line in enumerate(f):
            if i == 0:
                words = line.split()
                for j in words:
                    data.append(j)
            elif i >=3:
                firsty = line.split()
                json_tab.append(dict(zip(data, firsty)))

    jsonfile = open(myjson, "w")

    jsonfile.write(json.dumps(json_tab))
    jsonfile.close()
