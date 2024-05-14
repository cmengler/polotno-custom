import React from "react";
import { observer } from "mobx-react-lite";

import "@blueprintjs/core/lib/css/blueprint.css";

import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";

import { Workspace } from "polotno/canvas/workspace";
import { SidePanel } from "polotno/side-panel";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";

import { TextSection, LayersSection } from "polotno/side-panel";
import { XVideoSection } from "./elements";

const useHeight = () => {
  const [height, setHeight] = React.useState(window.innerHeight);
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      setHeight(window.innerHeight);
    });
  }, []);
  return height;
};

const App = observer(({ store }) => {
  const height = useHeight();

  return (
    <div
      style={{
        width: "100vw",
        height: height + "px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PolotnoContainer>
        <SidePanelWrap>
          <SidePanel
            store={store}
            sections={[TextSection, XVideoSection, LayersSection]}
          />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar store={store} />
          <Workspace store={store} />
          <ZoomButtons store={store} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </div>
  );
});

export default App;
