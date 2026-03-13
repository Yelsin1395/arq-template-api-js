import { readFileSync } from 'fs';
import path from 'path';
import { limaTimestamp } from '../utils/transform.util';

export default class CatalogService {
  constructor({ config, catalogRepository }) {
    this._config = config;
    this._catalogRepository = catalogRepository;
  }

  _readTemplate(filename) {
    const route = path.join(process.cwd(), 'assets', 'templates', filename);
    return readFileSync(route, 'utf-8');
  }

  _replacePlaceholders(html, values = {}) {
    return Object.entries(values).reduce((acc, [key, value]) => {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      return acc.replace(regex, String(value));
    }, html);
  }

  _isExpired(createdAt) {
    const createdMs = new Date(createdAt).getTime();
    return Date.now() - createdMs > this._config.CATALOG_TTL_MS;
  }

  _getExpireInMin() {
    return this._config.CATALOG_TTL_MS / (60 * 1000);
  }

  injectEntriesData(html, values) {
    const safeJson = JSON.stringify(values, null, 0).replace(/<\/script>/gi, '<\\/script>');
    const regex = /const storeData\s*=\s*\[[\s\S]*?\];/;

    return html.replace(regex, `const storeData = ${safeJson};`);
  }

  async generate(req) {
    const catalog = await this._catalogRepository.getBySessionId(req.sessionId);

    if (catalog) {
      await this._catalogRepository.markAsExpired(catalog._id);
    }

    const contentHtml = this._readTemplate('caserita-order-flow-template.html');
    const htmlTemp = this.injectEntriesData(contentHtml, req.marketEntries);
    const htmlBase64 = Buffer.from(htmlTemp, 'utf8').toString('base64');
    const urlGenerate = `/catalog/view-temp?sessionId=${req.sessionId}`;

    await this._catalogRepository.create({
      sessionId: req.sessionId,
      htmlBase64,
    });

    return {
      status: 201,
      data: {
        urlCatalogTemp: urlGenerate,
        expireInMin: this._getExpireInMin(),
        timestamp: limaTimestamp(),
      },
    };
  }

  async catalogTempHtml(req) {
    const { sessionId } = req.query;

    const catalog = await this._catalogRepository.getBySessionId(sessionId);

    if (!catalog) {
      const notFoundHtml = this._readTemplate('caserita-not-found-order-flow-template.html');

      return {
        status: 200,
        data: { html: notFoundHtml },
      };
    }

    const expired = catalog.isExpired || this._isExpired(catalog.createdAt);

    if (expired) {
      if (!catalog.isExpired) {
        await this._catalogRepository.markAsExpired(catalog._id);
      }

      const expiredHtml = this._readTemplate('caserita-expired-order-flow-template.html');

      return {
        status: 200,
        data: { html: this._replacePlaceholders(expiredHtml, { expireInMin: this._getExpireInMin() }) },
      };
    }

    const html = Buffer.from(catalog.htmlBase64, 'base64').toString('utf-8');

    return {
      status: 200,
      data: { html },
    };
  }
}
