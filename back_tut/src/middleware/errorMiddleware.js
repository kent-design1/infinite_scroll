

// 404 handler — catches requests to routes that don't exist
const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`)
    res.status(404)
    next(error)   // pass to the error handler below
}

// Global error handler — catches everything passed via next(error)
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({error: err.message});

    stack : process.env.NODE_ENV === 'development' ? err.stack : err.stack;
}

export { notFound, errorHandler };