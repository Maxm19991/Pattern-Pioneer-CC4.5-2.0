/**
 * Safe error logging utility
 * Logs detailed errors in development, sanitized errors in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export function logError(context: string, error: any) {
  if (isDevelopment) {
    // In development, log full error details
    console.error(`[${context}]:`, error);
  } else {
    // In production, log sanitized error without stack traces
    const sanitizedError = {
      context,
      message: error?.message || 'Unknown error',
      timestamp: new Date().toISOString(),
    };
    console.error(sanitizedError);
  }
}

export function getPublicErrorMessage(error: any): string {
  if (isDevelopment) {
    // In development, return detailed error for debugging
    return error?.message || 'An error occurred';
  }
  // In production, return generic error message
  return 'An error occurred. Please try again later.';
}
