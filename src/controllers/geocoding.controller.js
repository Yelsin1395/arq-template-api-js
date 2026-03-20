export default class GeocodingController {
  constructor({ geocodingService }) {
    this._geocodingService = geocodingService;

    this.processGeolocation = this.processGeolocation.bind(this);
  }

  async processGeolocation(req, res) {
    const data = await this._geocodingService.processGeolocation(req.body);
    return res.status(data.status).send(data);
  }
}
