export const notFoundMiddleware = (req, res, next) => {
  return res.status(404).json({
    status: 404,
    code: 'RESOURCE_NOT_FOUND',
    message: `Path ${req.originalUrl} not found`
  });
};