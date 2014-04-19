// Generated by CoffeeScript 1.7.1
(function() {
  var getObjectName, grammar, lex_syntax, markers, parseFlow;

  importScripts('./../../src/ulti.js');

  importScripts('./../../src/BNF-parser.js');

  importScripts('./../../src/IR.js');

  importScripts('./../../src/Zipper.js');

  importScripts('./../../src/flow.js');

  importScripts('./../../src/lex-parser.js');

  importScripts('./../../src/LR1-parser.js');

  importScripts('./../../src/symbol-table.js');

  lex_syntax = {
    'String': /'.*?[^\\]'|".*?[^\\]"/,
    'Dot': /\./,
    'Func': /function/,
    'StmtEnd': /;|\n/,
    'Assign': /\=/,
    'Pl': /\(/,
    'Pr': /\)/,
    'Bl': /\{/,
    'Br': /\}/,
    'Comma': /\,/,
    'Var': /var/,
    'Id': /[a-zA-Z_$][\w_$]*/
  };

  grammar = "Program -> S+\nS -> SGO StmtEnd | StmtEnd\nSGO -> Obj | StmtEnd | Assignment\nAssignment -> Var* Receiver Assign Giver\nReceiver -> Obj\nGiver -> Obj | Function\nFunction -> Func Id* Pl Args* Pr Bl S* Br\nObj -> Id (Dot Id)* | Bl Br\nArgs -> Id (Comma Id)*";

  markers = {
    Receiver: (function(x) {
      return getObjectName(x);
    }),
    Giver: (function(x) {
      return x;
    })
  };

  getObjectName = function(obj_node, top) {
    var id, ids, name, _i, _len;
    if (top == null) {
      top = false;
    }
    ids = self.Zipper.select(obj_node, 'Id');
    name = '';
    for (_i = 0, _len = ids.length; _i < _len; _i++) {
      id = ids[_i];
      name += id.value + '.';
      if (top) {
        break;
      }
    }
    return name.slice(0, -1);
  };

  parseFlow = function(script, cursor_pos) {
    var args, ast, curr_ast_node, curr_obj_name, curr_obj_node, curr_symbol_table, cursor_lex, flow, i, mm, result, scope_node, _i, _len, _results;
    args = {
      script: script,
      lex_syntax: lex_syntax,
      cursor_pos: cursor_pos,
      grammar: grammar,
      start_stmt: ['Program'],
      sync_lex: ['StmtEnd', 'ParseFail', 'S'],
      mix_map: new self.MixMap,
      ast_cutter: [],
      markers: markers,
      scope_rules: ['Function']
    };
    flow = new self.Flow(args);
    flow.append([self.LexParser.flow, self.SyntaxParser.flow, self.SymbolTable.flow]);
    flow.finish();
    cursor_lex = flow.result('cursor_lex');
    mm = flow.result('mix_map');
    ast = flow.result('ast');
    if (!cursor_lex) {
      self.postMessage('no lex found');
      return null;
    }
    curr_ast_node = mm.get(cursor_lex, 'SyntaxNode');
    curr_obj_node = self.Zipper.findParent({
      lex: 'Obj'
    }, curr_ast_node);
    scope_node = self.Zipper.findParent({
      lex: 'Function'
    }, curr_ast_node);
    if (!scope_node) {
      scope_node = ast;
    }
    curr_symbol_table = mm.get(scope_node, 'SymbolTable');
    if (curr_obj_node) {
      curr_obj_name = getObjectName(curr_obj_node, true);
      result = curr_symbol_table.filter((function(record) {
        if (record.Receiver.indexOf(curr_obj_name) > -1) {
          return true;
        } else {
          return false;
        }
      }), 1);
      _results = [];
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        i = result[_i];
        _results.push(self.postMessage(i.Receiver));
      }
      return _results;
    } else {
      return self.postMessage('no reference found');
    }
  };

  self.onmessage = function(e) {
    var data;
    data = JSON.parse(e.data);
    return parseFlow(data['script'], data['cursor_pos']);
  };

}).call(this);

//# sourceMappingURL=autocomplete.map
