export async function authenticate(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({
      success: false,
      error: {
        statusCode: 401,
        message: 'Unauthorized: Invalid or expired token',
      },
    });
  }
}

export function authorize(roles = []) {
  return async (request, reply) => {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        error: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      });
    }

    if (roles.length > 0 && !roles.includes(request.user.role)) {
      return reply.status(403).send({
        success: false,
        error: {
          statusCode: 403,
          message: 'Forbidden: You do not have permission to access this resource',
        },
      });
    }
  };
}
