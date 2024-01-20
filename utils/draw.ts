"use client"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import {  HAND_CONNECTIONS, Results } from "@mediapipe/hands";


export const drawCanvas = (ctx: CanvasRenderingContext2D, results: Results) => {
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
