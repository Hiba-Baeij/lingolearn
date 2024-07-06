import { Context, Dispatch, SetStateAction, createContext, useEffect, useState } from "react";
type Mode = 'dark' | 'light'
const ColorModeContext: Context<{ mode: string, setMode: Dispatch<SetStateAction<Mode>> | any }> = createContext({ mode: 'dark', setMode: () => { return true } })

const useDarkMode = (params?: { initialValue: Mode }) => {
    const [mode, setMode] = useState<Mode>('dark')
    useEffect(() => {
        const storedMode: Mode = localStorage.getItem('dark_mode') as Mode
        setMode(storedMode ?? params?.initialValue ?? 'dark')
    }, [params?.initialValue])
    const setActiveMode = (m: Mode) => {
        localStorage.setItem('dark_mode', m)
        setMode(m)

    }
    return { mode, setMode: setActiveMode, }
}

export { ColorModeContext, useDarkMode }
