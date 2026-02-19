'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DocumentCard from '@/components/DocumentCard'
import UploadZone from '@/components/UploadZone'
import { FileText, Clock, CheckCircle, Plus, LogOut } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface Document {
  id: string
  filename: string
  vertical?: string
  status: string
  created_at: string
}

interface Stats {
  totalDocuments: number
  processingJobs: number
  completedJobs: number
}

interface Props {
  user: User
  documents: Document[]
  stats: Stats
}

export default function DashboardClient({ user, documents, stats }: Props) {
  const [showUpload, setShowUpload] = useState(false)

  const statCards = [
    { title: 'Documents Uploaded', value: stats.totalDocuments.toString(), icon: FileText, sub: 'Total in your org' },
    { title: 'Processing', value: stats.processingJobs.toString(), icon: Clock, sub: 'Jobs in progress' },
    { title: 'Completed', value: stats.completedJobs.toString(), icon: CheckCircle, sub: 'Successfully processed' },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowUpload(!showUpload)} className="gap-2">
            <Plus className="h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {showUpload && <UploadZone onClose={() => setShowUpload(false)} />}

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Documents</h2>
        </div>
        {documents.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border rounded-lg border-dashed">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No documents yet</p>
            <p className="text-sm mt-1">Upload your first document to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={{
                  id: doc.id,
                  filename: doc.filename,
                  vertical: doc.vertical ?? 'General',
                  status: doc.status as any,
                  createdAt: doc.created_at,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}