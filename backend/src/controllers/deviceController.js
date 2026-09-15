const deviceService = require('../services/deviceService');
const ApiResponse = require('../utils/apiResponse');

class DeviceController {
  async registerDevice(req, res, next) {
    try {
      const device = await deviceService.registerDevice(req.body);
      return ApiResponse.created(res, device, 'Device registered successfully');
    } catch (error) {
      next(error);
    }
  }

  async listDevices(req, res, next) {
    try {
      const { page = 1, limit = 20, status, zoneId } = req.query;
      const result = await deviceService.listDevices({ status, zoneId }, Number(page), Number(limit));
      return ApiResponse.paginated(
        res,
        result.devices,
        result.page,
        result.limit,
        result.total,
        'Devices retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  async getDeviceById(req, res, next) {
    try {
      const device = await deviceService.getDeviceById(req.params.id);
      return ApiResponse.success(res, device, 'Device retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateDevice(req, res, next) {
    try {
      const device = await deviceService.updateDevice(req.params.id, req.body);
      return ApiResponse.success(res, device, 'Device updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteDevice(req, res, next) {
    try {
      const result = await deviceService.deleteDevice(req.params.id);
      return ApiResponse.success(res, result, 'Device deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getHealthSummary(req, res, next) {
    try {
      const health = await deviceService.getDeviceHealthSummary();
      return ApiResponse.success(res, health, 'Device network health summary retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DeviceController();
