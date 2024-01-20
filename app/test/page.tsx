"use client"
import {useEffect, useRef} from 'react';
import * as tf from '@tensorflow/tfjs';


const Page = () => {
  let model = useRef<tf.LayersModel|null>(null)
  
  useEffect(()=> {
    console.log("Hsi")
    (async () => {
      model.current = await tf.loadLayersModel("https://yiabhfdigxzmlnyqzepb.supabase.co/storage/v1/object/public/images/model.json?t=2024-01-20T10%3A55%3A53.097Z");
    })()

  }, [])

  return <div>Page</div>;
};

export default Page;
