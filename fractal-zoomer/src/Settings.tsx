import React, { Dispatch, SetStateAction } from "react"
import { FractalType } from "./FractalCanvas";
import { NumberInput, SelectInput } from "./Inputs";

type GetPropertiesOfType<T, PropType> = { [P in keyof T]: T[P] extends PropType ? P : never }

function getObjSetter
<ObjType>
(setState: (x: ObjType) => void, obj: ObjType) {
    return <PropType, Key extends keyof GetPropertiesOfType<ObjType, PropType>,>(key: Key) => {
        return (newData: PropType) => {
            setState({
                ...obj,
                [key]: newData
            });
        }
    }
}

export type FractalPropsType<SettingsType> = {
    settings: SettingsType,
    setSettings: Dispatch<SetStateAction<FractalSettings>>
}

export type MandelbrotSettings = {
    fractalType: FractalType.MANDELBROT,
    iterations: number,
    sampleCount: number
}

export function MandelbrotSettingsMenu(props: FractalPropsType<MandelbrotSettings>) {
    const setter = getObjSetter((settings) => props.setSettings(settings), props.settings);
    return (
        <React.Fragment>
            <NumberInput 
                options={{ stepSize: 1, min: 0, max: Infinity }}
                data={props.settings.iterations} 
                setData={setter("iterations")} 
                caption="Iterations"></NumberInput>
        </React.Fragment>
    );
}






export type JuliaSettings = {
    fractalType: FractalType.JULIA,
    iterations: number,
    cReal: number,
    cImaginary: number,
    sampleCount: number
}

export function JuliaSettingsMenu(props: FractalPropsType<JuliaSettings>) {
    const setter = getObjSetter((settings) => props.setSettings(settings), props.settings);
    return (
        <React.Fragment>
            <NumberInput 
                options={{ stepSize: 1, min: 0, max: Infinity }} 
                data={props.settings.iterations} setData={setter("iterations")} caption="Iterations"></NumberInput>
            <NumberInput 
                options={{ stepSize: 0.001, min: -Infinity, max: Infinity }} 
                data={props.settings.cReal} setData={setter("cReal")} caption="Real part of C"></NumberInput>
            <NumberInput 
                options={{ stepSize: 0.001, min: -Infinity, max: Infinity }} 
                data={props.settings.cImaginary} setData={setter("cImaginary")} caption="Imaginary part of C"></NumberInput>
        </React.Fragment>
    );
}







export type DucksSettings = {
    fractalType: FractalType.DUCKS,
    iterations: number,
    pReal: number,
    pImaginary: number,
    sampleCount: number
}

export function DucksSettingsMenu(props: FractalPropsType<DucksSettings>) {
    const setter = getObjSetter((settings) => props.setSettings(settings), props.settings);
    return (
        <React.Fragment>
            <NumberInput 
                options={{ stepSize: 1, min: 0, max: Infinity }} 
                data={props.settings.iterations} setData={setter("iterations")} caption="Iterations"></NumberInput>
            <NumberInput 
                options={{ stepSize: 0.001, min: -Infinity, max: Infinity }} 
                data={props.settings.pReal} setData={setter("pReal")} caption="Real part of C"></NumberInput>
            <NumberInput 
                options={{ stepSize: 0.001, min: -Infinity, max: Infinity }} 
                data={props.settings.pImaginary} setData={setter("pImaginary")} caption="Imaginary part of C"></NumberInput>
        </React.Fragment>
    );
}







export type FractalSettings = MandelbrotSettings | JuliaSettings | DucksSettings;

type SettingsProps = 
    {
        settings: FractalSettings
        setSettings: Dispatch<SetStateAction<FractalSettings>>
    };

const DEFAULTS: [MandelbrotSettings, JuliaSettings, DucksSettings] = [
    {
        fractalType: FractalType.MANDELBROT,
        iterations: 128,
        sampleCount: 1
    }, 
    {
        fractalType: FractalType.JULIA,
        iterations: 128,
        cReal: 0.4,
        cImaginary: -0.6,
        sampleCount: 1
    },
    {
        fractalType: FractalType.DUCKS,
        iterations: 64,
        pReal: 0.7,
        pImaginary: -0.4,
        sampleCount: 4
    }
];

export function Settings(props: SettingsProps) {
    const setter = getObjSetter((settings) => props.setSettings(settings), props.settings);
    return (
        <div id="settings">
            <SelectInput 
                caption={"Fractal Type:"} 
                data={props.settings} 
                setData={(settings) => { 
                    props.setSettings(settings); 
                }}
                values={DEFAULTS} 
                valueNames={["Mandelbrot Set", "Julia Set", "Ducks Fractal"]}
                isEqual={(a, b) => a.fractalType == b.fractalType}
            ></SelectInput>
            <NumberInput 
                options={{ stepSize: 1, min: 1, max: Infinity }} 
                data={props.settings.sampleCount} setData={setter("sampleCount")} caption="Sample Count"></NumberInput>
            {(() => {
                switch (props.settings.fractalType) {
                case FractalType.MANDELBROT:
                    return <MandelbrotSettingsMenu setSettings={props.setSettings} settings={props.settings}></MandelbrotSettingsMenu>;
                case FractalType.JULIA:
                    return <JuliaSettingsMenu setSettings={props.setSettings} settings={props.settings}></JuliaSettingsMenu>;
                case FractalType.DUCKS:
                    return <DucksSettingsMenu setSettings={props.setSettings} settings={props.settings}></DucksSettingsMenu>;
                }
            })()}
        </div>
    )
} 