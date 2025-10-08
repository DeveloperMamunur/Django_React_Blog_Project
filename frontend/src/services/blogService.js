import api from "./api";

export const blogService = {
    async createBlog(formData) {
        try {
            const response = await api.post("/blog/blogs/", formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error creating blog post:", error);
            throw error;
        }
    },

    async getAllBlogs(page = 1, filters = {}) {
        try {
            const params = new URLSearchParams({ page });

            if (filters.search) params.append("search", filters.search);
            if (filters.category_id && filters.category_id !== 0) {
                params.append("category_id", filters.category_id);
            }

            const response = await api.get(`/blog/blogs/?${params.toString()}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching blog posts:", error);
            throw error;
        }
    },

    async updateBlog(id, formData) {
        try {
            const response = await api.put(`/blog/blogs/${id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error updating blog post:", error.response?.data || error);
            throw error;
        }
    },

    async deleteBlog(id) {
        try {
            await api.delete(`/blog/blogs/${id}/`,{
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
        } catch (error) {
            console.error("Error deleting blog post:", error);
            throw error;
        }
    },

    async togglePublish(id, data){
        try {
            await api.patch(`/blog/blogs/${id}/publish/`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })
        } catch (error){
            console.log(error);
        }
    },
    async toggleFeatured(id, data) {
        try {
            await api.patch(`/blog/blogs/${id}/`, data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
        } catch (error) {
            console.log(error);
        }
    },
    async toggleStatus(id, data) {
        try {
            await api.patch(`/blog/blogs/${id}/`, data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
        } catch (error) {
            console.log(error);
        }
    },


};
