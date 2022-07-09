import React, { useEffect, useState } from "react";

type NumberInputProps = {
    caption: string,
    setData: (x: number) => void,
    data: number,
    options: {
        stepSize: number,
        min: number,
        max: number,
        sensitivity: number
    }
}

export function NumberInput(props: NumberInputProps) {
    let [isMouseDown, setIsMouseDown] = useState(false);
    let [prevNumber, setPrevNumber] = useState(0);
    let [deltaX, setDeltaX] = useState(0);

    const input = <input className="number-input"
        onMouseDown={e => {
            e.currentTarget.requestPointerLock();
            setIsMouseDown(true);
            setDeltaX(0);
            setPrevNumber(props.data);
        }} 
        onChange={e => {
            setNumber(Number(e.currentTarget.value));
        }} type="number" value={((props.data.toPrecision(14) as unknown) as number) / 1}></input>;

    useEffect(() => {
        let mouseUpListener = (e: MouseEvent) => {
            document.exitPointerLock();
            setIsMouseDown(false);
        }
        
        let mouseMoveListener = (e: MouseEvent) => {
            if (isMouseDown) {
                setDeltaX(deltaX + e.movementX * props.options.sensitivity);
                const num = Math.floor((prevNumber + deltaX) / props.options.stepSize) * props.options.stepSize;
                setNumber(num);
            }
        }

        document.addEventListener("mouseup", mouseUpListener);
        document.addEventListener("mousemove", mouseMoveListener);

        return () => {
            document.removeEventListener("mouseup", mouseUpListener);
            document.removeEventListener("mousemove", mouseMoveListener);
        }
    })

    function setNumber(num: number) {
        props.setData(Math.max(Math.min(num, props.options.max), props.options.min));
    }

    return (
        <React.Fragment>
            <label>{props.caption}</label>
            {input}
        </React.Fragment>
    );
}
