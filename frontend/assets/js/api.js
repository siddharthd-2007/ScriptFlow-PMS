const API_BASE_URL = "http://127.0.0.1:8000";

async function apiRequest(endpoint, method = "GET", body = null) {

    const token = localStorage.getItem("access_token");

    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(
        API_BASE_URL + endpoint,
        options
    );

    const data = await response.json();

    if (!response.ok) {

        console.error("Backend Response:", data);

        throw new Error(JSON.stringify(data));

    }

    return data;
}