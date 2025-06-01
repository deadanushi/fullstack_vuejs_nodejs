/**
 * Send a standardized JSON response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {boolean} success - Success status
 * @param {string} message - Message to include in the response
 * @param {object} data - Data to include in the response
 */
exports.sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success
  };

  if (message) response.message = message;
  if (data !== null) response.data = data;

  return res.status(statusCode).json(response);
};