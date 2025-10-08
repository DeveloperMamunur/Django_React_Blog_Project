import api from "./api";


export const userService = {
    async getAllUser(page=1, filters={}) {
        try {
            const params = new URLSearchParams({ page });

            if (filters.search) params.append("search", filters.search);
            if (filters.role && filters.role !== "ALL") {
                params.append("role", filters.role);
            }

            const response = await api.get(`/auth/users/?${params.toString()}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching Users:", error);
            throw error;
        }
    },

    async getUserDetails(id){
        try {
            const response = await api.get(`/auth/users/${id}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching user Details:", error);
            throw error;
        }
    },

    async toggleStatus(id, data){
        try {
            const response = await api.patch(`/auth/users/${id}/`, data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching User Status:", error);
            throw error;
        }
    },
}