import api from "./api";

export const categoryService = {

    async createCategory(categoryData){
        try {
            const response = await api.post("/blog/categories/", categoryData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error creating category:", error);
            throw error;
        }
    },

    async getAllCategories() {
        try {
            const response = await api.get("/blog/categories/", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    },

    async updateCategory(id, categoryData){
        try {
            const response = await api.put(`/blog/categories/${id}/`, categoryData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error updating category:", error);
            throw error;
        }
    },

    async deleteCategory(id){
        try {
            await api.delete(`/blog/categories/${id}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
        } catch (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    },

    async toggleStatus(id, data) {
        try {
            const response = await api.patch(`/blog/categories/${id}/`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error toggling category status:", error);
            throw error;
        }
    }
}

