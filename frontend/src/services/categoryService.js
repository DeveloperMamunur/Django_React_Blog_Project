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

    async getAllCategories(page = 1, pageSize = 6, search = "") {
        try {
            const params = new URLSearchParams({ page, page_size: pageSize });
            if (search.trim()) params.append("search", search.trim());

            const response = await api.get(`/blog/categories/?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
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
    },
    async getCategoriesNoPagination() {
        try {
            const response = await api.get(`/blog/categories/all/`, {
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
}

