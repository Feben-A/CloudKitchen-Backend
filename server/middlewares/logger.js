const logger = (req, res, next) => {
  console.log(req.method, req.originalUrl);
  console.log("made it here");
  next();
};

module.exports = logger;
