"use client"
import Webcam from "react-webcam";
import { useCallback, useEffect, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks, drawRectangle } from "@mediapipe/drawing_utils";
import { Hands, HAND_CONNECTIONS, Results } from "@mediapipe/hands";

const drawCanvas = (ctx: CanvasRenderingContext2D, results: Results) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.scale(-1, 1);
  ctx.translate(-width, 0);

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
        let x_max = 0
        let y_max = 0
        let x_min = width
        let y_min = height

      landmarks.forEach((landmark) => {
        if(landmark.x > x_max){
          x_max = landmark.x
        }
        if( landmark.x < x_min){
          x_min = landmark.x
        }
        if( landmark.y > y_max){
          y_max =landmark.y
        }
        if( landmark.y < y_min){
          y_min = landmark.y
        }
      })
      
      // console.log(x_min*width, y_min*height, (x_max - x_min)*width, (y_max - y_min) * height)

      ctx.beginPath();
      ctx.rect(x_min*width, y_min*height, (x_max - x_min)*width, (y_max - y_min) * height);
      ctx.stroke();

      
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        // color: "#00FF00",
        color: "#8700FF",
        lineWidth: 4,
      });
      drawLandmarks(ctx, landmarks, {
        // color: "#FF0000",
        color: "#8700FF",
        lineWidth: 1,
        radius: 6,
      });
    }
  }
  ctx.restore();
};

const App = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultsRef = useRef<Results>();

  const onResults = useCallback((results: Results) => {
    resultsRef.current = results;

    const canvasCtx = canvasRef.current!.getContext("2d")!;
    drawCanvas(canvasCtx, results);
  }, []);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      const camera = new Camera(webcamRef.current.video!, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current!.video! });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }
  }, [onResults]);

  const OutputData = () => {
    const results = resultsRef.current!;
    const data = results.multiHandLandmarks[0];
    console.log(data);
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden flex bg-white">
      <div className="top-0 h-screen w-[30vw] left-0">
        <button onClick={OutputData}>
          print data
        </button>
      </div>
      <div className="absolute top-0 right-0 grayscale h-screen z-10">
        <Webcam
          ref={webcamRef}
          audio={false}
          style={{
            height:"100vh",
            width:'70vw',
            objectFit: "fill"
            }}
          videoConstraints={{ aspectRatio: 16/9, width: 40000, height: 40000, facingMode: "user" }}
          forceScreenshotSourceSize={true}
          screenshotFormat="image/png"
          minScreenshotHeight={100}
          minScreenshotWidth={100}
      />
      </div>
      <canvas
        ref={canvasRef}
        className="z-50 absolute top-0 right-0 h-full w-[70vw] aspect-video"
        width={1280}
        height={720}
      />
    </div>
  );
};



export default App;