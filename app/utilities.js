var exports = module.exports = {}

exports.randInt = function(min,max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// simple enum for validation types for consistency sake
var ValidationTypes = {
  INT            : 0,
  FLOAT          : 1,
  POSITIVE_INT   : 2,
  POSITIVE_FLOAT : 3,
  ALPHANUMERIC   : 4
}

// this method takes both an array of validation methods and a value and then performs
// the selected validation methods
function validate(types = [],value){

  let success = true;

  for(var type of types){

    switch(type){

      case ValidationTypes.INT            :

        break;

      case ValidationTypes.FLOAT          :

        break;

      case ValidationTypes.POSITIVE_INT   :

        success = (/^\d+$/).test(value);
        break;

      case ValidationTypes.POSITIVE_FLOAT :

        success = (/^\d*\.?\d+$/).test(value);
        break;

      case ValidationTypes.ALPHANUMERIC   :

        success = (/^[\w\s]+$/).test(value);
        break;

    }

  }


  return success;

}

module.exports.validate = validate;

module.exports.validationTypes = ValidationTypes;

// module.exports
