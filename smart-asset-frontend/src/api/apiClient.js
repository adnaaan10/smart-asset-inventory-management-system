import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});


apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token")

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Access token expired
        if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
        ) {
        originalRequest._retry = true;

        try {
            const refresh = localStorage.getItem("refresh_token");

            const response = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            { refresh }
            );

            // Save new access token
            localStorage.setItem("access_token", response.data.access);

            // Retry original request
            originalRequest.headers.Authorization =
            `Bearer ${response.data.access}`;

            return apiClient(originalRequest);
        } catch (refreshError) {
            // Refresh token expired → force logout
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject(refreshError);
        }
        }

        return Promise.reject(error);
    }
);

export default apiClient;