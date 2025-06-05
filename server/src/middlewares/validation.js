const validatePayload = (schema) => {
  return (req, res, next) => {
    const payload = req.body;
    const result = schema.safeParse(payload);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.errors,
      });
    }
    req.body = result.data;
    next();
  };
};
export default validatePayload;
