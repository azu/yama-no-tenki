import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { initializeIcons } from "@uifabric/icons";
import { Fabric } from "office-ui-fabric-react";
// Register icons and pull the fonts from the default SharePoint cdn:
initializeIcons();
ReactDOM.render(
    <Fabric>
        <App/>
    </Fabric>,
    document.getElementById("root") as HTMLElement
);
registerServiceWorker();
