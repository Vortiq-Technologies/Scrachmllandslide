/**
 * GeoJSON and Spatial calculation utilities
 */
const geoUtils = {
  /**
   * Validate [longitude, latitude] coordinates
   * Longitude: [-180, 180], Latitude: [-90, 90]
   */
  isValidCoordinate(longitude, latitude) {
    return (
      typeof longitude === 'number' &&
      typeof latitude === 'number' &&
      longitude >= -180 &&
      longitude <= 180 &&
      latitude >= -90 &&
      latitude <= 90
    );
  },

  /**
   * Format GeoJSON Point object
   */
  toGeoJsonPoint(longitude, latitude) {
    if (!this.isValidCoordinate(longitude, latitude)) {
      throw new Error(`Invalid coordinates: lon=${longitude}, lat=${latitude}`);
    }
    return {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
  },

  /**
   * Convert list of records with GeoJSON geometry to a standard GeoJSON FeatureCollection
   */
  toFeatureCollection(records, geometryField = 'location', idField = '_id') {
    const features = records.map((record) => {
      const doc = record.toObject ? record.toObject() : record;
      const geometry = doc[geometryField];
      const properties = { ...doc };
      delete properties[geometryField];

      return {
        type: 'Feature',
        id: doc[idField] || doc.id,
        geometry: geometry || null,
        properties,
      };
    });

    return {
      type: 'FeatureCollection',
      features,
    };
  },

  /**
   * Haversine formula to compute great-circle distance in meters between two [lon, lat] pairs
   */
  haversineDistance(lon1, lat1, lon2, lat2) {
    const R = 6371000; // Earth radius in meters
    const toRad = (x) => (x * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },
};

module.exports = geoUtils;
