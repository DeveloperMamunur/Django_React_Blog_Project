import api, { getAccessToken } from "./api"

export const authService = {
    async login(credentials) {
        try {
            const response = await api.post('/auth/login/', {
            username: credentials.username,
            password: credentials.password
        });
        return {
            token: response.data.access,
            refresh: response.data.refresh,
            user: {
                id: response.data.user_id,
                username: response.data.username,
            }
        }
        } catch (error) {
            throw new Error(
                error.response?.data?.error ||
                error.response?.data?.detail ||
                'Login failed'
            );
        }
    },

    async register(userData) {
        try {
            await api.post('/auth/register/', {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                role: userData.role
            });
            return this.login({
                username: userData.username,
                password: userData.password
            });
        } catch (error) {
            throw new Error(error.response?.data?.error ||'Registration failed. Please check your information and try again.');
        }
    },

    async getCurrentUser() {
        try {
            const token = getAccessToken();
            if (!token) throw new Error("No access token");
            const response = await api.get('/auth/protected/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            
            return response.data.user || response.data;
        } catch (error) {
            console.log(error);
            
        }
    },
    async updateAvatar(id, file){
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await api.patch(`/auth/users/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating avatar:', error);
            throw error;
        }
    },

    async updateCurrentUserInfo(id, data){
        try {
            const response = await api.put(`/auth/users/${id}/`, data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            return response.data;
        } catch (error) {
            console.log("Update error:", error.response?.data || error.message);
            throw error;
        }
    },
    
    async changePassword(data) {
        try {
            const response = await api.put("/auth/change-password/", data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.detail || "Password change failed"
            );
        }
    }
}

export default api;