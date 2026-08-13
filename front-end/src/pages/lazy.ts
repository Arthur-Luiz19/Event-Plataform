import { lazy } from 'react'

export const RegisterPage = lazy(() => import('./RegisterPage').then((page) => ({ default: page.RegisterPage })))
export const EventDetailsPage = lazy(() => import('./EventDetailsPage').then((page) => ({ default: page.EventDetailsPage })))
export const GatePage = lazy(() => import('./GatePage').then((page) => ({ default: page.GatePage })))
export const OrganizerPage = lazy(() => import('./OrganizerPage').then((page) => ({ default: page.OrganizerPage })))
export const OrganizerEventFormPage = lazy(() => import('./OrganizerEventFormPage').then((page) => ({ default: page.OrganizerEventFormPage })))
export const ReservationPage = lazy(() => import('./ReservationPage').then((m) => ({ default: m.ReservationPage })))
export const CheckoutPage = lazy(() => import('./CheckoutPage').then((m) => ({ default: m.CheckoutPage })))
export const MyTicketsPage = lazy(() => import('./MyTicketsPage').then((m) => ({ default: m.MyTicketsPage })))
export const TicketSharePage = lazy(() => import('./TicketSharePage').then((m) => ({ default: m.TicketSharePage })))
export const PurchaseSuccessPage = lazy(() => import('./PurchaseSuccessPage').then((m) => ({ default: m.PurchaseSuccessPage })))
export const MyReservationsPage = lazy(() => import('./MyReservationsPage').then((m) => ({ default: m.MyReservationsPage })))
