'use client';

import { useQuery } from '@tanstack/react-query'
import { blogAPI } from '@/lib/api'
import { Blog } from '@/lib/types'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { Clock, Calendar } from 'lucide-react'

interface BlogListProps {
  selectedBlogId: string | null
  onSelectBlogAction: (id: string) => void
  searchQuery?: string
}

function BlogCardSkeleton() {
  return (
    <div className="space-y-2 p-1">
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-muted rounded-full animate-pulse"></div>
        <div className="h-5 w-20 bg-muted rounded-full animate-pulse"></div>
      </div>
      <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>
      <div className="h-10 bg-muted rounded animate-pulse"></div>
      <div className="flex gap-4">
        <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
        <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
      </div>
    </div>
  )
}

export function BlogList({ selectedBlogId, onSelectBlogAction, searchQuery = '' }: BlogListProps) {
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogAPI.getAllBlogs,
  })

  const filteredBlogs = blogs?.filter((blog: Blog) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      blog.title.toLowerCase().includes(query) ||
      blog.description.toLowerCase().includes(query) ||
      blog.category.some((cat) => cat.toLowerCase().includes(query))
    )
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="cursor-pointer border-muted/60">
            <CardContent className="p-4">
              <BlogCardSkeleton />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <div>
          <p className="font-semibold">Error loading blogs</p>
          <p className="text-sm opacity-80">Make sure the JSON Server is running on http://localhost:3001</p>
        </div>
      </div>
    )
  }

  if (!filteredBlogs || filteredBlogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          {searchQuery ? 'No blogs match your search.' : 'No blogs found. Create one to get started!'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredBlogs.map((blog: Blog) => (
        <Card
          key={blog.id}
          className={`cursor-pointer transition-all duration-200 border-muted/60 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30 ${
            selectedBlogId === blog.id
              ? 'ring-2 ring-primary/50 shadow-md border-primary/30 bg-gradient-card'
              : 'hover:bg-gradient-card'
          }`}
          onClick={() => onSelectBlogAction(blog.id)}
        >
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {blog.category.slice(0, 3).map((cat, index) => (
                <Badge
                  key={cat}
                  variant={selectedBlogId === blog.id ? 'default' : 'secondary'}
                  className={`text-xs font-medium px-2 py-0.5 ${
                    index === 0
                      ? 'bg-gradient-primary text-white'
                      : index === 1
                        ? 'bg-gradient-secondary text-white'
                        : 'bg-gradient-accent text-white'
                  }`}
                >
                  {cat}
                </Badge>
              ))}
              {blog.category.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{blog.category.length - 3}
                </Badge>
              )}
            </div>

            <h3
              className={`font-semibold text-sm leading-snug mb-2 line-clamp-2 ${
                selectedBlogId === blog.id ? 'text-primary' : 'text-foreground'
              }`}
            >
              {blog.title}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-2 leading-relaxed">{blog.description}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {(() => {
                    const date = new Date(blog.date)
                    return !isNaN(date.getTime()) ? format(date, 'MMM d, yyyy') : 'Date not available'
                  })()}
                </span>
              </div>
              {blog.content && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 200))} min read</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
