import AuthForm from '@/components/features/AuthForm'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <AuthForm />
    </div>
  )
}
