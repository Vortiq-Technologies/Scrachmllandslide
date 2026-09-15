/**
 * Standardized API response format for all Web & Mobile clients
 */
class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200, meta = null) {
    const payload = {
      success: true,
      statusCode,
      message,
      data,
    };

    if (meta) {
      payload.meta = meta;
    }

    return res.status(statusCode).json(payload);
  }

  static created(res, data = null, message = 'Resource created successfully', meta = null) {
    return this.success(res, data, message, 201, meta);
  }

  static paginated(res, items = [], page = 1, limit = 20, total = 0, message = 'Items retrieved successfully') {
    const totalPages = Math.ceil(total / limit) || 1;
    const meta = {
      page: Number(page),
      limit: Number(limit),
      total: Number(total),
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return this.success(res, items, message, 200, meta);
  }
}

module.exports = ApiResponse;
