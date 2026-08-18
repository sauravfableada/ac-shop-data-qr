class ApiClient {
    constructor() {
        this.baseUrl = '/api';
    }

    getToken() {
        return localStorage.getItem('auth_token');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Accept': 'application/json',
            ...options.headers
        };

        // Only set Content-Type to JSON if it's not FormData
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (response.status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('auth_token');
                window.router.navigate('/login');
                return { success: false, message: 'Session expired' };
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        const isFormData = data instanceof FormData;
        return this.request(endpoint, {
            method: 'POST',
            body: isFormData ? data : JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        const isFormData = data instanceof FormData;
        
        if (isFormData) {
            data.append('_method', 'PUT');
            return this.request(endpoint, {
                method: 'POST', // Laravel uses POST with _method=PUT for multipart forms
                body: data
            });
        }
        
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// Global instance
window.api = new ApiClient();
