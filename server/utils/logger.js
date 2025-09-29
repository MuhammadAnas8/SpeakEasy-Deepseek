export const logger = (req, _res, next) => {
  console.log(">>", req.method, req.originalUrl, req.body);
  next();
};
