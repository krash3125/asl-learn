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

const WORDS_TO_SPELL = ["BABA", "DAD", "CAB", "ADD", "ADD"]

const App = () => {
  let model = useRef<tmImage.CustomMobileNet | null>(null);
  // let model = useRef<tf.LayersModel | null>(null);
  let maxPredictions = useRef<string[] | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const resultsRef = useRef<Results>();
  
  const [wordIndex, setWordIndex] = useState(0)
  const [letterIndex, setLetterIndex] = useState(0)


  const predict = async () => {
    if(!maxPredictions.current) return;
    const prediction = await model.current?.predict(canvasRef2?.current!);
    
    const map = new Map();

    for (let i = 0; i < maxPredictions.current?.length; i++) {
      if(!prediction) continue;  
      map.set(prediction[i]?.className, prediction[i]?.probability);
    }

    console.log(WORDS_TO_SPELL[wordIndex][letterIndex])
    
    if(map.get(WORDS_TO_SPELL[wordIndex][letterIndex]) > 0.9){
      console.log("correct");
      if(WORDS_TO_SPELL[wordIndex].length === letterIndex+1){ 
        console.log("end of word");
        setWordIndex(wordIndex+1);
        setLetterIndex(0);
      }
      else {
        console.log("nexet letter");
        setLetterIndex((o) => o+1);
      }
    }


    tf.dispose(prediction);

    console.log(map);
    console.log(tf.memory());
  }


  const onResults = useCallback(async(results: Results) => {
    resultsRef.current = results;
    const canvasCtx = canvasRef.current!.getContext('2d')!;
    const canvasCtx2 = canvasRef2.current!.getContext('2d')!;
    drawCanvas(canvasCtx, results);
    drawCanvas2(canvasCtx2, results)
  }, []);


  useEffect(() => {
    (async () => {
      console.log('loading model');

      model.current = await tmImage.load("models/asl/model.json", "models/asl/metadata.json");

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
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    
    hands.onResults(onResults)

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

  

  useEffect(()=> {
    const interval = setInterval(predict, 500);
    return ()=>clearInterval(interval);
  }, 
  [wordIndex, wordIndex, predict])

  
  return (
    <div className="relative w-screen h-screen overflow-hidden flex bg-white">
      <div className="top-0 h-screen w-[30vw] left-0 bg-indigo-500 p-4 flex flex-col items-center text-white">
        <div className="text-2xl font-semibold">Spell Out the Words Below</div>
        
        <div className="my-auto text-[12rem] font-semibold">{WORDS_TO_SPELL[wordIndex][letterIndex]}</div>

        <div className="text-center">
          {WORDS_TO_SPELL?.map((word, wordI)=> {
          return <div className={`text-gray-400 ${wordI === wordIndex ? "text-5xl" : "text-2xl"}`}>{word.split('')?.map((l, i) => 
            <span className={`font-bold ${wordI === wordIndex &&i===letterIndex && "text-white"}`}>{l}</span>
            )}
            <br />
            </div>
          })}
        </div>

      </div>
      <div className="absolute top-0 right-0 h-screen z-10 grayscale">
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
            width: 1920,
            height: 1920,
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
      className="z-[66] absolute bottom-0 left-0 hidden"
      width={MODEL_SIZE}
        height={MODEL_SIZE}
        />

    </div>
  );
};

export default App;
