// Generated by CoffeeScript 1.8.0
(function() {
  var CodeGen, GenCodeFromLeaves, GenWalker, Zipper, grammarParser, ulti,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (typeof self === 'undefined') {
    ulti = require('./ulti.js');
    Zipper = require('./Zipper.js');
    Zipper = Zipper.Zipper;
  } else {
    ulti = self.ulti;
    Zipper = self.Zipper;
  }

  CodeGen = function(grammar, ast, indent_lex) {
    var grammar_map;
    grammar_map = grammarParser(grammar);
    return GenWalker(grammar_map, ast.leaves, '', indent_lex);
  };

  GenWalker = function(grammar, ast_leaves, indent, indent_lex) {
    var node, ret, _i, _len, _ref;
    ret = '';
    if (!ast_leaves) {
      return ret;
    }
    for (_i = 0, _len = ast_leaves.length; _i < _len; _i++) {
      node = ast_leaves[_i];
      if (node['lex'] in grammar) {
        ret += (node['lex'] === 'Dedent' ? indent.slice(0, -4) : indent) + GenCodeFromLeaves(grammar[node['lex']], node['leaves'], grammar) + '\n';
        if (_ref = node['lex'], __indexOf.call(indent_lex, _ref) >= 0) {
          indent += '    ';
        }
      }
      if (node['leaves']) {
        ret += GenWalker(grammar, node['leaves'], indent, indent_lex);
      }
    }
    return ret;
  };

  GenCodeFromLeaves = function(gen_order, ast_leaves, grammar) {
    var gen_each_item, gen_item, ret, stratchValues, _i, _j, _len, _len1;
    ret = '';
    stratchValues = function(gen_item, leaves) {
      var expand_grammar, inner_gen_item, leave, none_or_more_item, none_or_more_item_find, none_or_more_set, selected, _i, _j, _k, _len, _len1, _len2, _selected_index;
      expand_grammar = grammar[':' + gen_item];
      for (_i = 0, _len = leaves.length; _i < _len; _i++) {
        leave = leaves[_i];
        if (leave.lex === gen_item) {
          if (leave.value !== void 0) {
            return leave.value;
          }
          if (expand_grammar) {
            ret = '';
            _selected_index = {};
            for (_j = 0, _len1 = expand_grammar.length; _j < _len1; _j++) {
              inner_gen_item = expand_grammar[_j];
              if (!inner_gen_item) {
                continue;
              }
              if (inner_gen_item instanceof Array) {
                none_or_more_item_find = true;
                while (none_or_more_item_find) {
                  none_or_more_set = '';
                  for (_k = 0, _len2 = inner_gen_item.length; _k < _len2; _k++) {
                    none_or_more_item = inner_gen_item[_k];
                    if (none_or_more_item.charAt(0) === '"' && none_or_more_item.charAt(none_or_more_item.length - 1) === '"') {
                      none_or_more_set += none_or_more_item.substring(1, none_or_more_item.length - 1);
                    } else {
                      if (!(none_or_more_item in _selected_index)) {
                        _selected_index[none_or_more_item] = 0;
                      } else {
                        _selected_index[none_or_more_item] += 1;
                      }
                      selected = Zipper.select(leave, none_or_more_item);
                      if (selected[_selected_index[none_or_more_item]]) {
                        none_or_more_set += selected[_selected_index[none_or_more_item]].value;
                      } else {
                        none_or_more_item_find = false;
                        break;
                      }
                    }
                  }
                  if (!none_or_more_item_find) {
                    break;
                  } else {
                    ret += none_or_more_set;
                  }
                }
              } else if (inner_gen_item.charAt(0) === '"' && inner_gen_item.charAt(inner_gen_item.length - 1) === '"') {
                ret += inner_gen_item.substring(1, inner_gen_item.length - 1);
              } else {
                if (!(inner_gen_item in _selected_index)) {
                  _selected_index[inner_gen_item] = 0;
                } else {
                  _selected_index[inner_gen_item] += 1;
                }
                selected = Zipper.select(leave, inner_gen_item);
                ret += selected[_selected_index[inner_gen_item]].value;
              }
            }
            return ret;
          }
        }
      }
      return '';
    };
    for (_i = 0, _len = gen_order.length; _i < _len; _i++) {
      gen_item = gen_order[_i];
      if (gen_item instanceof Array) {
        for (_j = 0, _len1 = gen_item.length; _j < _len1; _j++) {
          gen_each_item = gen_item[_j];
          ret += stratchValues(gen_each_item, ast_leaves);
        }
      } else if (gen_item.charAt(0) === '"') {
        ret += gen_item.substring(1, gen_item.length - 1);
      } else {
        ret += stratchValues(gen_item, ast_leaves);
      }
    }
    return ret;
  };

  grammarParser = function(grammar) {
    var add_zero_or_more, asterisk_order, gen_order, grammar_map, in_string, l, line, lines_pair, raw_lines, raw_order, _i, _len;
    raw_lines = grammar.split('\n');
    lines_pair = raw_lines.filter(function(x) {
      return x;
    }).map(function(x) {
      return x.replace('\\n', '\n').split('->');
    });
    grammar_map = {};
    for (_i = 0, _len = lines_pair.length; _i < _len; _i++) {
      line = lines_pair[_i];
      grammar_map[line[0].trim()] = null;
      gen_order = [''];
      raw_order = line[1].trim();
      l = raw_order.length;
      in_string = false;
      add_zero_or_more = 0;
      asterisk_order = [''];
      while (l--) {
        if (raw_order[l] === '"') {
          if (!in_string) {
            in_string = true;
            if (add_zero_or_more === 0) {
              gen_order[0] = '"';
            } else {
              asterisk_order[0] = '"';
            }
          } else {
            in_string = false;
            if (add_zero_or_more === 0) {
              gen_order[0] = '"' + gen_order[0];
            } else {
              asterisk_order[0] = '"' + asterisk_order[0];
            }
          }
        } else if (raw_order[l] === '*') {
          if (in_string) {
            gen_order[0] = raw_order[l] + gen_order[0];
          } else {
            add_zero_or_more = raw_order[l - 1] === ')' ? 2 : 1;
            if (add_zero_or_more === 2) {
              l--;
            }
          }
        } else {
          if (in_string) {
            if (add_zero_or_more === 0) {
              gen_order[0] = raw_order[l] + gen_order[0];
            } else {
              asterisk_order[0] = raw_order[l] + asterisk_order[0];
            }
          } else if (raw_order[l] === ' ') {
            if (add_zero_or_more !== 0) {
              if (add_zero_or_more === 1) {
                add_zero_or_more = 0;
                gen_order.unshift(asterisk_order);
                gen_order.unshift('');
                asterisk_order = [''];
              } else {
                asterisk_order.unshift('');
              }
            } else if (gen_order[0].length !== 0) {
              gen_order.unshift('');
            }
          } else if (raw_order[l] === '(' && add_zero_or_more === 2) {
            add_zero_or_more = 0;
            gen_order.unshift(asterisk_order);
            asterisk_order = [''];
          } else {
            if (add_zero_or_more !== 0) {
              asterisk_order[0] = raw_order[l] + asterisk_order[0];
            } else {
              gen_order[0] = raw_order[l] + gen_order[0];
            }
          }
        }
      }
      grammar_map[line[0].trim()] = gen_order;
    }
    return grammar_map;
  };

  if (typeof self === 'undefined') {
    module.exports.CodeGen = CodeGen;
  } else {
    self.CodeGen = CodeGen;
  }

}).call(this);

//# sourceMappingURL=code-gen.js.map
