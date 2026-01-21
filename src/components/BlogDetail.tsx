import { useQuery } from '@tanstack/react-query'
import { blogAPI } from '@/lib/api'
import { Badge } from './ui/badge'
import { AlertCircle, Calendar, Clock, User, Quote } from 'lucide-react'
import { format } from 'date-fns'

interface BlogDetailProps {
  blogId: string | null
}

function BlogDetailSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="w-full h-48 sm:h-64 bg-muted rounded-xl"></div>
      <div className="space-y-3">
        <div className="h-7 bg-muted rounded w-3/4"></div>
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-muted rounded-full"></div>
          <div className="h-6 w-24 bg-muted rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )
}

export function BlogDetail({ blogId }: BlogDetailProps) {
  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => blogAPI.getBlogById(blogId!),
    enabled: !!blogId,
  })

  if (!blogId) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Quote className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-lg text-muted-foreground mb-2">Select a blog to view details</p>
        <p className="text-sm text-muted-foreground/70">Choose a blog from the list to start reading</p>
      </div>
    )
  }

  if (isLoading) {
    return <BlogDetailSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <div>
          <p className="font-semibold">Error loading blog</p>
          <p className="text-sm opacity-80">Could not load the selected blog.</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <p className="text-muted-foreground">Blog not found</p>
      </div>
    )
  }

  const readTime = blog.content ? Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 200)) : 1
  const formattedDate = blog.date && !isNaN(new Date(blog.date).getTime())
    ? format(new Date(blog.date), 'MMMM d, yyyy')
    : 'Date not available'

  return (
    <article className="space-y-4 bg-gradient-card rounded-xl p-4 sm:p-6 shadow-sm">
      {/* Cover Image */}
      <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden bg-muted shadow-sm">
        {blog.coverImage ? (
          <img
            src={blog.coverImage || "/placeholder.svg"}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Quote className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Header Section */}
      <div className="space-y-4">
        {/* Category Badges */}
        <div className="flex flex-wrap gap-2">
          {blog.category.map((cat: string, index: number) => (
            <Badge
              key={cat}
              variant="secondary"
              className={`text-sm font-medium px-3 py-1 ${
                index % 4 === 0
                  ? 'bg-gradient-primary text-white'
                  : index % 4 === 1
                    ? 'bg-gradient-secondary text-white'
                    : index % 4 === 2
                      ? 'bg-gradient-accent text-white'
                      : 'bg-gradient-violet text-white'
              }`}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-foreground">
          {blog.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-stone max-w-none dark:prose-invert">
        <p className="text-base sm:text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {blog.content}
        </p>
      </div>

      {/* Quote-style Highlight Box */}
      {blog.description && (
        <div className="my-6 p-4 bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-lg border-l-4 border-gradient-primary shadow-md">
          <Quote className="w-5 h-5 text-primary/60 mb-2" />
          <p className="text-base italic text-foreground/80 leading-relaxed font-medium">
            "{blog.description}"
          </p>
        </div>
      )}

      {/* Author Section */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">Author</p>
            <p className="text-sm text-muted-foreground">Blog Application Team</p>
          </div>
        </div>
      </div>
    </article>
  )
}
