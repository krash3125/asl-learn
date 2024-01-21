'use client';
import Webcam from 'react-webcam';
import { useCallback, useEffect, useState,  useRef } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { Hands, Results } from '@mediapipe/hands';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

import { drawCanvas, drawCanvas2 } from '@/utils/draw';
import img from "@/a.png"
import { MODEL_SIZE } from '@/utils/size';

const App = () => {
  let model = useRef<tmImage.CustomMobileNet | null>(null);
  // let model = useRef<tf.LayersModel | null>(null);
  let maxPredictions = useRef<string[] | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const resultsRef = useRef<Results>();
  
  const [letter, setLetter] = useState("");

  const onResults = useCallback((results: Results) => {
    resultsRef.current = results;

    const canvasCtx = canvasRef.current!.getContext('2d')!;
    const canvasCtx2 = canvasRef2.current!.getContext('2d')!;
    drawCanvas(canvasCtx, results);
    drawCanvas2(canvasCtx2, results)
  }, []);

  useEffect(() => {
    (async () => {
      console.log('loading model');

      // model.current = await tf.loadLayersModel('models/old_asl/model.json');
      
      model.current = await tmImage.load("models/asl/model.json", "models/asl/metadata.json");
      // model.current = await tmImage.load("models/asl4/model.json", "models/asl4/metadata.json");
      // model.current = await tmImage.load("models/asl2/model.json", "models/asl2/metadata.json");
      // model.current = await tmImage.load("models/old_asl/model.json", "models/old_asl/metadata.json");

      maxPredictions.current = model.current.getClassLabels();
      console.log(maxPredictions);

      console.log(model.current);
      console.log('done model');
    })();
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
      typeof webcamRef.current !== 'undefined' &&
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
    const handLandmarks = results.multiHandLandmarks[0];
    predict();
  };

  async function predict() {
    // predict can take in an image, video or canvas html element
    if(!maxPredictions.current) return;
    const x = maxPredictions.current?.length;
    // const prediction = await model.current?.predict(webcamRef?.current?.video!);
    const prediction = await model.current?.predict(canvasRef2?.current!);
    let arr = [];
    for (let i = 0; i < maxPredictions.current?.length; i++) {
      if(!prediction) continue;  
      const classPrediction = prediction[i]?.className + ": " + prediction[i]?.probability.toFixed(2);
      arr.push(classPrediction);
    }
    console.log(arr);
  }

  // async function predict() {
  //   // let img = tf.browser.fromPixels(canvasRef2?.current!);
  //   // img = tf.expandDims(img, 0)
  //   // const prediction = model.current?.predict(img);
  //   // //@ts-ignore
  //   // const values = predict.arraySync()[0][0];
  //   // // const values = predict?.dataSync();
  //   // console.log(values[0]);

  //     const tensor = tf.browser
  //     .fromPixels(canvasRef2?.current!)
  //     .div(tf.scalar(127.5))
  //     .sub(tf.scalar(3))
  //     .expandDims();
    

  //     const prediction = model.current!.predict(tensor);

      
  //     //@ts-ignore
  //     const predictedLetter = prediction.argMax(1).dataSync();
  //     //@ts-ignore
  //     const confidence = prediction.dataSync()[0];
      

  //     const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V" ,"W", "X", "Y", "Z", "del", "space", "nothing"];
      

  //     const letterValue2 = LETTERS[predictedLetter];      

  //     console.log(letterValue2)
  //     setLetter(letterValue2)
  //     // console.log(confidence*100)

  //     //@ts-ignore
  //     prediction.dispose();
  //     //@ts-ignore
  //     prediction.dispose();


  //   // const mapping = ['A', 'B', 'C', 'D', 'E', "F", "G"]; // Add more letters as needed

  //   // // Find the index of the maximum predicted value
  //   // const maxIndex = values.indexOf(Math.max(...values));

  //   // // Get the letter corresponding to the maximum predicted value
  //   // const predictedLetter = mapping[maxIndex];

  //   // // Now 'predictedLetter' contains the letter corresponding to the highest predicted value
  //   // console.log(predictedLetter);

  // }



  return (
    <div className="relative w-screen h-screen overflow-hidden flex bg-white">
      <div className="top-0 h-screen w-[30vw] left-0">
        <button onClick={OutputData}>print data</button>
        <span className="text-4xl font-bold">{letter}</span>
      </div>
      <div className="absolute top-0 right-0 h-screen z-10">
        <Webcam
          ref={webcamRef}
          audio={false}
          style={{
            height: '100vh',
            width: '70vw',
            objectFit: 'fill',
          }}
          videoConstraints={{
            aspectRatio: 16 / 9,
            width: 40000,
            height: 40000,
            facingMode: 'user',
          }}
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
      <canvas
      ref={canvasRef2}
      className="z-[66] absolute top-12 left-0"
      width={MODEL_SIZE}
        height={MODEL_SIZE}
        />

    </div>
  );
};

export default App;
