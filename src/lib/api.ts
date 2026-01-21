import { Blog, CreateBlogInput } from './types'

const API_URL = 'http://localhost:3001'

export const blogAPI = {
  getAllBlogs: async (): Promise<Blog[]> => {
    const response = await fetch(`${API_URL}/blogs`)
    if (!response.ok) {
      throw new Error('Failed to fetch blogs')
    }
    return response.json()
  },

  getBlogById: async (id: string): Promise<Blog> => {
    const response = await fetch(`${API_URL}/blogs/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch blog')
    }
    return response.json()
  },

  createBlog: async (blog: CreateBlogInput): Promise<Blog> => {
    const blogWithDate = {
      ...blog,
      date: new Date().toISOString(),
    }

    const response = await fetch(`${API_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogWithDate),
    })
    if (!response.ok) {
      throw new Error('Failed to create blog')
    }
    return response.json()
  },
}
