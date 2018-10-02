// MIT © 2018 azu
"use strict";
const fs = require("fs");
const path = require("path");
const { fetchTenkura } = require("./tenkura.js");
(async function main() {
    const mountains = await fetchTenkura();
    const dataDir = path.join(__dirname, "../src/data");
    const outputPath = path.join(dataDir, "tenkura-list.json");
    fs.writeFileSync(outputPath, JSON.stringify(mountains, null, 4), "utf-8");
})();
