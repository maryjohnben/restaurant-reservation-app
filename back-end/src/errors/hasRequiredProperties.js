//makes sure body has all the required properties when creating or updating something.
function hasRequiredProperties(...properties) {
    return function (req, res, next) {
      const { data = {} } = req.body;
  
      try {
        properties.forEach((property) => {
          if (!data[property]) {
            const error = new Error(`A '${property}' property is required.`);
            error.status = 400;
            throw error;
          }
        });
        next();
      } catch (error) {
        next(error);
      }
    };
  }
  
  module.exports = hasRequiredProperties;