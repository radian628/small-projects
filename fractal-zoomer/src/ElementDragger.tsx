import { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState, WheelEventHandler } from "react";

export type ElementDraggerProps = {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    setX1: Dispatch<SetStateAction<number>>,
    setY1: Dispatch<SetStateAction<number>>,
    setX2: Dispatch<SetStateAction<number>>,
    setY2: Dispatch<SetStateAction<number>>,
    className?: string
}


export function ElementDragger(props: ElementDraggerProps) {
    
    const [mouseDown, setMouseDown] = useState(false);

    const mousedown: MouseEventHandler = e => {
        setMouseDown(true);
    };

    useEffect(() => {
        const mouseup = (e: MouseEvent) => {
            setMouseDown(false);
        };
        document.addEventListener("mouseup", mouseup);
        const resize = () => {
            let worldWidth = props.x2 - props.x1;
            let worldHeight = worldWidth * window.innerHeight / window.innerWidth;
            let centerX = (props.x2 + props.x1) / 2;
            let centerY = (props.y2 + props.y1) / 2;
            props.setX1(centerX - worldWidth / 2);
            props.setY1(centerY - worldHeight / 2);
            props.setX2(centerX + worldWidth / 2);
            props.setY2(centerY + worldHeight / 2);
        }
        window.addEventListener("resize", resize);
        return () => {
            document.removeEventListener("mouseup", mouseup);
            window.removeEventListener("resize", resize);
        }
    })

    const mousemove: MouseEventHandler = e => {
        if (mouseDown) {
            let worldWidth = props.x2 - props.x1;
            let worldHeight = props.y2 - props.y1;
            let rect = e.currentTarget.getBoundingClientRect();
            let pixelWidth = rect.width;
            let pixelHeight = rect.height;
            props.setX1(props.x1 - e.movementX / pixelWidth * worldWidth);
            props.setY1(props.y1 + e.movementY / pixelHeight * worldHeight);
            props.setX2(props.x2 - e.movementX / pixelWidth * worldWidth);
            props.setY2(props.y2 + e.movementY / pixelHeight * worldHeight);
        }
    };

    const wheel: WheelEventHandler = e => {
        let worldWidth = props.x2 - props.x1;
        let worldHeight = props.y2 - props.y1;
        let centerX = (props.x2 + props.x1) / 2;
        let centerY = (props.y2 + props.y1) / 2;

        let scaleFactor = 1 + Math.sign(e.deltaY) * 0.04;

        props.setX1(centerX - worldWidth / 2 * scaleFactor);
        props.setY1(centerY - worldHeight / 2 * scaleFactor);
        props.setX2(centerX + worldWidth / 2 * scaleFactor);
        props.setY2(centerY + worldHeight / 2 * scaleFactor);
    }

    const div = <div className={props.className} onMouseMove={mousemove} onMouseDown={mousedown} onWheel={wheel}></div>;

    return div;
}