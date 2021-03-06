import * as React from "react";
import "./App.css";

import { YamaSearchList, YamaItem } from "./YamaSearchList/YamaSearchList";
const sortBy = require('lodash.sortby');
const uniqBy = require('lodash.uniqby');

const YamaList = require("japanese-yama-list");
const TenkuraList = require("./data/tenkura-list.json");
type RawYamItem = {
    name: string;
    description: string;
    latitude: string;
    longitude: string;
    height: string;
    nameFurigana: string;
    crestName: string;
    crestNameFurigana: string;
    otherName: string;
    details: string;
    address: string;
    prefectures: string[];
};

const normalizedEqual = (a: string, b: string) => {
    const normalizedA = a.replace(/ッ/g, "ヶ");
    const normalizedB = b.replace(/ッ/g, "ヶ");
    return normalizedA === normalizedB;
};

const usedTekunraMap = new Map<string, boolean>()
const matchedItems: YamaItem[] = [];
YamaList.forEach((item: RawYamItem) => {
    const matchItem = TenkuraList.find((tenkuraItem: { name: string; nameFurigana: string; url: string }) => {
        if (usedTekunraMap.has(tenkuraItem.url)) {
            return false;
        }
        return (
            normalizedEqual(tenkuraItem.name, item.name) ||
            normalizedEqual(tenkuraItem.name, item.crestName) ||
            normalizedEqual(tenkuraItem.name, item.address)
        );
    });
    if (!matchItem) {
        return;
    }
    usedTekunraMap.set(matchItem.url, true);
    matchedItems.push({
        name: item.name,
        url: matchItem.url,
        description: item.description,
        latitude: item.latitude,
        longitude: item.longitude,
        height: item.height,
        nameFurigana: item.nameFurigana,
        crestName: item.crestName,
        crestNameFurigana: item.crestNameFurigana,
        otherName: item.otherName,
        details: item.details,
        address: item.address,
        prefectures: item.prefectures
    });
});
// no matched tenkura list
TenkuraList.forEach((item: { name: string; nameFurigana: string; url: string, }) => {
    if (usedTekunraMap.has(item.url)) {
        return;
    }
    matchedItems.push({
        name: item.name,
        url: item.url,
        description: "",
        nameFurigana: item.nameFurigana,
        crestName: "",
        crestNameFurigana: "",
        otherName: "",
        details: "",
        address: "",
        prefectures: []
    });
});
const AppItems = uniqBy(sortBy(matchedItems, ['name', 'url']), "url");

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <header>
                    <h1>ヤマノテンキ検索</h1>
                    <p>
                        <a href="https://tenkura.n-kishou.co.jp/tk/index.html">てんきとくらす [天気と生活情報]</a>の天気を検索できます。
                        <a href="https://github.com/azu/yama-no-tenki" title="ソースコードはGitHubに">[GitHub]</a>
                    </p>
                </header>
                <YamaSearchList items={AppItems} autoFocus={true} />
            </div>
        );
    }
}

export default App;
