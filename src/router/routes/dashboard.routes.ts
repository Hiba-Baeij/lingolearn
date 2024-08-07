import React from "react";
import { RouteRecord } from "@/shared/types/route";
import DashboardLayout from '@/layouts/dashboard/dashboard.layout'
import FullScreenLayout from "@/layouts/fullscreen.layout";

export const DashboardRoutes: RouteRecord[] = [
    {
        layout: DashboardLayout,
        component: React.lazy(() => import('@/app/home/home.view')),
        path: '/',


    },
    {
        layout: DashboardLayout,
        component: React.lazy(() => import('@/app/students/students.page')),
        path: '/students',
    },
    {
        layout: DashboardLayout,
        component: React.lazy(() => import('@/app/languages/languages.page')),
        path: '/languages',
    },
    {
        layout: DashboardLayout,
        component: React.lazy(() => import('@/app/languages/languageDetails.page')),
        path: '/languages/:id',
    },

    {
        layout: DashboardLayout,
        component: React.lazy(() => import('@/app/levels/levels.page')),
        path: '/levels',
    },
    {
        layout: DashboardLayout,
        component: React.lazy(() => import('@/app/levels/levelDetails.page')),
        path: '/levels/:id',
    },

    {
        layout: DashboardLayout,
        component: React.lazy(() => import('@/app/lessons/lessons.page')),
        path: '/lessons',
    },

    {
        layout: DashboardLayout,
        component: React.lazy(() => import('@/app/notifications/notifications.page')),
        path: '/notifications',
    },
    {
        layout: DashboardLayout,
        component: React.lazy(() => import('@/app/contacts/contacts.page')),
        path: '/contacts',
    },
    {
        layout: DashboardLayout,
        component: React.lazy(() => import('@/app/advertisements/advertisements.page')),
        path: '/advertisements',
    },
    {
        layout: DashboardLayout,
        component: React.lazy(() => import('@/app/exams/exams.page')),
        path: '/exams',
    },
    {
        layout: DashboardLayout,
        component: React.lazy(() => import('@/app/challenge/challenge.page')),
        path: '/champions',
    },
    {
        layout: DashboardLayout,
        component: React.lazy(() => import('@/app/challenge/bankQuestions.page')),
        path: '/champions/:id/questions-bank',
    },
    {
        layout: FullScreenLayout,
        component: React.lazy(() => import('@/app/not-found')),
        path: '/*',

    },

    {
        layout: FullScreenLayout,
        component: React.lazy(() => import('@/app/auth/login.view')),
        path: '/login'
    },



]