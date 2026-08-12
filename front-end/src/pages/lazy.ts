import { lazy } from 'react'

export const RegisterPage = lazy(() => import('./RegisterPage').then((page) => ({ default: page.RegisterPage })))
export const EventDetailsPage = lazy(() => import('./EventDetailsPage').then((page) => ({ default: page.EventDetailsPage })))
export const GatePage = lazy(() => import('./GatePage').then((page) => ({ default: page.GatePage })))
export const OrganizerPage = lazy(() => import('./OrganizerPage').then((page) => ({ default: page.OrganizerPage })))
export const OrganizerEventFormPage = lazy(() => import('./OrganizerEventFormPage').then((page) => ({ default: page.OrganizerEventFormPage })))
