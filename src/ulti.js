// Generated by CoffeeScript 1.8.0
(function() {
  var i, ulti,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ulti = {
    uniquePush: function(arr, elem) {
      if (__indexOf.call(arr, elem) < 0) {
        return arr.push(elem);
      }
    },
    uniqueConcat: function(arr, elem_arr) {
      var i, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = elem_arr.length; _i < _len; _i++) {
        i = elem_arr[_i];
        _results.push(ulti.uniquePush(arr, i));
      }
      return _results;
    },
    makeCombination: function(lists) {
      var copy_lists, makeCombinationOfTwo, result;
      makeCombinationOfTwo = function(last_list, remain_lists) {
        var last_item, next_item, next_list, ret, _i, _j, _len, _len1;
        next_list = remain_lists.shift();
        if (next_list === void 0) {
          return last_list;
        }
        ret = [];
        for (_i = 0, _len = last_list.length; _i < _len; _i++) {
          last_item = last_list[_i];
          for (_j = 0, _len1 = next_list.length; _j < _len1; _j++) {
            next_item = next_list[_j];
            ret.push(last_item.concat(next_item));
          }
        }
        return makeCombinationOfTwo(ret, remain_lists);
      };
      copy_lists = lists.slice();
      return result = makeCombinationOfTwo(copy_lists.shift().map(function(x) {
        if (x instanceof Array) {
          return x;
        } else {
          return [x];
        }
      }), copy_lists);
    },
    stripEmptyOfList: function(list) {
      var i, item, ret, _i, _len;
      ret = [];
      for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
        item = list[i];
        if (item instanceof Array) {
          ret.push(ulti.stripEmptyOfList(item));
        } else {
          if (item) {
            ret.push(item);
          }
        }
      }
      return ret;
    },
    objDotAccessor: function(obj, path) {
      var attr, path_arr, ret;
      if (!path) {
        return obj;
      }
      path_arr = path.split('.');
      ret = obj;
      while (attr = path_arr.shift()) {
        ret = ret[attr];
      }
      return ret;
    },
    toObjString: function(obj, indent) {
      var cache, customStringify;
      if (indent == null) {
        indent = 0;
      }
      cache = [];
      customStringify = function(k, v) {
        if (typeof v === 'object' && v !== null) {
          if (__indexOf.call(cache, v) >= 0) {
            return 'CR -> ' + v.toString();
          }
          cache.push(v);
        }
        if (v instanceof Function) {
          return v.toString();
        }
        return v;
      };
      return JSON.stringify(obj, customStringify, indent);
    },
    dump: function(type, file_key, obj) {
      var cache_dir, dawnjs_dir, fs, home, item, key, _i, _len;
      if (obj instanceof Array) {
        for (_i = 0, _len = obj.length; _i < _len; _i++) {
          item = obj[_i];
          if (item['__MixMapID__']) {
            item.push('__MixMapID__' + item['__MixMapID__']);
          }
        }
      }
      if (ulti.indexedDBWrite) {
        return ulti.indexedDBWrite(type, {
          key: file_key + '.' + type,
          query: ulti.toObjString(obj)
        });
      } else {
        fs = require('fs');
        key = file_key;
        obj = ulti.toObjString(obj);
        home = process.env.USERPROFILE || process.env.HOME;
        dawnjs_dir = home + '/.dawnjs/';
        cache_dir = dawnjs_dir + 'cache/';
        if (!fs.existsSync(dawnjs_dir)) {
          fs.mkdirSync(dawnjs_dir);
        }
        if (!fs.existsSync(cache_dir)) {
          fs.mkdirSync(cache_dir);
        }
        return fs.writeFile(cache_dir + key + '.' + type, obj);
      }
    },
    load: function(type, file_key, callback) {
      var cache_dir, dawnjs_dir, file_name, fs, home, lex_file_rebuild;
      lex_file_rebuild = function(res) {
        var item, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = res.length; _i < _len; _i++) {
          item = res[_i];
          if (item.length === 3 && item[2].indexOf('__MixMapID__') === 0) {
            _results.push(item['__MixMapID__'] = parseInt(item.pop().replace('__MixMapID__', '')));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      if (ulti.indexedDBRead) {
        return ulti.indexedDBRead(type, file_key, function(res) {
          res = JSON.parse(res.query);
          if (res instanceof Array) {
            lex_file_rebuild(res);
          }
          return callback(res);
        });
      } else {
        fs = require('fs');
        home = process.env.USERPROFILE || process.env.HOME;
        dawnjs_dir = home + '/.dawnjs/';
        cache_dir = dawnjs_dir + 'cache/';
        file_name = cache_dir + file_key + '.' + type;
        if (fs.existsSync(file_name)) {
          return fs.readFile(file_name, null, function(err, res) {
            res = JSON.parse(res);
            if (res instanceof Array) {
              lex_file_rebuild(res);
            }
            return callback(res);
          });
        } else {
          return ulti.log('file not exist: ' + file_key);
        }
      }
    },
    existLocalCache: function(type, file_key) {
      var cache_dir, dawnjs_dir, file_name, fs, home;
      fs = require('fs');
      home = process.env.USERPROFILE || process.env.HOME;
      dawnjs_dir = home + '/.dawnjs/';
      cache_dir = dawnjs_dir + 'cache/';
      file_name = cache_dir + file_key + '.' + type;
      return fs.existsSync(file_name);
    },
    log: function(x, mark, indent) {
      var result, surfix;
      if (indent == null) {
        indent = 4;
      }
      surfix = ' - ' + (mark ? mark : '');
      result = ulti.toObjString(x, indent) + surfix;
      console.log(result);
      return result;
    },
    stringEqual: function(source, target, unit) {
      var result, toStr;
      toStr = function(data) {
        var cache, customStringify;
        if (typeof data === 'object') {
          cache = [];
          customStringify = function(k, v) {
            if (typeof v === 'object' && v !== null) {
              if (__indexOf.call(cache, v) >= 0) {
                return 'CR -> ' + v.toString();
              }
              cache.push(v);
            }
            return v;
          };
          data = JSON.stringify(source, customStringify, 0);
          cache = null;
        }
        return data = data.trim().replace(/E![\w0-9]+/g, '!ReprMark!');
      };
      result = toStr(source) === toStr(target);
      return ulti.log(result, unit || '');
    },
    jsonClone: function(json_obj) {
      return JSON.parse(JSON.stringify(json_obj));
    },
    fileWalk: function(root_dir, handler) {
      var fs, ls, name, _i, _len, _results;
      fs = require('fs');
      ls = fs.readdirSync(root_dir);
      _results = [];
      for (_i = 0, _len = ls.length; _i < _len; _i++) {
        name = ls[_i];
        if (fs.lstatSync(root_dir + name).isDirectory()) {
          _results.push(ulti.fileWalk(root_dir + name + '/', handler));
        } else {
          _results.push(handler(root_dir + name));
        }
      }
      return _results;
    }
  };

  (function() {
    var workDB;
    if (typeof self === 'undefined' || typeof self.indexedDB === 'undefined') {
      return false;
    }
    workDB = function(type, callback) {
      var db, req;
      type = 'dawn.js';
      db = null;
      req = self.indexedDB.open('dawn.js', 1);
      req.onsuccess = function(e) {
        var objectStore, transaction;
        db = req.result;
        transaction = db.transaction(type, 'readwrite');
        objectStore = transaction.objectStore(type);
        return callback(objectStore);
      };
      req.onupgradeneeded = function(e) {
        var objectStore;
        db = event.target.result;
        return objectStore = db.createObjectStore(type, {
          keyPath: 'key'
        });
      };
      return req.onerror = function(e) {
        return ulti.log('IndexedDB Error: ' + e.target.errorCode);
      };
    };
    ulti.indexedDBRead = function(type, key, callback) {
      return workDB(type, function(os) {
        return os.get(key + '.' + type).onsuccess = function(e) {
          return callback(e.target.result);
        };
      });
    };
    return ulti.indexedDBWrite = function(type, obj, callback) {
      return workDB(type, function(os) {
        var add_os_req;
        add_os_req = os.put(obj);
        return add_os_req.onsuccess = function(e) {
          return callback && callback(e.target.result);
        };
      });
    };
  })();

  if (typeof self === 'undefined') {
    for (i in ulti) {
      module.exports[i] = ulti[i];
    }
  } else {
    self.ulti = ulti;
  }

}).call(this);

//# sourceMappingURL=ulti.js.map
