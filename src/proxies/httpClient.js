import axios from 'axios';
import AppError from '../utils/appError.util';

export default class HttpClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async get(url, config = {}) {
    try {
      const res = await this.client.get(url, config);
      return res.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async post(url, data = {}, config = {}) {
    try {
      const res = await this.client.post(url, data, config);
      return res.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async put(url, data = {}, config = {}) {
    try {
      const res = await this.client.put(url, data, config);
      return res.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async patch(url, data = {}, config = {}) {
    try {
      const res = await this.client.patch(url, data, config);
      return res.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  async delete(url, config = {}) {
    try {
      const res = await this.client.delete(url, config);
      return res.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  _handleError(error) {
    if (error.response) {
      throw new AppError(error.response.status, null, error.response.data.message);
    } else if (error.request) {
      throw new AppError(503, null, 'External service not available');
    } else {
      throw new AppError(500, null, error.message);
    }
  }
}
