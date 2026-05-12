import { redirect } from "next/navigation"

// In a real app this would read from session/cookie.
// For demo: redirects to admin dashboard by default.
export default function DashboardRedirect() {
  redirect("/dashboard/admin")
}
