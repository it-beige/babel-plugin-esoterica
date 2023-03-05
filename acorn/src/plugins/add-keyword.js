module.exports = function (options) {
  return Parser => {
    return plugin(options, Parser);
  };
};

function plugin(options, Parser) {
  return class AddKeyword extends Parser {
    parse(program) {
      var newKeywords =
        'break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this const class extends export import super';
      newKeywords += ' guang'; // 增加一个关键字
      this.keywords = new RegExp(
        '^(?:' + newKeywords.replace(/ /g, '|') + ')$',
      );

      return super.parse(program);
    }
  };
}
