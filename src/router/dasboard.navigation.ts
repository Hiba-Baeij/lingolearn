
import { NavigationRecord } from '@/shared/types/navigation'
import { IoDocumentText, IoHomeSharp } from 'react-icons/io5';
import { SiBookstack } from "react-icons/si";
import { IoMdNotifications } from "react-icons/io";
import { MdOutlineHeadsetMic } from "react-icons/md";
import {  FaRoad } from "react-icons/fa6";
import { GiChampions } from "react-icons/gi";
import { FaUsers } from 'react-icons/fa';
import { FaBarsProgress } from "react-icons/fa6";
import { GrLanguage } from "react-icons/gr";
import { MdOutlineContactSupport } from "react-icons/md";

export const DashboardNavigationMain: NavigationRecord[] = [
    {
        text: "الرئيسية",
        path: "/",
        icon: IoHomeSharp,

    },
    {
        text: "الطلاب",
        path: "/students",
        icon: FaUsers,

    },
    {
        text: "اللغات",
        path: "/languages",
        icon: GrLanguage,

    },

    {
        text: "الكورسات",
        icon: FaBarsProgress,
        childrens: [
            { text: "المستويات", path: '/levels', icon: FaRoad },
            { text: "الدروس", path: '/lessons', icon: SiBookstack },
            { text: "التحديات", path: '/champions', icon: GiChampions },
        ]
    },
    {
        text: "الاختبارات",
        path: "/exams",
        icon: IoDocumentText,

    },
    {
        text: "تواصل معنا",
        path: "/contacts",
        icon: MdOutlineContactSupport,

    },
    {
        text: "الإشعارات",
        path: "/notifications",
        icon: IoMdNotifications,

    },
    {
        text: "الإعلانات",
        path: "/advertisements",
        icon: MdOutlineHeadsetMic,

    },


]


export default DashboardNavigationMain;