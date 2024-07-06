
import { GET_NAMES_LEVEL_ENDPOINT, LevelsActions, LEVELS_ENDPOINT } from "@/api/levels/actions"
import { useQuery } from "@tanstack/react-query"

export const useLevels = () => {
    const { data: levels } = useQuery({
        queryKey: [LEVELS_ENDPOINT],
        queryFn: LevelsActions.GetLevels,

    })
    const { data: levelsNames } = useQuery({
        queryKey: [GET_NAMES_LEVEL_ENDPOINT],
        queryFn: LevelsActions.GetNameLevel,

    })

    const getLevel = (id?: string | undefined) => {
        return levels?.find(level => level.id == id)
    }

    return { levels, getLevel, levelsNames }
}
