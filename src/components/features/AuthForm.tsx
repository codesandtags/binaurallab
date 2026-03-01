'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function AuthForm() {
  const supabase = createClient()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
      </CardHeader>
      <CardContent>
        <Auth
          supabaseClient={supabase}
          theme="dark"
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#7c3aed',
                  brandAccent: '#6d28d9',
                  inputText: '#f8fafc',
                  inputPlaceholder: '#94a3b8',
                  inputBackground: '#1e293b',
                  inputBorder: '#1e293b',
                  inputBorderFocus: '#7c3aed',
                  inputBorderHover: '#7c3aed',
                },
              },
            },
            className: {
              input: 'text-foreground !text-white',
              label: 'text-muted-foreground',
              button: 'bg-primary text-primary-foreground hover:bg-primary/90',
            }
          }}
          providers={['google', 'github']}
          redirectTo={`${origin}/auth/callback`}
        />
      </CardContent>
    </Card>
  )
}
