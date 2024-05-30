import { useEffect, useMemo, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import BUDDHABROT_VERT from "./assets/buddhabrot.vert?raw";
import BUDDHABROT_FRAG from "./assets/buddhabrot.frag?raw";
import MIX_VERT from "./assets/mix.vert?raw";
import MIX_FRAG from "./assets/mix.frag?raw";
import twgl, { ProgramInfo } from "twgl.js";



const useAnimationFrame = (callback: (time: number) => void) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  
  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime)
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once
}



function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mixShader, setMixShader] = useState<ProgramInfo>();
  const [buddhabrotShader, setBuddhabrotShader] = useState<ProgramInfo>();
  const [currFramebuffer, setCurrFramebuffer] = useState<twgl.FramebufferInfo>();
  const [prevFramebuffer, setPrevFramebuffer] = useState<twgl.FramebufferInfo>();
  const [drawFramebuffer, setDrawFramebuffer] = useState<twgl.FramebufferInfo>();

  const [rectBuffer, setRectBuffer] = useState<twgl.BufferInfo>();
  const [pointCloudBuffer, setPointCloudBuffer] = useState<twgl.BufferInfo>();

  useAnimationFrame(time => {
    const gl = canvasRef.current?.getContext("webgl2");
    if (!gl) return;

    if (!mixShader) {
      setMixShader(twgl.createProgramInfo(gl, [MIX_VERT, MIX_FRAG]));
      return;
    }
    if (!buddhabrotShader) {
      setBuddhabrotShader(twgl.createProgramInfo(gl, [BUDDHABROT_VERT, BUDDHABROT_FRAG]));
      return;
    }
    if (!currFramebuffer) {
      setCurrFramebuffer(twgl.createFramebufferInfo(gl, [
        { format: gl.RGBA8, mag: gl.NEAREST }
      ], 512, 512));
      return;
    }
    if (!prevFramebuffer) {
      setPrevFramebuffer(twgl.createFramebufferInfo(gl, [
        { format: gl.RGBA8, mag: gl.NEAREST }
      ], 512, 512));
      return;
    }
    if (!drawFramebuffer) {
      setDrawFramebuffer(twgl.createFramebufferInfo(gl, [
        { format: gl.RGBA8, mag: gl.NEAREST }
      ], 512, 512));
      return;
    }




  });

  return (
    <div className="App">
      <canvas ref={canvasRef} width="512" height="512"></canvas>
    </div>
  )
}

export default App
