const Device = require('../models/Device');
const ApiError = require('../utils/apiError');

class DeviceService {
  async registerDevice(data) {
    const existing = await Device.findOne({ deviceId: data.deviceId.toUpperCase() });
    if (existing) {
      throw ApiError.conflict(`Device with ID '${data.deviceId}' already exists`);
    }

    const device = await Device.create({
      ...data,
      deviceId: data.deviceId.toUpperCase(),
    });

    return device;
  }

  async listDevices(filters = {}, page = 1, limit = 20) {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.zoneId) query.zoneId = filters.zoneId;

    const skip = (page - 1) * limit;

    const [devices, total] = await Promise.all([
      Device.find(query).populate('zoneId', 'name code currentRiskLevel').skip(skip).limit(limit).lean(),
      Device.countDocuments(query),
    ]);

    return { devices, total, page, limit };
  }

  async getDeviceById(id) {
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { deviceId: id.toUpperCase() };

    const device = await Device.findOne(query).populate('zoneId', 'name code currentRiskLevel');
    if (!device) {
      throw ApiError.notFound(`Device with identifier '${id}' not found`);
    }
    return device;
  }

  async updateDevice(id, updateData) {
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { deviceId: id.toUpperCase() };

    const device = await Device.findOneAndUpdate(query, updateData, {
      new: true,
      runValidators: true,
    });

    if (!device) {
      throw ApiError.notFound(`Device with identifier '${id}' not found`);
    }
    return device;
  }

  async deleteDevice(id) {
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { deviceId: id.toUpperCase() };
    const device = await Device.findOneAndDelete(query);
    if (!device) {
      throw ApiError.notFound(`Device with identifier '${id}' not found`);
    }
    return { message: 'Device deleted successfully' };
  }

  async getDeviceHealthSummary() {
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    const [total, active, offline, maintenance, lowBattery] = await Promise.all([
      Device.countDocuments(),
      Device.countDocuments({ status: 'ACTIVE', lastSeenAt: { $gte: tenMinutesAgo } }),
      Device.countDocuments({ $or: [{ status: 'OFFLINE' }, { lastSeenAt: { $lt: tenMinutesAgo } }] }),
      Device.countDocuments({ status: 'MAINTENANCE' }),
      Device.find({ batteryPct: { $lt: 20 } }).select('deviceId name batteryPct lastSeenAt status'),
    ]);

    return {
      total,
      active,
      offline,
      maintenance,
      lowBatteryCount: lowBattery.length,
      lowBatteryDevices: lowBattery,
    };
  }
}

module.exports = new DeviceService();
