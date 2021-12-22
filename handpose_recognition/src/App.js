import React, { useRef } from 'react';
// import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import { drawHand } from "./utilities";
import './App.css';

function App() {
  const webcamref = useRef(null);
  const canvasref = useRef(null);
  
  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");

    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    
    if (
      typeof webcamref.current !== "undefined" &&
      webcamref.current !== null &&
      webcamref.current.video.readyState === 4
    ) {
      
      const video = webcamref.current.video;
      const videoWidth = webcamref.current.video.videoWidth;
      const videoHeight = webcamref.current.video.videoHeight;

      
      webcamref.current.video.width = videoWidth;
      webcamref.current.video.height = videoHeight;

      
      canvasref.current.width = videoWidth;
      canvasref.current.height = videoHeight;

      
      const hand = await net.estimateHands(video);
      console.log(hand);

      const ctx = canvasref.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };
  
  runHandpose();
  
  return (
    <div className="App">
      <header className="App-header">
      <Webcam
          ref={webcamref}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasref}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
