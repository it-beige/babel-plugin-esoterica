const logMethods = ['log', 'info', 'error', 'warn', 'debug'].map(
  i => `console.${i}`,
);

const parametersInsertPlugin = ({ types, template }) => {
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.isNew) {
          return;
        }
        const calleeName = path.get('callee').toString();

        if (logMethods.includes(calleeName)) {
          const { column, line } = path.node.loc.start;
          const newNode = template.expression(
            `console.log("${
              state.filename || 'unkown filename'
            }: (${line}, ${column})")`,
          )();

          newNode.isNew = true;

          if (path.findParent(pathNode => pathNode.isJSXElement())) {
            path.replaceWith(types.arrayExpression([newNode, path.node]));
            path.skip();
          } else {
            path.insertBefore(newNode);
          }
        }
      },
    },
  };
};

module.exports = parametersInsertPlugin;
