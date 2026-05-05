// Wraps an async route handler and catches any error automatically
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

export default asyncHandler