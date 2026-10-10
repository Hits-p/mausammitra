import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'MausamMitra', description: 'Hyperlocal environmental risk intelligence for Dwarka, Delhi' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
