import axios from 'axios';

export default class UrlResolverProxy {
  async resolveUrlGoogleMaps(url) {
    const res = await axios.get(url);
    const resolvedUrl = res.request?.res?.responseUrl ?? response.config?.url ?? null;
    return { resolvedUrl };
  }
}
