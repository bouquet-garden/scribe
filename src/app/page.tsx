import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/DashboardClient'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Fetch real data
  const [{ data: documents }, { data: jobs }] = await Promise.all([
    supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = {
    totalDocuments: documents?.length ?? 0,
    processingJobs: jobs?.filter(j => j.status === 'processing').length ?? 0,
    completedJobs: jobs?.filter(j => j.status === 'completed').length ?? 0,
  }

  return (
    <DashboardClient
      user={user}
      documents={documents ?? []}
      stats={stats}
    />
  )
}