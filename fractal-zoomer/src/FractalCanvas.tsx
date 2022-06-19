import { createRef, useEffect, useMemo, useRef, useState } from 'react';

import VERT_SHADER from "./vertex.vert?raw";
import MANDELBROT_FRAG_SHADER from "./mandelbrot.frag?raw";
import JULIA_FRAG_SHADER from "./julia.frag?raw";

export enum FractalType {
    MANDELBROT,
    JULIA
};

type FractalCanvasProps = {
    fractalType: FractalType,
    x1: number,
    y1: number,
    x2: number,
    y2: number
};

let fileCache = new Map<string, string>();
async function fetchText(filename: string) {
    if (fileCache.has(filename)) {
        return fileCache.get(filename);
    } else {
        let file = (await (await fetch(filename)).text());
        fileCache.set(filename, file);
        return file;
    }
}

function displayError(msg: string): never {
    window.alert(msg);
    throw new Error(msg);
}

type WebGLCtx = WebGLRenderingContext | WebGL2RenderingContext;

async function constructShaderProgramFromFiles(gl: WebGLCtx, vertexShaderFilename: string, fragmentShaderFilename: string) {
    // get vs source
    let vertexShaderSource = await fetchText(vertexShaderFilename);
    if (!vertexShaderSource) displayError("Vertex shader source not found!");

    // get fs source
    let fragmentShaderSource = await fetchText(fragmentShaderFilename);
    if (!fragmentShaderSource) displayError("Fragment shader source not found!");

    return constructShaderProgramFromStrings(gl, vertexShaderSource, fragmentShaderSource);
}



async function constructShaderProgramFromStrings(gl: WebGLCtx, vertexShaderSource: string, fragmentShaderSource: string) {
    // get and compile vs
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) displayError("Vertex shader creation failed!");
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        displayError(`Vertex shader compiler error: ${gl.getShaderInfoLog(vertexShader)}`);
    }

    // get and compile fs
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) displayError("Fragment shader creation failed!");
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        displayError(`Fragment shader compiler error: ${gl.getShaderInfoLog(fragmentShader)}`);
    }

    // create program
    let shaderProgram = gl.createProgram();
    if (!shaderProgram) displayError("Shader program creation failed!");
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        displayError(`Program linker error: ${gl.getProgramInfoLog(shaderProgram)}`);
    }

    return shaderProgram;
}



const fragShaderSources = {
    [FractalType.MANDELBROT]: MANDELBROT_FRAG_SHADER,
    [FractalType.JULIA]: JULIA_FRAG_SHADER
};

export function FractalCanvas(props: FractalCanvasProps) {
    // handle resize
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    useEffect(() => {
        const resize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        }
        window.addEventListener("resize", resize);
        return () => { window.removeEventListener("resize", resize) };
    })


    // canvas
    const canvasRef = createRef<HTMLCanvasElement>();
    const canvas = <canvas ref={canvasRef} {...dimensions}></canvas>;



    // load shader program
    const [shaderProgram, setShaderProgram] = useState<WebGLProgram | undefined>(undefined);
    useEffect(() => {
        (async () => {
            const canvasElem = canvasRef.current;
            if (!canvasElem) return;
            const gl = canvasRef.current.getContext("webgl2");
            if (!gl) return;
            const shaderProgram = await constructShaderProgramFromStrings(gl, VERT_SHADER,
                (fragShaderSources[props.fractalType] as unknown) as string);
            setShaderProgram(shaderProgram);
        })();
    }, [props.fractalType]);




    // load vertex buffer
    const [vertexBuffer, setVertexBuffer] = useState<WebGLBuffer | undefined>(undefined);
    useEffect(() => {
        const canvasElem = canvasRef.current;
        if (!canvasElem) return;
        const gl = canvasRef.current.getContext("webgl2");
        if (!gl) return;
        const vboData = new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 0,
            1, 1
        ]);
        const buffer = gl.createBuffer();
        if (!buffer) displayError("Vertex buffer creation failed!");
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vboData, gl.STATIC_DRAW);
        setVertexBuffer(buffer);
    }, []);




    // draw
    useEffect(() => {
        if (!vertexBuffer) return;
        if (!shaderProgram) return;
        const canvasElem = canvasRef.current;
        if (!canvasElem) return;
        const gl = canvasElem.getContext("webgl2");
        if (!gl) return;

        gl.viewport(0, 0, canvasElem.width, canvasElem.height);

        gl.useProgram(shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.uniform2fv(gl.getUniformLocation(shaderProgram, "corner1"), [props.x1, props.y1]);
        gl.uniform2fv(gl.getUniformLocation(shaderProgram, "corner2"), [props.x2, props.y2]);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    });

    return canvas;
}
