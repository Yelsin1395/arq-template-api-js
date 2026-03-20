export default class GoogleMapsProxy {
  constructor({ config, HttpClient }) {
    this._config = config;
    this.apiKey = this._config.GOOGLE_MAPS_API_KEY;
    this.http = new HttpClient(this._config.GOOGLE_MAPS_API_URL);
  }

  async getGeocodeByAddress(address) {
    const res = await this.http.get(`/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`);
  
    return res;
  }
}
