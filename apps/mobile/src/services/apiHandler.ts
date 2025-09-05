// import {ApiError} from './apiErrors';
//
// /**
//  * A self-executing function that retrieves and validates the API base URL.
//  * This implements a "fail-fast" strategy. If the URL is not configured,
//  * the application will fail on module load, which is the desired behavior.
//  * This pattern also ensures TypeScript correctly infers the type as `string`.
//  * @returns {string} The validated base URL.
//  */
// const API_BASE_URL = ((): string => {
//     const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
//     if (!baseUrl) {
//         throw new Error(
//             'API base URL is not configured. Please check your environment variables.',
//         );
//     }
//     return baseUrl;
// })();
//
// /**
//  * Handles the fetch API response, throwing an ApiError on failure.
//  * This function is internal to the module and serves as a response interceptor.
//  * @param {Response} response - The raw response object from a fetch call.
//  * @returns {Promise<T>} A promise that resolves with the parsed JSON data if the response is successful.
//  * @throws {ApiError} Throws an `ApiError` if the response is not `ok`.
//  */
// async function handleResponse<T>(response: Response): Promise<T> {
//     const responseText = await response.text();
//     let data;
//
//     try {
//         // Attempt to parse JSON, but handle cases where the body is empty.
//         data = responseText ? JSON.parse(responseText) : {};
//     } catch (error) {
//         // If JSON parsing fails, the response is fundamentally broken.
//         // For a failed request (`!ok`), we'll use the text as the error message.
//         // For a successful request (`ok`), this is an unexpected server error.
//         if (response.ok) {
//             throw new ApiError(
//                 `Failed to parse JSON on a successful response: ${responseText}`,
//                 response.status,
//             );
//         }
//         // For a non-ok response, create a data object with the raw text to be handled below.
//         data = { message: responseText || `Error with status: ${response.status}` };
//     }
//
//     if (!response.ok) {
//         const message =
//             data?.message || `Request failed with status ${response.status}`;
//         throw new ApiError(message, response.status);
//     }
//
//     return data;
// }
//
// /**
//  * A static class that centralizes all API calls for the application.
//  * It handles base URL, authentication headers, and standard HTTP methods.
//  */
// export class ApiHandler {
//     /** The authentication token, stored statically. */
//     private static authToken: string | null = null;
//
//     /**
//      * Sets or clears the authentication token for subsequent API requests.
//      * This method is typically called from the auth store upon login or logout.
//      * @param {string | null} token - The JWT token or null to clear it.
//      */
//     public static setAuthToken(token: string | null): void {
//         this.authToken = token;
//     }
//
//     /**
//      * A private, generic request method that centralizes fetch logic.
//      * It constructs the full URL, adds default headers (like 'Content-Type'),
//      * and includes the 'Authorization' header if a token is present.
//      * @param {string} endpoint - The API endpoint to call (e.g., '/users').
//      * @param {RequestInit} options - The standard `fetch` options (method, body, etc.).
//      * @returns {Promise<TResponse>} A promise that resolves with the response data.
//      */
//     private static async request<TResponse>(
//         endpoint: string,
//         options: RequestInit,
//     ): Promise<TResponse> {
//         const token = this.authToken;
//
//         const defaultHeaders: HeadersInit = {
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//         };
//
//         if (token) {
//             defaultHeaders['Authorization'] = `Bearer ${token}`;
//         }
//
//         const config: RequestInit = {
//             ...options,
//             headers: {
//                 ...defaultHeaders,
//                 ...options.headers, // Allows overriding or adding headers if necessary.
//             },
//         };
//
//         // Ensure no double slashes between base URL and endpoint
//         const response = await fetch(
//             `${API_BASE_URL.replace(/\/$/, '')}${endpoint}`,
//             config,
//         );
//         return handleResponse<TResponse>(response);
//     }
//
//     /**
//      * Performs a POST request.
//      * @template TRequest The type of the request body.
//      * @template TResponse The expected type of the response data.
//      * @param {string} endpoint - The API endpoint.
//      * @param {TRequest} body - The request payload.
//      * @returns {Promise<TResponse>} A promise that resolves with the response data.
//      */
//     static post<TRequest, TResponse>(
//         endpoint: string,
//         body: TRequest,
//     ): Promise<TResponse> {
//         return this.request<TResponse>(endpoint, {
//             method: 'POST',
//             body: JSON.stringify(body),
//         });
//     }
//
//     /**
//      * Performs a GET request.
//      * @template TResponse The expected type of the response data.
//      * @param {string} endpoint - The API endpoint.
//      * @returns {Promise<TResponse>} A promise that resolves with the response data.
//      */
//     static get<TResponse>(endpoint: string): Promise<TResponse> {
//         return this.request<TResponse>(endpoint, {method: 'GET'});
//     }
//
//     /**
//      * Performs a PUT request.
//      * @template TRequest The type of the request body.
//      * @template TResponse The expected type of the response data.
//      * @param {string} endpoint - The API endpoint.
//      * @param {TRequest} body - The request payload.
//      * @returns {Promise<TResponse>} A promise that resolves with the response data.
//      */
//     static put<TRequest, TResponse>(
//         endpoint: string,
//         body: TRequest,
//     ): Promise<TResponse> {
//         return this.request<TResponse>(endpoint, {
//             method: 'PUT',
//             body: JSON.stringify(body),
//         });
//     }
//
//     /**
//      * Performs a DELETE request.
//      * @template TResponse The expected type of the response data.
//      * @param {string} endpoint - The API endpoint.
//      * @returns {Promise<TResponse>} A promise that resolves with the response data.
//      */
//     static delete<TResponse>(endpoint: string): Promise<TResponse> {
//         return this.request<TResponse>(endpoint, {
//             method: 'DELETE',
//         });
//     }
// }
