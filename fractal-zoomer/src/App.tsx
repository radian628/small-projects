import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { FractalCanvas, FractalType } from "./FractalCanvas";
import { ElementDragger } from './ElementDragger';

function App() {
  let [x1, setX1] = useState(-2);
  let [y1, setY1] = useState(-2 * window.innerHeight / window.innerWidth);
  let [x2, setX2] = useState(2);
  let [y2, setY2] = useState(2 * window.innerHeight / window.innerWidth);

  return (
    <div className="App">

      <FractalCanvas 
      x1={x1} y1={y1} x2={x2} y2={y2} 
      fractalType={FractalType.MANDELBROT}></FractalCanvas>

      <ElementDragger className="fullscreen" 
      x1={x1} setX1={setX1} y1={y1} setY1={setY1} x2={x2} setX2={setX2} y2={y2} setY2={setY2}></ElementDragger>

    </div>
  );
}

export default App
