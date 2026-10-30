// Handle errors from asynchronous route controllers.
export function asyncHandler(requestHandler) {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
}
