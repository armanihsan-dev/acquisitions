export const formateValidationError = errors => {
  if (!errors || !errors.issues) return 'Validation failed'; // Changed .issue to .issues

  if (Array.isArray(errors.issues))
    // Changed .issue to .issues
    return errors.issues.map(error => error.message).join(', ');

  return JSON.stringify(errors);
};
