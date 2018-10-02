import * as React from "react";
import {
    FocusZone,
    FocusZoneDirection,
    FocusZoneTabbableElements,
    Link,
    List,
    TextField
} from "office-ui-fabric-react";
import { KeyboardEvent } from "react";
import "./YamaSearchList.css";

const debouncePromise = require("debounce-promise");
const Highlighter = require("react-highlight-words");
const { toKana } = require("wanakana");

export interface YamaSearchListProps {
    autoFocus: boolean;
    items: YamaItem[];
}

export interface YamaSearchListState {
    filterWords: string[];
    items: YamaItem[];
}

export interface YamaItem {
    name: string;
    url: string;
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
    prefecturesstring: string[]
}

export interface YamaItemProps {
    item: YamaItem;
    filterWords: string[]
}


export const YamaSearchListItemComponent = (props: YamaItemProps) => {
    const onKeyPress = (event: KeyboardEvent<any>) => {
        if (event.key === "Enter") {
            window.open(props.item.url);
        }
    };

    const creastName = props.item.crestName.length > 0 ? `> ${props.item.crestName}（${props.item.crestNameFurigana}）` : "";
    return (
        <div className={"YamaSearchListItem"} data-is-focusable={true} onKeyDown={onKeyPress}>
            <div className="YamaSearchListItem-body">
                <div className={"YamaSearchListItem-main"}>
                    <div className="YamaSearchListItem-title">
                        <Link href={props.item.url} target={"_blank"} data-is-focusable={false}>
                            <Highlighter
                                highlightClassName="YourHighlightClass"
                                searchWords={props.filterWords}
                                autoEscape={true}
                                textToHighlight={`${props.item.name}（${props.item.nameFurigana}）${creastName}`}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export class YamaSearchList extends React.PureComponent<YamaSearchListProps, YamaSearchListState> {
    state = {
        filterWords: [],
        items: this.props.items
    };
    // @ts-ignore
    private textFieldRef = React.createRef<TextField>();


    componentDidUpdate(prevProps: YamaSearchListProps) {
        if (this.props.autoFocus !== prevProps.autoFocus) {
            this.focus();
        }
    }

    public focus = () => {
        if (this.textFieldRef.current) {
            this.textFieldRef.current.focus();
        }
    };

    public render() {
        const { items: originalItems } = this.props;
        const { items } = this.state;
        const resultCountText =
            items.length === originalItems.length ? "" : ` (${items.length} of ${originalItems.length} shown)`;
        return (
            <FocusZone
                direction={FocusZoneDirection.vertical}
                handleTabKey={FocusZoneTabbableElements.all}
                className={"YamaSearchList"}
            >
                <TextField
                    inputClassName={"YamaSearchList-searchBoxInput"}
                    className={"YamaSearchList-searchBox"}
                    autoFocus={this.props.autoFocus}
                    iconProps={{
                        iconName: "Filter"
                    }}
                    label={"山名＜山頂名＞で絞り込めます" + resultCountText}
                    onChange={this.onFilterChanged}
                />
                <List className={"YamaSearchList-body"} items={items} onRenderCell={this.onRenderCell}/>
            </FocusZone>
        );
    }

    private onFilterChanged = debouncePromise((event: any, text: string) => {
        return this.tryUpdateFilter(text);
    }, 100);

    private tryUpdateFilter = (text: string) => {
        let searchText = text;
        if (/^\w+$/.test(text)) {
            searchText = toKana(text);
            // no update when input is uncompleted word like "kintok"
            if (/\w/.test(searchText)) {
                return;
            }
        }
        const filterWords = searchText.split(/\s/);
        const yamaItems = this.props.items.filter(item => {
            return item.name.includes(searchText) || item.nameFurigana.includes(searchText) ||
                item.crestName.includes(searchText) || item.crestNameFurigana.includes(searchText);
        });
        this.setState({
            filterWords: filterWords,
            items: yamaItems
        });
    };

    private onRenderCell = (item: any, index: number | undefined): JSX.Element => {
        return <YamaSearchListItemComponent item={item} filterWords={this.state.filterWords}/>;
    };
}
