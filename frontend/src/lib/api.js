const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Request failed");
    }

    return response.json();
}

export const api = {
    get: (endpoint) => request(endpoint, { method: "GET" }),
    post: (endpoint, data) => request(endpoint, { method: "POST", body: JSON.stringify(data) }),
    patch: (endpoint, data) => request(endpoint, { method: "PATCH", body: JSON.stringify(data) }),
};
