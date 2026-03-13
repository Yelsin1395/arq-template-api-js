export default class CatalogRepository {
  constructor({ catalogModel }) {
    this._catalogModel = catalogModel;
  }

  async getBySessionId(sessionId) {
    return this._catalogModel.findOne({ sessionId, isExpired: false });
  }

  async create(input) {
    await this._catalogModel.create(input);
  }

  async markAsExpired(id) {
    await this._catalogModel.updateOne({ _id: id }, { isExpired: true });
  }
}
