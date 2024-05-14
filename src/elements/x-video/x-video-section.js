import React from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { observer } from "mobx-react-lite";
import { InputGroup, Card, Spinner } from "@blueprintjs/core";
import { SectionTab } from "polotno/side-panel";
import { setTranslations } from "polotno/config";
import { getVideoPreview, getVideoSize } from "polotno/utils/video";
import { Center } from "../../center";

import MdVideoLibrary from "@meronex/icons/md/MdVideoLibrary";

import "./x-video-element";
import "./x-video-toolbar";

const VideoCard = observer(({ video, store }) => {
  const [loading, setLoading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState("");

  React.useEffect(() => {
    const load = async () => {
      const url = await getVideoPreview(video.url);
      setPreviewUrl(url);
    };
    load();
  }, [video]);

  const handleSelect = async () => {
    setLoading(true);

    const { width, height } = await getVideoSize(video.url);

    const element = store.activePage.addElement({
      type: "x-video",
      name: `${video.name}`,
      src: video.url,
      width,
      height,
    });

    // Set the preview URL
    element.set({
      previewUrl,
    });

    setLoading(false);
  };

  return (
    <Card
      style={{ margin: "3px", padding: "0px", position: "relative" }}
      interactive
      onClick={() => {
        handleSelect();
      }}
    >
      <img alt={video.name} src={previewUrl} style={{ width: "100%" }} />
      {loading && (
        <Center>
          <Spinner />
        </Center>
      )}
    </Card>
  );
});

const VideosPanel = observer(({ store }) => {
  const [videos, setVideos] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  React.useEffect(() => {
    const search = async () => {
      if (debouncedSearchTerm.length <= 3) {
        return;
      }

      setLoading(true);

      const response = await fetch(
        "https://gist.githubusercontent.com/poudyalanil/ca84582cbeb4fc123a13290a586da925/raw/14a27bd0bcd0cd323b35ad79cf3b493dddf6216b/videos.json"
      );
      const videos = await response.json();

      setLoading(false);

      setVideos(
        videos.map((video) => {
          return {
            id: video.id,
            url: video.videoUrl,
            name: video.title,
          };
        })
      );
    };

    search();
  }, [debouncedSearchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <InputGroup
        leftIcon="search"
        placeholder="Search..."
        onValueChange={handleSearchChange}
        style={{
          marginBottom: "20px",
        }}
      />
      {!loading && !videos.length && (
        <div style={{ paddingTop: "20px", textAlign: "center", opacity: 0.6 }}>
          No results.
        </div>
      )}
      {loading && (
        <div style={{ padding: "30px" }}>
          <Spinner />
        </div>
      )}
      <div
        style={{
          paddingTop: "5px",
          height: "100%",
          overflow: "auto",
          width: "100%",
        }}
      >
        {videos.map((video) => (
          <div
            style={{ float: "left", width: "50%" }}
            key={`video-${video.id}`}
          >
            <VideoCard video={video} store={store} />
          </div>
        ))}
        <div style={{ clear: "both", display: "table" }}></div>
      </div>
    </div>
  );
});

setTranslations({
  sidePanel: {
    layerTypes: {
      "x-video": "Video",
    },
  },
});

export const XVideoSection = {
  name: "x-videos",
  Tab: (props) => (
    <SectionTab name="Videos X" {...props}>
      <MdVideoLibrary />
    </SectionTab>
  ),
  Panel: VideosPanel,
};
