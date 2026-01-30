const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Request failed");
    }

    return response.json();
}

export const api = {
    get: (endpoint) => request(endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }),
    post: (endpoint, data) => {
        const isFormData = data instanceof FormData;
        return request(endpoint, {
            method: "POST",
            body: isFormData ? data : JSON.stringify(data),
            headers: isFormData ? {} : { "Content-Type": "application/json" }
        });
    },
    patch: (endpoint, data) => request(endpoint, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    }),
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    }
};
