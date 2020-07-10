const fs = require("fs");

async function parseXML(path) {
    const json = await parseXMLToJSON(path);
    return json.animetitles.anime.map(o => ({
        aid: o["$"].aid,
        titles: o.title.map(p => ({
            lang: p["$"]['xml:lang'],
            type: p["$"]['type'],
            title: p["_"],
        })),
    }));
}

function parseXMLToJSON(path) {
    var parseString = require('xml2js').parseString;
    var xml = fs.readFileSync(path);
    return new Promise((resolve, reject) => {
        parseString(xml, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = {
    parseXMLToJSON,
    parseXML,
};