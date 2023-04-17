import { useState, useEffect, useCallback } from "react";

export default function useScreenSize(){
    const switchWidth = 700
    const [screenSize, setScreenSize] = useState(window.innerWidth < switchWidth ? "small": "big")

    const handleResizeWindow = useCallback(() => {
        const size = window.innerWidth < switchWidth ? "small": "big"
        if(size !== screenSize){
            setScreenSize(size)
        }
    },[screenSize])

    useEffect(() => {
        window.addEventListener("resize", handleResizeWindow);
        return () => {
            window.removeEventListener("resize", handleResizeWindow);
        };
    }, [handleResizeWindow]);

    return screenSize
}