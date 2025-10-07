import api from "./api";

export const commentService = {
    async getComments(blogId) {
        try {
            const response = await api.get(`/blog/blogs/${blogId}/comments/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching comments:", error);
            throw error;
        }
    },

    // Create a new comment - FIXED
    async createComments(blogId, content) {
        try {
            const response = await api.post(
                `/blog/blogs/${blogId}/comments/`,
                { content, blog: blogId },
                { 
                    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } 
                }
            );

            return response.data;
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error;
        }
    },

}