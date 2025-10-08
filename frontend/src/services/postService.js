import api from './api';

const API_URL = '/blog/posts';

export const postService = {
  async getAllBlogPosts(page=1, filters={}) {
        try {
            const params = new URLSearchParams({ page });

            if (filters.search) params.append("search", filters.search);
            if (filters.category_id && filters.category_id !== 0) {
                params.append("category_id", filters.category_id);
            }

            const response = await api.get(`/blog/posts/?${params.toString()}`, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('access_token')}` 
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching blog posts:", error);
            throw error;
        }
    },
    async getBlogPost(slug) {
        try {
            const response = await api.get(`/blog/posts/${slug}/`,{
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('access_token')}` 
                }
            });

            console.log(response.data);
            
            return response.data;
        } catch (error) {
            console.error("Error fetching blog post:", error);
            throw error;
        }
    },
  async getFeaturedPosts() {
        try {
            const response = await api.get(`/blog/blogs/featured/`);
            return response.data;
        } catch (error) {
            console.error("Error fetching blog posts:", error);
            throw error;
        }
    },


    async getStats() {
        try{
            const response = await api.get("/blog/stats/");
            return response.data;
        } catch (error) {
            console.error("Error fetching stats:", error);
            throw error;
        }
    },


  async searchBlogPosts (query) {
    try {
      const response = await api.get(`${API_URL}/?search=${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching blog posts:', error);
      throw error;
    }
  },


  async getBlogsByCategory(categoryId) {
    try {
      const response = await api.get(`${API_URL}/?category=${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs by category:', error);
      throw error;
    }
  },


  async getBlogsByTag(tagId) {
    try {
      const response = await api.get(`${API_URL}/?tag=${tagId}`,{
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('access_token')}` 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs by tag:', error);
      throw error;
    }
  },
};