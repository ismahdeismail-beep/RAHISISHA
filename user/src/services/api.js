const API_BASE = '/v1';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('rahisisha_token');
  }

  setToken(token) {
    this.token = token;
    if (token) localStorage.setItem('rahisisha_token', token);
    else localStorage.removeItem('rahisisha_token');
  }

  getToken() { return this.token; }
  isAuthenticated() { return !!this.token; }

  async request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || json.error || 'Request failed');
      return json;
    } catch (err) {
      if (err.message === 'Failed to fetch') throw new Error('Network error — backend unavailable');
      throw err;
    }
  }

  get(path)       { return this.request('GET', path); }
  post(path, b)   { return this.request('POST', path, b); }
  put(path, b)    { return this.request('PUT', path, b); }
  del(path)       { return this.request('DELETE', path); }

  // ─── Auth ───
  async login(email, password) {
    const res = await this.post('/auth/login', { email, password });
    this.setToken(res.data.token);
    return res.data;
  }

  async register(data) {
    const res = await this.post('/auth/register', data);
    return res.data;
  }

  async getProfile() {
    const res = await this.get('/auth/me');
    return res.data;
  }

  logout() { this.setToken(null); }

  // ─── Wallet ───
  async getBalance(currency = 'USD') {
    const res = await this.get(`/wallet/balance?currency=${currency}`);
    return res.data;
  }

  async transfer(toUserId, amount, currency = 'USD', reference = '') {
    const res = await this.post('/wallet/transfer', { toUserId, amount, currency, reference });
    return res.data;
  }

  // ─── Payments ───
  async processPayment(data) {
    const res = await this.post('/payments', data);
    return res.data;
  }

  async getTransactionStatus(id, provider = 'mpesa') {
    const res = await this.get(`/payments/${id}/status?provider=${provider}`);
    return res.data;
  }

  // ─── Analytics ───
  async getDashboardStats() {
    const res = await this.get('/analytics/dashboard');
    return res.data;
  }
}

const api = new ApiClient();
export default api;