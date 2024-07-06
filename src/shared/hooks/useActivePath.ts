import { useLocation } from "react-router-dom"

export const useActivePath = () => {
    const { pathname } = useLocation()
    const isActive = (path: string, exact?: boolean) => {
        return (!exact && pathname.startsWith(path)) || (exact && pathname === path)
    }

    return isActive;
}