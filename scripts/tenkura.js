// MIT © 2018 azu
"use strict";
const { JSDOM } = require("jsdom");
const flat = require("array.prototype.flat");
module.exports.fetchTenkura = async function fetchTenkura() {
    const areaList = [
        "https://tenkura.n-kishou.co.jp/tk/kanko/kasel.html?ba=hk&type=15",
        "https://tenkura.n-kishou.co.jp/tk/kanko/kasel.html?ba=th&type=15",
        "https://tenkura.n-kishou.co.jp/tk/kanko/kasel.html?ba=hr&type=15",
        "https://tenkura.n-kishou.co.jp/tk/kanko/kasel.html?ba=kk&type=15",
        "https://tenkura.n-kishou.co.jp/tk/kanko/kasel.html?ba=tk&type=15",
        "https://tenkura.n-kishou.co.jp/tk/kanko/kasel.html?ba=kn&type=15",
        "https://tenkura.n-kishou.co.jp/tk/kanko/kasel.html?ba=cg&type=15",
        "https://tenkura.n-kishou.co.jp/tk/kanko/kasel.html?ba=sk&type=15",
        "https://tenkura.n-kishou.co.jp/tk/kanko/kasel.html?ba=ks&type=15"
    ];
    const promises = areaList.map(areaURL => {
        return JSDOM.fromURL(areaURL).then(dom => {
            const mountains = dom.window.document.querySelectorAll("#main td > a");
            return Array.from(mountains, mountain => {
                return {
                    name: mountain.textContent,
                    url: mountain.href
                };
            });
        });
    });
    const nestedMountains = await Promise.all(promises);
    return flat(nestedMountains);
};
