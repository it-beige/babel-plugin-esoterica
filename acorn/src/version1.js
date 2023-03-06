const { Parser, TokenType } = require('acorn');
const addKeyword = require('./plugins/add-keyword');

const word = 'beige';
Parser.acorn.keywordTypes[word] = new TokenType(word, {
  keyword: word,
});

function wordsRegexp(words) {
  return new RegExp('^(?:' + words.replace(/ /g, '|') + ')$');
}

const beigeKeyword = addKeyword({
  word: word,
});
const newParser = Parser.extend(beigeKeyword);
const program = `
  beige
  const a = 1
`;

const ast = newParser.parse(program);
console.log(ast);
