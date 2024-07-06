
import { GET_AVAILABLE_LANGUAGE_ENDPOINT, LanguagesActions, LANGUAGES_ENDPOINT } from "@/api/languages/actions"
import { useQuery } from "@tanstack/react-query"

export const useLanguages = () => {
    const { data: languages } = useQuery({
        queryKey: [LANGUAGES_ENDPOINT],
        queryFn: LanguagesActions.GetLanguages,

    })
    const { data: availablelanguages } = useQuery({
        queryKey: [GET_AVAILABLE_LANGUAGE_ENDPOINT],
        queryFn: LanguagesActions.GetAvailableLanguage,
    })


    const getLanguage = (id?: string | undefined) => {
        return languages?.find(lang => lang.id == id)
    }

    return { languages, getLanguage, availablelanguages }
}
