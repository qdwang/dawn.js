// Generated by CoffeeScript 1.8.0
(function() {
  var LexParser, log, ulti;

  if (typeof self === 'undefined') {
    ulti = require('./ulti.js');
  } else {
    ulti = self.ulti;
  }

  LexParser = function(script, syntax) {
    this.script = script;
    this.lex_syntax = syntax;
    this.lex_list = [];
    this.cursor_lex = null;
    return this;
  };

  LexParser.flow = function(args) {
    var cursor_pos, lex_syntax, lp, make_dedent, script;
    console.log('LexParser');
    script = args.script;
    lex_syntax = args.lex_syntax;
    cursor_pos = args.cursor_pos;
    make_dedent = args.make_dedent;
    lp = new LexParser(script, lex_syntax);
    lp.tokenize(cursor_pos);
    if (make_dedent) {
      lp.makeDedent(make_dedent);
    }
    lp.lex_list.push('ProgramEnd');
    args.lex_list = lp.lex_list;
    args.cursor_lex = lp.cursor_lex;
    return args.end_lex = ['ProgramEnd'];
  };

  LexParser.prototype.tokenize = function(cursor_pos) {
    var lex, lex_obj, match, match_lex_len, new_script_arr, offset, prefix, script_arr, str, syntax_name, unit, unit_arr, _i, _len;
    lex_obj = {};
    script_arr = [this.script];
    for (syntax_name in this.lex_syntax) {
      offset = 0;
      new_script_arr = [];
      for (_i = 0, _len = script_arr.length; _i < _len; _i++) {
        unit = script_arr[_i];
        if (typeof unit === 'number') {
          offset += unit;
          new_script_arr.push(unit);
        } else {
          str = unit;
          unit_arr = [];
          while (match = this.lex_syntax[syntax_name].exec(str)) {
            offset += match.index;
            match_lex_len = match[0].length;
            lex = [syntax_name, match[0]];
            lex_obj[offset] = lex;
            if (!this.cursor_lex && cursor_pos && cursor_pos > offset && cursor_pos <= offset + match_lex_len) {
              this.cursor_lex = lex;
            }
            prefix = str.slice(0, match.index);
            if (!prefix.trim()) {
              unit_arr.push(prefix.length);
            } else {
              unit_arr.push(prefix);
            }
            unit_arr.push(match_lex_len);
            str = str.slice(match.index + match_lex_len);
            offset += match_lex_len;
          }
          if (!str.trim()) {
            unit_arr.push(str.length);
          } else {
            unit_arr.push(str);
          }
          offset += str.length;
          new_script_arr = new_script_arr.concat(unit_arr);
        }
      }
      script_arr = new_script_arr;
    }
    for (lex in lex_obj) {
      this.lex_list.push(lex_obj[lex]);
    }
    return this;
  };

  LexParser.prototype.makeDedent = function(base_lex, insert_lex) {
    var i, last_indent, lex, mixed_indent, new_lex_list, _i, _j, _len, _ref, _ref1;
    if (base_lex == null) {
      base_lex = 'Indent';
    }
    if (insert_lex == null) {
      insert_lex = 'Dedent';
    }
    new_lex_list = [];
    last_indent = 0;
    mixed_indent = 0;
    _ref = this.lex_list;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      lex = _ref[_i];
      if (lex[1] === '\n') {
        mixed_indent = 0;
        new_lex_list.push(lex);
      } else if (lex[0] === base_lex) {
        mixed_indent += 1;
      } else {
        if (new_lex_list.length && new_lex_list[new_lex_list.length - 1][1] === '\n') {
          if (mixed_indent < last_indent) {
            for (i = _j = 0, _ref1 = last_indent - mixed_indent - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
              new_lex_list.push([insert_lex, '    ']);
            }
          }
          if (mixed_indent > 0) {
            new_lex_list.push([base_lex, '    ']);
          }
          last_indent = mixed_indent;
        }
        new_lex_list.push(lex);
      }
    }
    if (last_indent > 0) {
      new_lex_list.push([insert_lex, '    ']);
    }
    this.lex_list = new_lex_list;
    return this;
  };

  LexParser.rebuild = function(lex_list, mix_map) {
    var lex_pair, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = lex_list.length; _i < _len; _i++) {
      lex_pair = lex_list[_i];
      if (lex_pair['__MixMapID__']) {
        _results.push(mix_map.refs[lex_pair['__MixMapID__']] = lex_pair);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  if (typeof self === 'undefined') {
    module.exports.LexParser = LexParser;
  } else {
    self.LexParser = LexParser;
  }

  log = function() {};

  log = ulti.log;

}).call(this);

//# sourceMappingURL=lex-parser.js.map
