/* eslint-disable */
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const VideoRecorderComponent = () => {
  const webcamRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const startRecording = () => {
    const stream = webcamRef.current.video.srcObject;
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "video/webm" });
      console.log("Blob created:", blob);
  
      const videoURL = URL.createObjectURL(blob);
      console.log("Video URL created:", videoURL);
  
      const a = document.createElement("a");
      a.href = videoURL;
      a.download = "recorded-video.webm";
      
      // Try to append the anchor element to the body to check its properties
      console.log("Anchor element:", a);
  
      // Append the anchor element to the body to observe its properties in the console
      document.body.appendChild(a);
  
      // Try to manually click the anchor to trigger the download
      a.click();
      
      chunks.current = []; // Clear recorded chunks for next recording
    };

    mediaRecorder.current.start();
    setRecording(true);
    setMediaStream(stream);
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  return (
    <div>
      <Webcam audio={true} mirrored={true} ref={webcamRef} />
      <div>
        {recording ? (
          <button onClick={stopRecording}>Stop Recording</button>
        ) : (
          <button onClick={startRecording}>Start Recording</button>
        )}
      </div>
    </div>
  );
};

export default VideoRecorderComponent;
