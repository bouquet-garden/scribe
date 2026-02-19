'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  onClose: () => void
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

interface FileUpload {
  file: File
  state: UploadState
  error?: string
  progress: number
}

export default function UploadZone({ onClose }: Props) {
  const [uploads, setUploads] = useState<FileUpload[]>([])
  const [dragging, setDragging] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const addFiles = useCallback((files: FileList | File[]) => {
    const newUploads = Array.from(files).map(file => ({
      file,
      state: 'idle' as UploadState,
      progress: 0,
    }))
    setUploads(prev => [...prev, ...newUploads])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }, [addFiles])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files)
  }

  const uploadAll = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const orgId = user.id

    for (let i = 0; i < uploads.length; i++) {
      const upload = uploads[i]
      if (upload.state !== 'idle') continue

      setUploads(prev => prev.map((u, idx) =>
        idx === i ? { ...u, state: 'uploading', progress: 10 } : u
      ))

      try {
        const path = `${orgId}/${Date.now()}-${upload.file.name}`

        const { error: storageError } = await supabase.storage
          .from('documents')
          .upload(path, upload.file)

        if (storageError) throw storageError

        setUploads(prev => prev.map((u, idx) =>
          idx === i ? { ...u, progress: 60 } : u
        ))

        const { error: dbError } = await supabase.from('documents').insert({
          organization_id: orgId,
          filename: upload.file.name,
          file_path: path,
          file_size: upload.file.size,
          mime_type: upload.file.type,
          status: 'uploaded',
        })

        if (dbError) throw dbError

        setUploads(prev => prev.map((u, idx) =>
          idx === i ? { ...u, state: 'success', progress: 100 } : u
        ))
      } catch (err: any) {
        setUploads(prev => prev.map((u, idx) =>
          idx === i ? { ...u, state: 'error', error: err.message, progress: 0 } : u
        ))
      }
    }

    router.refresh()
  }

  const hasIdle = uploads.some(u => u.state === 'idle')
  const allDone = uploads.length > 0 && uploads.every(u => u.state === 'success' || u.state === 'error')

  return (
    <Card className="border-2">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Upload Documents</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer
            ${dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}`}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="font-medium">Drop files here or click to browse</p>
          <p className="text-sm text-muted-foreground mt-1">PDF, MP3, MP4, CSV, DOCX up to 50MB</p>
          <input
            id="file-input"
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.mp3,.mp4,.csv,.docx,.doc,.txt,.wav"
            onChange={handleFileInput}
          />
        </div>

        {uploads.length > 0 && (
          <div className="space-y-2">
            {uploads.map((u, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm flex-1 truncate">{u.file.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {(u.file.size / 1024 / 1024).toFixed(1)}MB
                </span>
                {u.state === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />}
                {u.state === 'success' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                {u.state === 'error' && (
                  <span className="text-xs text-destructive shrink-0" title={u.error}>
                    <AlertCircle className="h-4 w-4" />
                  </span>
                )}
                {u.state === 'idle' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={e => { e.stopPropagation(); setUploads(prev => prev.filter((_, idx) => idx !== i)) }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          {allDone ? (
            <Button onClick={onClose}>Done</Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={uploadAll} disabled={!hasIdle} className="gap-2">
                <Upload className="h-4 w-4" />
                Upload {uploads.filter(u => u.state === 'idle').length > 0
                  ? `${uploads.filter(u => u.state === 'idle').length} file${uploads.filter(u => u.state === 'idle').length > 1 ? 's' : ''}`
                  : ''}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}