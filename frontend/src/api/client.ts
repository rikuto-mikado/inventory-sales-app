// Base API client: provides a generic GET helper with error handling.
export const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function apiGet<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`)
    if (!response.ok) {
        throw new Error(`Failed to fetch API data: ${response.status}`)
    }
    return response.json() as Promise<T>
}