const { parseXMLToJSON, parseXML } = require("../src/db");
const path = require("path");
const fs = require("fs");

const xmlPath = path.resolve("./data/anime-titles.xml");

test('parseXMLToJSON works', async () => {
    const json = await parseXMLToJSON(xmlPath);
    const anime = json.animetitles.anime;
    expect(Array.isArray(anime)).toBeTruthy();
    const firstAnime = anime[0];
    expect(firstAnime["$"].aid).toEqual("1");
    expect(Array.isArray(firstAnime.title)).toBeTruthy();
    const zhCNTitle = firstAnime.title.filter(obj => obj.$['xml:lang'] === "zh-Hans")[0];
    const animeName = zhCNTitle["_"];
    expect(animeName).toEqual("星界之纹章");
});

test("parseXML works", async () => {
    const result = await parseXML(xmlPath);
    expect(result.length > 0).toBeTruthy();
});
