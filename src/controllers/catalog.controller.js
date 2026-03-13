export default class CatalogController {
  constructor({ catalogService }) {
    this._catalogService = catalogService;

    this.generate = this.generate.bind(this);
    this.catalogTempHtml = this.catalogTempHtml.bind(this);
  }

  async generate(req, res) {
    const response = await this._catalogService.generate(req.body);
    return res.status(response.status).send(response);
  }

  async catalogTempHtml(req, res) {
    const response = await this._catalogService.catalogTempHtml(req);
    return res.status(response.status).header('Content-Type', 'text/html').send(response.data.html);
  }
}
