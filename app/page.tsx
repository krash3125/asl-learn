'use client';
import Webcam from 'react-webcam';
import { useCallback, useEffect, useRef } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { Hands, Results } from '@mediapipe/hands';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

import { drawCanvas } from '@/utils/draw';
import img from "@/a.png"

const App = () => {
  let model = useRef<tmImage.CustomMobileNet | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultsRef = useRef<Results>();

  const onResults = useCallback((results: Results) => {
    resultsRef.current = results;

    const canvasCtx = canvasRef.current!.getContext('2d')!;
    drawCanvas(canvasCtx, results);
  }, []);

  useEffect(() => {
    (async () => {
      console.log('loading model');



      model.current = await tmImage.load("models/asl/model.json", "models/asl/metadata.json");
      
      const maxPredictions = model.current.getClassLabels();

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
    

    // const example = tf.browser.fromPixels(webcamRef.current?.video!);

    const h = 720;
    const w = 1280;

    // Extract bounding box coordinates from hand landmarks
    const minX = Math.min(...handLandmarks.map(point => point.x));
    const maxX = Math.max(...handLandmarks.map(point => point.x));
    const minY = Math.min(...handLandmarks.map(point => point.y));
    const maxY = Math.max(...handLandmarks.map(point => point.y));
  
    // Calculate width and height of the bounding box
    const width = maxX - minX;
    const height = maxY - minY;
  
    // Resize the input image to [30, 63]
    // const resizedImage = tf.image.resizeBilinear(tf.browser.fromPixels(webcamRef.current?.video!), [30, 63]);
  

    let imageTensor = tf.browser.fromPixels(webcamRef.current?.video!) 
    // let imageTensor4D = tf.expandDims(imageTensor)

    // const resizedImage = tf.image.resizeBilinear(tf.browser.fromPixels(webcamRef.current?.video!), [226, 226]);
    // let imageTensor4D2 = tf.expandDims(resizedImage)
    // const normalizedBoxes = tf.tensor2d([[minY / h, minX / w, maxY / h, maxX / w]]);



    
    // const croppedImage  = tf.image.cropAndResize(
    //   imageTensor4D2 as tf.Tensor4D,
    //   normalizedBoxes,
    //   [0],
    //   [256, 256])

      
    // const reshapedImage = croppedImage.reshape([0, 30, 63]);

      
    
      
  
    // const resizedImage = tf.image.resizeBilinear(tf.browser.fromPixels(webcamRef.current?.video!), [30, 63]);
    
    // console.log(resizedImage);
    // console.log(model.current?.predict(imageTensor4D2));


    // let tfTensor = tf.browser.fromPixels(webcamRef.current?.video!);
      // let tfTensor = tf.browser.fromPixels();
          // model.current.predict();
    
  };


  

  return (
    <div className="relative w-screen h-screen overflow-hidden flex bg-white">
      <div className="top-0 h-screen w-[30vw] left-0">
        <button onClick={OutputData}>print data</button>
      </div>
      <div className="absolute top-0 right-0 grayscale h-screen z-10">
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
    </div>
  );
};

export default App;
