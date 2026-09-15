const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const validate = require('../middleware/validateMiddleware');
const {
  createReportSchema,
  verifyReportSchema,
  reportQuerySchema,
} = require('../validators/reportValidator');
const { authenticate } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.get('/stats/summary', authenticate, (req, res, next) =>
  reportController.getStatistics(req, res, next)
);

// Optional authentication on submit: citizens can submit anonymously or logged in
router.post(
  '/',
  (req, res, next) => {
    // Soft auth if token present
    if (req.headers.authorization) {
      return authenticate(req, res, next);
    }
    next();
  },
  validate(createReportSchema),
  (req, res, next) => reportController.createReport(req, res, next)
);

router.get(
  '/',
  validate(reportQuerySchema, 'query'),
  (req, res, next) => reportController.listReports(req, res, next)
);

router.get('/:id', (req, res, next) => reportController.getReportById(req, res, next));

router.patch(
  '/:id/verify',
  authenticate,
  authorizeRoles('admin', 'analyst', 'field_officer'),
  validate(verifyReportSchema),
  (req, res, next) => reportController.verifyReport(req, res, next)
);

module.exports = router;
