const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

if (!BASE_URL && typeof window !== 'undefined') {
    console.error("CRITICAL: NEXT_PUBLIC_BACKEND_BASE_URL is not defined in environment variables. API requests will fail.");
}

async function request(endpoint, options = {}) {
    if (!BASE_URL) {
        throw new Error("Backend API URL is not configured.");
    }

    // Ensure BASE_URL doesn't end with a slash and endpoint starts with one
    const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;

    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            if (response.status === 401 && typeof window !== 'undefined') {
                console.warn("Session expired or unauthorized. Logging out...");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('resumeId');
                localStorage.removeItem('pathId');
                window.location.href = '/login?expired=true';
            }
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Request failed");
        }

        return await response.json();
    } catch (networkError) {
        if (networkError.message === "Request failed") throw networkError;

        console.error(`API Connection Error (${url}):`, networkError.message);
        throw new Error("Unable to connect to the server. Please check your internet connection or if the backend is running.");
    }
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
            localStorage.removeItem('resumeId');
            localStorage.removeItem('pathId');
            window.location.href = '/login';
        }
    }
};
