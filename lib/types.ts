export interface Blog {
  id: string;
  title: string;
  category: string[];
  description: string;
  content: string;
  date: string;
  coverImage: string;
}

export interface CreateBlogInput {
  title: string;
  category: string[];
  description: string;
  content: string;
  coverImage: string;
}

export interface BlogFormData {
  title: string;
  category: string;
  description: string;
  content: string;
  coverImage: string;
}

export interface BlogListProps {
  selectedBlogId: string | null;
  onSelectBlogAction: (id: string) => void;
}

export interface BlogDetailProps {
  blogId: string | null;
}

export interface CreateBlogProps {
  onBlogCreated?: (blogId: string) => void;
}

export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
