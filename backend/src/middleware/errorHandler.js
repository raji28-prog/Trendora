export function errorHandler(error, request, reply) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  request.log.error(error);

  reply.status(statusCode).send({
    success: false,
    error: {
      statusCode,
      message,
      ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
    },
  });
}

export default errorHandler;
