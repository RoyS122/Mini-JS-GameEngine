
async function importJson(path) {
    return fetch(path)
        .then(response => {
            // Vérifiez si la requête a réussi
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse la réponse en JSON
        })
        .then(data => {
            //console.log(data);
            return data // Ici, vous avez accès à vos données JSON
            // Faites quelque chose avec vos données JSON
        })
        .catch(error => {
            //console.log(path)
            console.error('There has been a problem with your fetch operation:', error);
        });
}
async function importMAPJsonFromFile(path) {
    var json = await importJson(path)
    // console.log(json)
    for (let i = 0; i < json.tilesets.length; i++) {
        // console.log(resolveUrl(path, json.tilesets[i].source))


        json.tilesets[i].tsj = await importJson(resolveUrl(path, json.tilesets[i].source))
        //console.log(json)
        //console.log(resolveUrl(path, resolveUrl(json.tilesets[i].source, json.tilesets[i].tsj.image)))
        json.tilesets[i].img_url = resolveUrl(path, resolveUrl(json.tilesets[i].source, json.tilesets[i].tsj.image))

    }
    // console.log(json, "map")
    return json
}
function importMapFromJson(json) {

    let map_arr = json.layers.filter((layer) => { return layer.type == "tilelayer" });

    // console.log(map_arr);
    let map_splited = []
    for (let i = 0; i < map_arr.length; i++) {
        let current_layer = []
        for (let j = 0; j < map_arr[i].height; j++) {
            // console.log("row: ", j)
            let current_row = []
            for (let l = 0; l < map_arr[i].width; l++) {
                //console.log("col :", )
                // console.log()
                current_row.push(map_arr[i].data[j * map_arr[i].width + l])
                // //(j * map_arr[i].width + l, map_arr[i].data[j * map_arr[i].width + l])
            }
            current_layer.push(current_row)
        }
        map_splited.push(current_layer)

    }

    return map_splited;

}
function resolveUrl(base, relative) {
    var stack = base.split("/"),
        parts = relative.split("/");
    stack.pop(); // Enlever le fichier courant (ou vide) de l'URL de base pour obtenir le dossier
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] == ".")
            continue; // Ignorer le segment actuel
        if (parts[i] == "..")
            stack.pop(); // Remonter d'un niveau dans l'arborescence
        else
            stack.push(parts[i]); // Ajouter le segment au chemin final
    }
    return stack.join("/");
}
function deleteFromArray(array, id) {
    if (id >= 0 && id < array.length) {
        array.splice(id, 1);
    }
}

export { importJson, importMAPJsonFromFile, deleteFromArray }