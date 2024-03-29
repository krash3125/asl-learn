"use client"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import {  HAND_CONNECTIONS, Results } from "@mediapipe/hands";
import { MODEL_SIZE } from '@/utils/size';

export const drawCanvas = (ctx: CanvasRenderingContext2D, results: Results) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.scale(-1, 1);
  ctx.translate(-width, 0);

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        // color: "#00FF00",
        color: "#6366F2",
        lineWidth: 3,
      });
      drawLandmarks(ctx, landmarks, {
        // color: "#FF0000",
        color: "#6366F2",
        lineWidth: 1,
        radius: 4,
      });
    }
  }
  ctx.restore();
};


export const drawCanvas2 = (ctx: CanvasRenderingContext2D, results: Results) => {
  const width = 1280;
  const height = 720;
  

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
        let x_max = 0
        let y_max = 0
        let x_min = width
        let y_min = height

      landmarks.forEach((landmark: any) => {
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
      
      // ctx.drawImage(results.image, 0, 0, MODEL_SIZE, MODEL_SIZE);
      ctx.drawImage(results.image,x_min*width-150, y_min*height-50, 760, (150+(y_max-y_min)*height), 0, 0, MODEL_SIZE, MODEL_SIZE);
      
    }
  }
  ctx.restore();
};
