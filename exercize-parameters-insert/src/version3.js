const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');
const template = require('@babel/template').default;

const sourceCode = require('./codeTemplate');

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx'],
});

const logMethods = ['log', 'info', 'error', 'warn', 'debug'].map(
  i => `console.${i}`,
);

traverse(ast, {
  CallExpression(path, state) {
    if (path.node.isNew) {
      return;
    }
    const calleeName = generate(path.node.callee).code;

    if (logMethods.includes(calleeName)) {
      const { column, line } = path.node.loc.start;
      const newNode = template.expression(
        `console.log("filename: (${line}, ${column})")`,
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
});

const { code, map } = generate(ast);
console.log(code);
