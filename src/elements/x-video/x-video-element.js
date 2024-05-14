import React from "react";
import { unstable_registerShapeModel } from "polotno/config";
import { observer } from "mobx-react-lite";
import { unstable_registerShapeComponent } from "polotno/config";
import { Image } from "react-konva";
import useImage from "use-image";

// Register the model
unstable_registerShapeModel(
  {
    type: "x-video",
    src: "",
    autoPlay: false,
  },
  (model) => {
    return model.actions((self) => {
      return {
        setSrc(src) {
          self.src = src;
        },
        setAutoPlay(autoPlay) {
          self.autoPlay = autoPlay;
        },
      };
    });
  }
);

const XVideoElement = observer(({ element, store }) => {
  const ref = React.useRef(null);

  const [image] = useImage(element.previewUrl);

  return (
    <Image
      ref={ref}
      name="element"
      image={image}
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      fill="black"
      rotation={element.rotation}
      opacity={element.opacity}
      draggable={!element.locked}
      onDragMove={(t) => {
        element.set({ x: t.target.x(), y: t.target.y() });
      }}
      onTransform={(t) => {
        const r = t.currentTarget,
          o = Math.abs(r.scaleX() - 1) < 1e-7 ? 1 : r.scaleX(),
          i = Math.abs(r.scaleY() - 1) < 1e-7 ? 1 : r.scaleY();
        r.scaleX(1);
        r.scaleY(1);
        element.set({
          x: r.x(),
          y: r.y(),
          width: r.width() * o,
          height: r.height() * i,
          rotation: t.target.rotation(),
        });
      }}
    />
  );
});

// Register the component
unstable_registerShapeComponent("x-video", XVideoElement);
