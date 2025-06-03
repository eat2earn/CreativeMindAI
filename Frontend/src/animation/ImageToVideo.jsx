import React from "react";
import TextPressure from './TextPressure'

const ImageToVideo = () => {
  return (
    <div
      style={{ position: "relative", height: "100%", backgroundColor: "black" }}
    >
      <TextPressure
        text="Image To Video"
        flex={true}
        alpha={false}
        stroke={false}
        width={true}
        weight={true}
        italic={true}
        textColor="#ffffff"
        strokeColor="#ff0000"
        minFontSize={36}
        wordSpacing="10px" 
      />
    </div>
  );
};

export default ImageToVideo;
