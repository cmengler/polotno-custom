import React from "react";
import { observer } from "mobx-react-lite";
import { Navbar, Divider, Alignment, Switch } from "@blueprintjs/core";
import { unstable_registerToolbarComponent } from "polotno/config";

const VideoToolbar = observer(({ store }) => {
  const element = store.selectedElements[0];

  return (
    <Navbar.Group align={Alignment.LEFT} className="x-toolbar">
      <Divider
        style={{
          height: "100%",
          margin: "0px 15px",
        }}
      />
      <Switch
        labelElement="Autoplay"
        defaultChecked={element.autoPlay}
        onChange={(value) => {
          element.set({ autoPlay: value.target.checked });
        }}
      />
    </Navbar.Group>
  );
});

// Register the toolbar
unstable_registerToolbarComponent("x-video", VideoToolbar);
