import { createClient } from '@/lib/supabase-server'
import SessionPlayer from '@/components/features/SessionPlayer'
import SessionList from '@/components/features/SessionList'
import UserMenu from '@/components/features/UserMenu'
import { Stats } from '@/components/features/Stats'
import { LandingPage } from '@/components/features/LandingPage'

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

  return (
    <main className="min-h-screen bg-background p-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Binaural Lab</h1>
            {isGuest && !user && (
                <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">
                    Guest Mode
                </span>
            )}
        </div>
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
