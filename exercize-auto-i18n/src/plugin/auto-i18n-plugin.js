const { declare } = require('@babel/helper-plugin-utils');

declare((api, options, dirname) => {
  return {
    pre(file) {},

    visitor: {
      Program: {},
    },

    post(file) {},
  };
});
