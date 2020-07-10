const path = require("path");
const { parseXML } = require("../src/db");
const fs = require("fs");

(async () => {
    const xmlPath = path.resolve("./data/anime-titles.xml");
    const result = await parseXML(xmlPath);
    fs.writeFileSync(
        path.resolve("./data/anime-titles.json"),
        JSON.stringify(result, null, 2)
    );
})();