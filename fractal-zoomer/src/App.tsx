import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { FractalCanvas, FractalType } from "./FractalCanvas";
import { ElementDragger } from './ElementDragger';
import { FractalSettings, Settings } from './Settings';

function App() {
  let [x1, setX1] = useState(-2);
  let [y1, setY1] = useState(-2 * window.innerHeight / window.innerWidth);
  let [x2, setX2] = useState(2);
  let [y2, setY2] = useState(2 * window.innerHeight / window.innerWidth);

  const [settings, setSettings] = useState<FractalSettings>({
    fractalType: FractalType.MANDELBROT,
    iterations: 128
  });

  return (
    <div className="App">

      <FractalCanvas 
      x1={x1} y1={y1} x2={x2} y2={y2} 
      settings={settings}></FractalCanvas>

      <ElementDragger className="fullscreen" 
      x1={x1} setX1={setX1} y1={y1} setY1={setY1} x2={x2} setX2={setX2} y2={y2} setY2={setY2}></ElementDragger>

      <Settings settings={settings} setSettings={setSettings}></Settings>
    </div>
  );
}

export default App
