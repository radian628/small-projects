import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { FractalCanvas, FractalType } from "./FractalCanvas";
import { ElementDragger } from './ElementDragger';
import { FractalSettings, Settings } from './Settings';
import { Gradient } from './GradientInput';

function App() {
  let [x1, setX1] = useState(-2);
  let [y1, setY1] = useState(-2 * window.innerHeight / window.innerWidth);
  let [x2, setX2] = useState(2);
  let [y2, setY2] = useState(2 * window.innerHeight / window.innerWidth);

  const [settings, setSettings] = useState<FractalSettings>({
    fractalType: FractalType.MANDELBROT,
    iterations: 128,
    sampleCount: 1
  });

  const [gradient, setGradient] = useState<Gradient>(
    // [
    //     0, 0, 0,
    //     255, 87, 25,
    //     255, 233, 133,
    //     153, 255, 253,
    //     255, 255, 255,
    // ]
    // 0, 0.1, 0.2, 0.3, 1.0
    [
      {
        color: [0, 0, 0], factor: 0
      },
      {
        color: [255, 87, 25], factor: 0.1
      },
      {
        color: [255, 233, 133], factor: 0.2
      },
      {
        color: [153, 255, 253], factor: 0.3
      },
      {
        color: [255, 255, 255], factor: 1.0
      },
    ]
  )

  return (
    <div className="App">

      <FractalCanvas 
      x1={x1} y1={y1} x2={x2} y2={y2} 
      settings={settings} gradient={gradient}></FractalCanvas>

      <ElementDragger className="fullscreen" 
      x1={x1} setX1={setX1} y1={y1} setY1={setY1} x2={x2} setX2={setX2} y2={y2} setY2={setY2}></ElementDragger>

      <Settings gradient={gradient} setGradient={setGradient} settings={settings} setSettings={setSettings}></Settings>
    </div>
  );
}

export default App
