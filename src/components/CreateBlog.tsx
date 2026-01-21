'use client';

import React from "react"

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { blogAPI } from '@/lib/api'
import { CreateBlogInput } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Alert, AlertDescription } from './ui/alert'
import { AlertCircle, Loader2, PenSquare } from 'lucide-react'

interface CreateBlogProps {
  onBlogCreated?: (blogId: string) => void
}

export function CreateBlog({ onBlogCreated }: CreateBlogProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    content: '',
    coverImage: '',
  })

  const queryClient = useQueryClient()

  const { mutate: createBlog, isPending } = useMutation({
    mutationFn: async () => {
      const categories = formData.category
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)

      if (!formData.title || categories.length === 0) {
        throw new Error('Title and at least one category are required')
      }

      const payload: CreateBlogInput = {
        title: formData.title,
        category: categories,
        description: formData.description,
        content: formData.content,
        coverImage: formData.coverImage,
      }

      return blogAPI.createBlog(payload)
    },

    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })

      setFormData({
        title: '',
        category: '',
        description: '',
        content: '',
        coverImage: '',
      })

      setError('')
      setOpen(false)

      onBlogCreated?.(newBlog.id)
    },

    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to create blog')
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    createBlog()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full rounded-lg">
          <PenSquare className="w-4 h-4 mr-2" />
          Create Blog
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto rounded-xl top-[52%] translate-y-[-50%]">
        <DialogHeader>
          <DialogTitle>Create New Blog</DialogTitle>
          <DialogDescription>Fill in the details below to publish a new blog post.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categories * (comma separated)</label>
            <Input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="TECH, FINANCE"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description *</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content *</label>
            <Textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cover Image URL *</label>
            <Input
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              type="url"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>

            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <PenSquare className="mr-2 h-4 w-4" />
                  Publish Blog
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
