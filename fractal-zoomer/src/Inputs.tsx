import React from "react";

type NumberInputProps = {
    caption: string,
    setData: (x: number) => void,
    data: number
}

export function NumberInput(props: NumberInputProps) {
    return (
        <React.Fragment>
            <label>{props.caption}</label>
            <input onChange={e => {
                props.setData(Number(e.currentTarget.value));
            }} type="number" value={props.data}></input>
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
