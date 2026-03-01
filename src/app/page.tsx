import { createClient } from '@/lib/supabase-server'
import SessionPlayer from '@/components/features/SessionPlayer'
import SessionList from '@/components/features/SessionList'
import UserMenu from '@/components/features/UserMenu'
import { Stats } from '@/components/features/Stats'
import { LandingPage } from '@/components/features/LandingPage'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <LandingPage />
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Binaural Lab</h1>
        <UserMenu user={user} />
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <SessionPlayer />
        </div>
        <div className="space-y-8">
          <Stats />
          <SessionList />
        </div>
      </div>
    </main>
  )
}
