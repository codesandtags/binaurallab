import { createClient } from '@/lib/supabase-server'
import { LandingPage } from '@/components/features/LandingPage'
import DashboardClient from '@/components/features/DashboardClient'

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const isGuest = searchParams.guest === 'true'
  
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !isGuest) {
    return <LandingPage />
  }

  // Pass user details to the dashboard
  const userGreetingName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Developer"

  return <DashboardClient user={user} userName={userGreetingName} />
}
