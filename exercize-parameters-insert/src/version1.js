const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');
const sourceCode = require('./sourceCode');

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx'],
});

traverse(ast, {
  CallExpression: (path, state) => {
    const logMethods = ['log', 'info', 'error', 'warn', 'debug'];
    if (
      path.node.callee.type === 'MemberExpression' &&
      path.node.callee.object.name === 'console' &&
      logMethods.includes(path.node.callee.property.name)
    ) {
      const { line, column } = path.node.loc.start;
      const insertStringLiteral = types.stringLiteral(
        `filename ${line}, ${column}`,
      );
      path.node.arguments.unshift(insertStringLiteral);
    }
  },
});

const { code, map } = generate(ast);
console.log(code);
