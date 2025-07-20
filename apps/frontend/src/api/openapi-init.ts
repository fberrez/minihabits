import { OpenAPI } from "./generated";

// Initialize the OpenAPI client with the base URL from environment variables
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Configure the OpenAPI client
OpenAPI.BASE = apiBaseUrl || "";
OpenAPI.WITH_CREDENTIALS = true; // Include cookies in requests
OpenAPI.CREDENTIALS = "include"; // Include cookies in cross-origin requests

// Export the initialized OpenAPI client
export { OpenAPI };
