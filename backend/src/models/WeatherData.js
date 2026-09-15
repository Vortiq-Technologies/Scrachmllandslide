const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema(
  {
    riskZoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskZone',
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (val) {
            return (
              Array.isArray(val) &&
              val.length === 2 &&
              val[0] >= -180 &&
              val[0] <= 180 &&
              val[1] >= -90 &&
              val[1] <= 90
            );
          },
          message: 'Invalid GeoJSON coordinates: [longitude (-180 to 180), latitude (-90 to 90)]',
        },
      },
    },
    timestamp: {
      type: Date,
      required: [true, 'Weather timestamp is required'],
      default: Date.now,
      index: true,
    },
    isForecast: {
      type: Boolean,
      default: false,
      index: true,
    },
    forecastFor: {
      type: Date,
      index: true,
    },
    source: {
      type: String,
      required: [true, 'Data source / provenance is required'],
      trim: true,
      index: true,
    },
    metrics: {
      rainfallLast1hMm: { type: Number, min: 0 },
      rainfallLast24hMm: { type: Number, min: 0 },
      rainfallForecast24hMm: { type: Number, min: 0 },
      temperatureC: { type: Number },
      humidityPct: { type: Number, min: 0, max: 100 },
      windSpeedKmh: { type: Number, min: 0 },
      pressureHpa: { type: Number },
      condition: { type: String, trim: true },
    },
    rawResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    collection: 'weather_data',
  }
);

weatherDataSchema.index({ location: '2dsphere' });
weatherDataSchema.index({ riskZoneId: 1, timestamp: -1 });

const WeatherData = mongoose.model('WeatherData', weatherDataSchema);

module.exports = WeatherData;
