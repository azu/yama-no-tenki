import * as React from "react";
import "./App.css";

import { YamaSearchList } from "./YamaSearchList/YamaSearchList";

const YamaList = require("japanese-yama-list");
const TenkuraList = require("./data/tenkura-list.json");
type YamItem = {
    name: string;
    description: string;
    latitude: string,
    longitude: string,
    height: string,
    nameFurigana: string,
    crestName: string,
    crestNameFurigana: string,
    otherName: string,
    details: string,
    address: string,
    prefectures: string[]
}

const normalizedEqual = (a: string, b: string) => {
    const normalizedA = a.replace(/ッ/g, "ヶ");
    const normalizedB = b.replace(/ッ/g, "ヶ");
    return normalizedA === normalizedB;
};

class App extends React.Component {
    public render() {
        const items = YamaList.map((item: YamItem) => {
            const matchItem = TenkuraList.find((tenkuraItem: { name: string; url: string; }) => {
                return normalizedEqual(tenkuraItem.name, item.name) || normalizedEqual(tenkuraItem.name, item.crestName) || normalizedEqual(tenkuraItem.name, item.address);
            });
            if (!matchItem) {
                return item;
            }
            return {
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
            };
        });
        return (
            <div className="App">
                <header>
                    <h1>ヤマノ天気検索</h1>
                    <p><a href="https://tenkura.n-kishou.co.jp/tk/index.html">てんきとくらす [天気と生活情報]</a>の天気を検索できます</p>
                </header>
                <YamaSearchList items={items} autoFocus={true}/>
            </div>
        );
    }
}

export default App;
