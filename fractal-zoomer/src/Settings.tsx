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
}

export function MandelbrotSettingsMenu(props: FractalPropsType<MandelbrotSettings>) {
    const setter = getObjSetter((settings) => props.setSettings(settings), props.settings);
    return (
        <React.Fragment>
            <NumberInput 
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
}

export function JuliaSettingsMenu(props: FractalPropsType<JuliaSettings>) {
    const setter = getObjSetter((settings) => props.setSettings(settings), props.settings);
    return (
        <React.Fragment>
            <NumberInput data={props.settings.iterations} setData={setter("iterations")} caption="Iterations"></NumberInput>
            <NumberInput data={props.settings.cReal} setData={setter("cReal")} caption="Real part of C"></NumberInput>
            <NumberInput data={props.settings.cImaginary} setData={setter("cImaginary")} caption="Imaginary part of C"></NumberInput>
        </React.Fragment>
    );
}





export type FractalSettings = MandelbrotSettings | JuliaSettings;

type SettingsProps = 
    {
        settings: FractalSettings
        setSettings: Dispatch<SetStateAction<FractalSettings>>
    };

const DEFAULTS: [MandelbrotSettings, JuliaSettings] = [{
    fractalType: FractalType.MANDELBROT,
    iterations: 128
}, {
    fractalType: FractalType.JULIA,
    iterations: 128,
    cReal: 0.4,
    cImaginary: -0.6
}]


export function Settings(props: SettingsProps) {
    return (
        <div id="settings">
            <SelectInput 
                caption={"Fractal Type:"} 
                data={props.settings} 
                setData={(settings) => { 
                    props.setSettings(settings); 
                }}
                values={DEFAULTS} 
                valueNames={["Mandelbrot Set", "Julia Set"]}
                isEqual={(a, b) => a.fractalType == b.fractalType}
            ></SelectInput>
            {(() => {
                switch (props.settings.fractalType) {
                case FractalType.MANDELBROT:
                    return <MandelbrotSettingsMenu setSettings={props.setSettings} settings={props.settings}></MandelbrotSettingsMenu>;
                case FractalType.JULIA:
                    return <JuliaSettingsMenu setSettings={props.setSettings} settings={props.settings}></JuliaSettingsMenu>;
                }
            })()}
        </div>
    )
} 