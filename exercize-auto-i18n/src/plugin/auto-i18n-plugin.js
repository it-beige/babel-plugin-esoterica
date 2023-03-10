const { declare } = require('@babel/helper-plugin-utils');

const autoI18nPlugin = declare((api, options, dirname) => {
  api.assertVersion(7);
  return {
    pre(file) {},

    visitor: {
      Program: {
        enter(path, state) {
          let imported;
          path.traverse({
            ImportDeclaration(path) {
              let source = path.node.source.value;
              if (source === 'intl') {
                imported = true;
              }
            },
          });

          if (!imported) {
            path.scope.generateUid('intl');
          }
        },
      },
    },

    post(file) {},
  };
});

module.exports = autoI18nPlugin;
