import { redirect } from 'next/navigation';

/**
 * Root Page
 * Server-side redirects incoming root requests (`/`) to the default language locale (`/ar`).
 */
export default function RootPage() {
  redirect('/ar');
}
