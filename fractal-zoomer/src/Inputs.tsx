import React, { useEffect, useState } from "react";

type NumberInputProps = {
    caption: string,
    setData: (x: number) => void,
    data: number,
    options: {
        stepSize: number,
        min: number,
        max: number
    }
}

export function NumberInput(props: NumberInputProps) {
    let [isMouseDown, setIsMouseDown] = useState(false);

    const input = <input 
        onMouseDown={e => {
            e.currentTarget.requestPointerLock();
            setIsMouseDown(true);
        }} 
        onChange={e => {
            setNumber(Number(e.currentTarget.value));
        }} type="number" value={props.data}></input>;

    useEffect(() => {
        let mouseUpListener = (e: MouseEvent) => {
            document.exitPointerLock();
            setIsMouseDown(false);
        }
        
        let mouseMoveListener = (e: MouseEvent) => {
            if (isMouseDown) {
                setNumber(props.data + props.options.stepSize * e.movementX);
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

type SelectInputProps<ValueType> = {
    caption: string,
    setData: (x: ValueType) => void,
    data: ValueType,
    values: ValueType[],
    valueNames: string[],
    isEqual?: (a: ValueType, b: ValueType) => boolean
}

function indexOf<T>(arr: T[], elemToFind: T, isEqual?: (a: T, b: T) => boolean) {
    if (!isEqual) return arr.indexOf(elemToFind);
    let index = 0;
    for (let item of arr) {
        if (isEqual(item, elemToFind)) return index;
        index++;
    }
    return -1;
}

export function SelectInput<ValueType>(props: SelectInputProps<ValueType>) {
    return (
        <React.Fragment>
            <label>{props.caption}</label>
            <select value={indexOf(props.values, props.data, props.isEqual)} onChange={
                e => {
                    props.setData(props.values[Number(e.currentTarget.value)]);
                }
            }>{
                props.values.map((possibleValue, i) => (
                    <option value={i}>{props.valueNames[i]}</option>
                ))
            }</select>
        </React.Fragment>
    )
}
