var medley = (function() {
  'use strict';
  
  function getOrDefault(obj, key, d) {
    return key in obj? obj[key]: d;
  }

  var self = {};
  
  self.Attribute = class {
    constructor(name, type) {
      this.name = name;
      this.type = type;
    }
  }

  self.Type = class {
    constructor(name, parameters, attributes) {
      this.name = name;
      this.parameters = parameters;
      this.attributes = attributes;
    }

    get innerType() {
      return this;
    }

    toString() {
      return this.name;
    }
  }

  self.FunctorType = class extends self.Type {
    get innerType() {
      return this.parameters[0].innerType;
    }

    toString() {
      return this.name + "(" + this.parameters[0].toString() + ")";
    }
  }

  self.makeMaybeType = function(innerType) {
    return new self.FunctorType("Maybe", [innerType]);
  }

  self.makeListType = function(innerType) {
    return new self.FunctorType("List", [innerType]);
  }

  self.Schema = class {
    constructor(types) {
      this.types = types;
    }
  }

  self.Scope = class {
    constructor() {
      this.types = [];
      this.typeByName = {};
    }

    insert(type) {
        this.types.push(type);
        this.typeByName[type.name] = type;
    }

    insertAll(types) {
      for (var i in types) {
        this.insert(types[i]);
      }
    }

    getTypeByName(name) {
      return this.typeByName[name];
    }
  }
  
  
    function loadAttribute(data) {
    return new self.Attribute(data.name, data.type);
  }
  
  function loadType(data) {
    var attributes = getOrDefault(data, "attributes", []).map(loadAttribute);
    var parameters = undefined;
    return new self.Type(data.name, parameters, attributes);
  }
  
  function loadSchema(data) {
    var types = getOrDefault(data, "types", []).map(loadType);
    return new self.Schema(types);
  }
  
  function resolveTypeName(scope, name) {
    if (name.endsWith("?")) {
      var innerType = resolveTypeName(scope, name.slice(0, -1));
      return self.makeMaybeType(innerType);
    }
    if (name.endsWith("*")) {
      var innerType = resolveTypeName(scope, name.slice(0, -1));
      return self.makeListType(innerType);
    }
    return scope.getTypeByName(name);
  }
  
  function resolveTypeNames(scope) {
    for (var i in scope.types) {
      var type = scope.types[i];
      for (var j in type.attributes) {
          var attribute = type.attributes[j];
          attribute.type = resolveTypeName(scope, attribute.type);
      }
    }
  }
  
  function resolvedScope(data) {
    var builtin = loadSchema({"types": [
      {"name": "Boolean"},
      {"name": "Integer"},
      {"name": "Decimal"},
      {"name": "String"},
    ]});
    
    var user = loadSchema(data);
    
    var scope = new self.Scope();
    scope.insertAll(builtin.types);
    scope.insertAll(user.types);
    resolveTypeNames(scope);
    
    return scope;
  }
  
  self.load = function(data) {
    var head = getOrDefault(data, "head");
    var body = getOrDefault(data, "body");
    
    var scope = resolvedScope(head);
    
    var root = getOrDefault(head, "root");
    var type = scope.getTypeByName(root);
    
    return {head: {type: type}, body: body};
  }
  
  return self;
}).call(this);
