import { buildCoordinates, extractCoordsFromGoogleMapUrl } from '../utils/transform.util';
import { mapToSession } from '../utils/mapper.util';
import { HttpStatusCode } from 'axios';

const ERROR_MESSAGE_RESPONSE =
  'Ups, tenemos problemas con la api de google maps, crees que me puedes brindar la URL  de la ubicación a donde se enviará el pedido google maps';

export default class GeocodingService {
  constructor({ googleMapsProxy, urlResolverProxy }) {
    this._googleMapsProxy = googleMapsProxy;
    this._urlResolverProxy = urlResolverProxy;
  }

  async processGeolocation(rawRequest) {
    const session = mapToSession(rawRequest);
    const { geolocation } = session.user;

    if (geolocation.isConfirmed && geolocation.coordenates?.length) return session;

    if (geolocation.urlMapsRequest) {
      const { resolvedUrl } = await this._urlResolverProxy.resolveUrlGoogleMaps(geolocation.urlMapsRequest);

      if (resolvedUrl) {
        const manualCoords = extractCoordsFromGoogleMapUrl(resolvedUrl);
        if (manualCoords) {
          return this._updateSessionSuccess(session, manualCoords, false);
        }
      }
    }

    return this._requestGeocoding(session);
  }

  async _requestGeocoding(session) {
    const { address } = session.user.geolocation;

    try {
      const response = await this._googleMapsProxy.getGeocodeByAddress(address);

      if (this._isValidResponse(response)) {
        const [result] = response.results;

        const { location } = result.geometry;
        const placeId = result.place_id;

        const coords = buildCoordinates(location.lat, location.lng);
        const mapUrl = `http://maps.google.com/?q=${location.lat},${location.lng}&query_place_id=${placeId}`;

        return this._updateSessionSuccess(session, coords, false, mapUrl);
      }

      return this._handleGeocodingError(session);
    } catch (error) {
      console.error(`[Geocoding API Error]: ${error.message}`);
      return this._handleGeocodingError(session);
    }
  }

  _isValidResponse(response) {
    return response?.status === 'OK' && response.results?.length > 0;
  }

  _updateSessionSuccess(session, coordenates, isConfirmed, url = null) {
    session.status = HttpStatusCode.Ok;
    session.user.geolocation.urlMapsResponse = url ? url : null;
    session.user.geolocation.coordenates = coordenates;
    session.user.geolocation.isConfirmed = isConfirmed;
    session.isError = false;

    return session;
  }

  _handleGeocodingError(session) {
    session.status = HttpStatusCode.BadRequest;
    session.user.geolocation.coordenates = null;
    session.user.geolocation.urlMapsResponse = null;
    session.user.geolocation.isConfirmed = false;
    session.isError = true;
    session.agentResponse = ERROR_MESSAGE_RESPONSE;
    return session;
  }
}
