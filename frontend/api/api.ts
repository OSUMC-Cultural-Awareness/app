import { API_URL } from "../constants";

/**
 * An ApiError returned from an {@link Api} method.
 */
export class ApiError extends Error {
  /**
   * constructor for ApiError.
   *
   * @param {string} reason
   * @param {number} statusCode
   */
  constructor(public reason: string, public statusCode: number) {
    super(reason);
  }
}

/**
 * @internal
 */
export class Api {
  /**
   * Perform a GET request on the API.
   *
   * @throws {@link ApiError}
   *
   * @param {string} endpoint  after `http://localhost:5000/v1/`
   * @returns {Promise<any>} JSON
   */
  static async get(endpoint: string): Promise<any> {
    const response = await fetch(`${API_URL}${encodeURI(endpoint)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    let json = await response.json();
    if (!response.ok) {
      throw new ApiError(json["msg"], response.status);
    }

    return json;
  }

  /**
   * Perform a GET request on the API with authorization.
   *
   * @throws {@link ApiError}
   *
   * @param {string} endpoint  after `http://localhost:5000/v1/`
   * @param {string} token  JSON Web Token
   * @returns {Promise<any>} JSON
   */
  static async getAuth(endpoint: string, token: string): Promise<any> {
    const response = await fetch(`${API_URL}${encodeURI(endpoint)}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let json = await response.json();
    if (!response.ok) {
      throw new ApiError(json["msg"], response.status);
    }

    return json;
  }

  /**
   * Perform a PUT request on the API.
   *
   * @throws {@link ApiError}
   *
   * @param {string} endpoint  after `http://localhost:5000/v1/`
   * @param {Object} body  JSON payload
   * @param {string} token  JSON Web Token
   * @returns {Promise<any>} JSON
   */
  static async put(endpoint: string, body: {}, token: string): Promise<any> {
    const response = await fetch(`${API_URL}${encodeURI(endpoint)}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    let json = await response.json();
    if (!response.ok) {
      throw new ApiError(json["msg"], response.status);
    }

    return json;
  }

  /**
   * Perform a DELETE request on the API.
   *
   * @throws {@link ApiError}
   *
   * @param {string} endpoint  after `http://localhost:5000/v1/`
   * @param {string} token  JSON Web Token
   * @returns {Promise<any>} JSON
   */
  static async delete(endpoint: string, token: string): Promise<any> {
    const response = await fetch(`${API_URL}${encodeURI(endpoint)}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let json = await response.json();
    if (!response.ok) {
      throw new ApiError(json["msg"], response.status);
    }

    return json;
  }

  /**
   * Perform a POST request on the API.
   *
   * @throws {@link ApiError}
   *
   * @param {string} endpoint  after `http://localhost:5000/v1/`
   * @param {Object} body  Request Body
   * @param {string} auth  JSON Web Token
   * @returns {Promise<any>} JSON
   */
  static async post(endpoint: string, body: {}, token?: string): Promise<any> {
    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (token !== undefined) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${encodeURI(endpoint)}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    let json = await response.json();
    if (!response.ok) {
      throw new ApiError(json["msg"], response.status);
    }

    return json;
  }
}
