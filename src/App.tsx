import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Header } from './components/Header'
import { BlogList } from './components/BlogList'
import { BlogDetail } from './components/BlogDetail'
import { CreateBlog } from './components/CreateBlog'
import { Button } from './components/ui/button'
import { ArrowLeft, FileText } from 'lucide-react'
import '../styles/globals.css'

const queryClient = new QueryClient()

export default function App() {
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null)
  const [isMobileDetailView, setIsMobileDetailView] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleBlogCreated = (blogId: string) => {
    setSelectedBlogId(blogId)
    setIsMobileDetailView(true)
  }

  const handleBackToList = () => {
    setIsMobileDetailView(false)
    setSelectedBlogId(null)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Header onSearchChange={setSearchQuery} />
        <div className="container mx-auto px-4 py-4">
          {isMobileDetailView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToList}
              className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </Button>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div
              className={`xl:col-span-4 space-y-3 ${
                isMobileDetailView ? 'hidden xl:block' : 'block'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">All Blogs</h2>
              </div>

              <CreateBlog onBlogCreated={handleBlogCreated} />

              <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rounded">
                <BlogList
                  selectedBlogId={selectedBlogId}
                  searchQuery={searchQuery}
                  onSelectBlogAction={(id: string) => {
                    setSelectedBlogId(id)
                    setIsMobileDetailView(true)
                  }}
                />
              </div>
            </div>

            <div
              className={`xl:col-span-8 ${
                !isMobileDetailView ? 'hidden xl:block' : 'block'
              }`}
            >
              <div className="sticky top-20">
                <BlogDetail blogId={selectedBlogId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}

