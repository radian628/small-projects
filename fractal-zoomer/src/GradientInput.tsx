import { createRef, Dispatch, SetStateAction, useEffect, useState } from "react";

type GradientColor = { color: [number, number, number], factor: number }

export type Gradient = GradientColor[];

type GradientInputProps = {
    gradient: Gradient,
    setGradient: Dispatch<SetStateAction<Gradient>>,
    size: number
}

function lerp(a: number, b: number, fac: number) {
    return a + (b - a) * fac;
}

function getGradientColor(gradient: Gradient, factor: number): [number, number, number] {
    if (gradient[0].factor >= factor) 
        return gradient[0].color;
    if (gradient[gradient.length - 1].factor <= factor) 
        return gradient[gradient.length - 1].color;
    let factor2 = factor;
    factor -= gradient[0].factor;
    let index = 0;
    while (index < gradient.length - 1 && factor >= gradient[index + 1].factor - gradient[index].factor) {
        index++;
        factor -= gradient[index].factor - gradient[index - 1].factor;
    }
    if (index >= gradient.length - 1)
        return gradient[gradient.length - 1].color;
    let lerpFactor = (factor2 - gradient[index].factor)
        / (gradient[index + 1].factor - gradient[index].factor);
    return [
        Math.floor(lerp(gradient[index].color[0], gradient[index + 1].color[0], lerpFactor)),
        Math.floor(lerp(gradient[index].color[1], gradient[index + 1].color[1], lerpFactor)),
        Math.floor(lerp(gradient[index].color[2], gradient[index + 1].color[2], lerpFactor))
    ]
}

export function GradientInput(props: GradientInputProps) {

    const canvasRef = createRef<HTMLCanvasElement>();
    const canvas = <canvas height={props.size} width={1} ref={canvasRef}></canvas>;

    useEffect(() => {
        const canvasElem = canvasRef.current;
        if (!canvasElem) return;
        const ctx = canvasRef.current.getContext("2d");

        let imgData = new ImageData(1, props.size);
        for (let i = 0; i < props.size; i++) {
            const factor = i / props.size;
            let color = getGradientColor(props.gradient, factor);
            imgData.data[4*i] = color[0];
            imgData.data[4*i+1] = color[1];
            imgData.data[4*i+2] = color[2];
            imgData.data[4*i+3] = 255;
        }

        ctx?.putImageData(imgData, 0, 0);
    });

    return (<div className={"gradient-input"} style={{ position: "relative", height: `${props.size}px` }}>
        {canvas}
        {props.gradient.map((col, i) => (
            <GradientColorInput 
                key={arrayToColorHex(col.color)}
                color={col.color} 
                factor={col.factor} 
                containerSize={props.size}
                setGradientColor={(newCol) => {
                    props.setGradient(props.gradient.map((col, j) => (i == j) ? newCol : col)
                        .sort((a, b) => a.factor - b.factor));
                }}
            ></GradientColorInput>))}
    </div>)
}






function arrayToColorHex(array: [number, number, number]) {
    return "#" + array.map(elem => elem.toString(16).padStart(2, "0")).join("");
}

function colorHexToArray(colorHex: string): [number, number, number] {
    return [
        parseInt(colorHex.slice(1, 3), 16),
        parseInt(colorHex.slice(3, 5), 16),
        parseInt(colorHex.slice(5, 7), 16),
    ];
}

type GradientColorInputProps = GradientColor &
{
    containerSize: number,
    setGradientColor: (color: GradientColor) => void
}

function GradientColorInput(props: GradientColorInputProps) {
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [didMouseMove, setDidMouseMove] = useState(false);
    const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);


    const input = (<input type="color" value={arrayToColorHex(props.color)} 
        onMouseDown={e => {
            setDidMouseMove(false);
            setIsMouseDown(true);
        }}
        onClick={e => {
            if (didMouseMove) return e.preventDefault();
            setIsColorMenuOpen(true);
        }}
        onChange={
            e => { props.setGradientColor({
                color: colorHexToArray(e.currentTarget.value),
                factor: props.factor
            }); }
        }
    style={{position: "absolute", top: `${props.factor * props.containerSize}px`, left: "0px", zIndex: isMouseDown ? 2 : 1 }}
    ></input>);


    useEffect(() => {

        const mouseUpListener = (e: MouseEvent) => {
            setIsMouseDown(false);
        }

        const mouseMoveListener = (e: MouseEvent) => {
            if (isMouseDown) {
                setDidMouseMove(true);
                props.setGradientColor({
                    color: props.color,
                    factor: Math.min(Math.max(props.factor + e.movementY / props.containerSize, 0), 1)
                });
            }
        }

        const clickListener = (e: MouseEvent) => {
            setIsColorMenuOpen(false);
        }
        
        document.addEventListener("click", clickListener);
        document.addEventListener("mouseup", mouseUpListener);
        document.addEventListener("mousemove", mouseMoveListener);

        return () => {
            document.removeEventListener("click", clickListener);
            document.removeEventListener("mouseup", mouseUpListener);
            document.removeEventListener("mousemove", mouseMoveListener);
        }
    });

    return input;
}