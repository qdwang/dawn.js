// Generated by CoffeeScript 1.8.0
(function() {
  var Flow;

  Flow = function(start_arguments) {
    if (start_arguments == null) {
      start_arguments = {};
    }
    this.funcs = [];
    this.args = start_arguments;
    return this;
  };

  Flow.prototype.append = function(fn) {
    this.funcs = this.funcs.concat(fn);
    return this;
  };

  Flow.prototype.finish = function() {
    while (this.next()) {
      1;
    }
    return this;
  };

  Flow.prototype.next = function() {
    var fn;
    if (!this.funcs.length) {
      return null;
    }
    fn = this.funcs.shift();
    fn(this.args);
    return this;
  };

  Flow.prototype.result = function(filter_arg) {
    var i, ret;
    if (typeof filter_arg === 'string') {
      return this.args[filter_arg];
    }
    ret = {};
    for (i in filter_arg) {
      ret[i] = this.args[i];
    }
    return ret;
  };

  if (typeof self === 'undefined') {
    module.exports.Flow = Flow;
  } else {
    self.Flow = Flow;
  }

}).call(this);

//# sourceMappingURL=flow.js.map
