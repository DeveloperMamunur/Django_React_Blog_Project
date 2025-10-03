import api from "./api";

export const tagService = {
    async createTag(tagData){
        try {
            const response = await api.post("/blog/tags/", tagData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error creating tag:", error);
            throw error;
        }
    },

    async getAllTags(page=1) {
        try {
            const response = await api.get(`/blog/tags/?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching tags:", error);
            throw error;
        }
    },

    async updateTag(id, tagData){
        try {
            const response = await api.put(`/blog/tags/${id}/`, tagData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error updating tag:", error);
            throw error;
        }
    },

    async deleteTag(id){
        try {
            await api.delete(`/blog/tags/${id}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
        } catch (error) {
            console.error("Error deleting tag:", error);
            throw error;
        }
    }, 
    async toggleStatus(id, data){
        try {
            await api.delete(`/blog/tags/${id}/`,data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
        } catch (error) {
            console.error("Error deleting tag:", error);
            throw error;
        }
    }, 
    async getAllTagsNoPagination() {
        try {
            const response = await api.get(`/blog/tags/all/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching tags:", error);
            throw error;
        }
    },
}


export default api;