module.exports = function (options) {
  return Parser => {
    return plugin(options, Parser);
  };
};

function plugin(options, Parser) {
  options = options || {};
  const { word } = options;
  return class AddKeyword extends Parser {
    parse(program) {
      var newKeywords =
        'break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this const class extends export import super';
      newKeywords += ` ${word}`; // 增加一个关键字
      this.keywords = new RegExp(
        '^(?:' + newKeywords.replace(/ /g, '|') + ')$',
      );

      return super.parse(program);
    }

    parseStatement(context, topLevel, exports) {
      let tokenType = this.type;

      if (tokenType == Parser.acorn.keywordTypes[word]) {
        let node = this.startNode();
        return this.parseWordStatement(node, word);
      } else {
        return super.parseStatement(context, topLevel, exports);
      }
    }

    parseWordStatement(node, word) {
      this.next();
      const upperCaseWord = word.slice(0, 1).toUpperCase() + word.slice(1);
      return this.finishNode({ value: word }, `${upperCaseWord}Statement`);
    }
  };
}
