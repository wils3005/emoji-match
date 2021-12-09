(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/quick-format-unescaped/index.js
  var require_quick_format_unescaped = __commonJS({
    "node_modules/quick-format-unescaped/index.js"(exports, module) {
      "use strict";
      function tryStringify(o) {
        try {
          return JSON.stringify(o);
        } catch (e) {
          return '"[Circular]"';
        }
      }
      module.exports = format;
      function format(f, args, opts) {
        var ss = opts && opts.stringify || tryStringify;
        var offset = 1;
        if (typeof f === "object" && f !== null) {
          var len = args.length + offset;
          if (len === 1)
            return f;
          var objects = new Array(len);
          objects[0] = ss(f);
          for (var index = 1; index < len; index++) {
            objects[index] = ss(args[index]);
          }
          return objects.join(" ");
        }
        if (typeof f !== "string") {
          return f;
        }
        var argLen = args.length;
        if (argLen === 0)
          return f;
        var str = "";
        var a = 1 - offset;
        var lastPos = -1;
        var flen = f && f.length || 0;
        for (var i = 0; i < flen; ) {
          if (f.charCodeAt(i) === 37 && i + 1 < flen) {
            lastPos = lastPos > -1 ? lastPos : 0;
            switch (f.charCodeAt(i + 1)) {
              case 100:
              case 102:
                if (a >= argLen)
                  break;
                if (args[a] == null)
                  break;
                if (lastPos < i)
                  str += f.slice(lastPos, i);
                str += Number(args[a]);
                lastPos = i + 2;
                i++;
                break;
              case 105:
                if (a >= argLen)
                  break;
                if (args[a] == null)
                  break;
                if (lastPos < i)
                  str += f.slice(lastPos, i);
                str += Math.floor(Number(args[a]));
                lastPos = i + 2;
                i++;
                break;
              case 79:
              case 111:
              case 106:
                if (a >= argLen)
                  break;
                if (args[a] === void 0)
                  break;
                if (lastPos < i)
                  str += f.slice(lastPos, i);
                var type = typeof args[a];
                if (type === "string") {
                  str += "'" + args[a] + "'";
                  lastPos = i + 2;
                  i++;
                  break;
                }
                if (type === "function") {
                  str += args[a].name || "<anonymous>";
                  lastPos = i + 2;
                  i++;
                  break;
                }
                str += ss(args[a]);
                lastPos = i + 2;
                i++;
                break;
              case 115:
                if (a >= argLen)
                  break;
                if (lastPos < i)
                  str += f.slice(lastPos, i);
                str += String(args[a]);
                lastPos = i + 2;
                i++;
                break;
              case 37:
                if (lastPos < i)
                  str += f.slice(lastPos, i);
                str += "%";
                lastPos = i + 2;
                i++;
                a--;
                break;
            }
            ++a;
          }
          ++i;
        }
        if (lastPos === -1)
          return f;
        else if (lastPos < flen) {
          str += f.slice(lastPos);
        }
        return str;
      }
    }
  });

  // node_modules/pino/browser.js
  var require_browser = __commonJS({
    "node_modules/pino/browser.js"(exports, module) {
      "use strict";
      var format = require_quick_format_unescaped();
      module.exports = pino2;
      var _console = pfGlobalThisOrFallback().console || {};
      var stdSerializers = {
        mapHttpRequest: mock,
        mapHttpResponse: mock,
        wrapRequestSerializer: passthrough,
        wrapResponseSerializer: passthrough,
        wrapErrorSerializer: passthrough,
        req: mock,
        res: mock,
        err: asErrValue
      };
      function shouldSerialize(serialize, serializers) {
        if (Array.isArray(serialize)) {
          const hasToFilter = serialize.filter(function(k) {
            return k !== "!stdSerializers.err";
          });
          return hasToFilter;
        } else if (serialize === true) {
          return Object.keys(serializers);
        }
        return false;
      }
      function pino2(opts) {
        opts = opts || {};
        opts.browser = opts.browser || {};
        const transmit2 = opts.browser.transmit;
        if (transmit2 && typeof transmit2.send !== "function") {
          throw Error("pino: transmit option must have a send function");
        }
        const proto = opts.browser.write || _console;
        if (opts.browser.write)
          opts.browser.asObject = true;
        const serializers = opts.serializers || {};
        const serialize = shouldSerialize(opts.browser.serialize, serializers);
        let stdErrSerialize = opts.browser.serialize;
        if (Array.isArray(opts.browser.serialize) && opts.browser.serialize.indexOf("!stdSerializers.err") > -1)
          stdErrSerialize = false;
        const levels = ["error", "fatal", "warn", "info", "debug", "trace"];
        if (typeof proto === "function") {
          proto.error = proto.fatal = proto.warn = proto.info = proto.debug = proto.trace = proto;
        }
        if (opts.enabled === false)
          opts.level = "silent";
        const level = opts.level || "info";
        const logger2 = Object.create(proto);
        if (!logger2.log)
          logger2.log = noop;
        Object.defineProperty(logger2, "levelVal", {
          get: getLevelVal
        });
        Object.defineProperty(logger2, "level", {
          get: getLevel,
          set: setLevel
        });
        const setOpts = {
          transmit: transmit2,
          serialize,
          asObject: opts.browser.asObject,
          levels,
          timestamp: getTimeFunction(opts)
        };
        logger2.levels = pino2.levels;
        logger2.level = level;
        logger2.setMaxListeners = logger2.getMaxListeners = logger2.emit = logger2.addListener = logger2.on = logger2.prependListener = logger2.once = logger2.prependOnceListener = logger2.removeListener = logger2.removeAllListeners = logger2.listeners = logger2.listenerCount = logger2.eventNames = logger2.write = logger2.flush = noop;
        logger2.serializers = serializers;
        logger2._serialize = serialize;
        logger2._stdErrSerialize = stdErrSerialize;
        logger2.child = child;
        if (transmit2)
          logger2._logEvent = createLogEventShape();
        function getLevelVal() {
          return this.level === "silent" ? Infinity : this.levels.values[this.level];
        }
        function getLevel() {
          return this._level;
        }
        function setLevel(level2) {
          if (level2 !== "silent" && !this.levels.values[level2]) {
            throw Error("unknown level " + level2);
          }
          this._level = level2;
          set(setOpts, logger2, "error", "log");
          set(setOpts, logger2, "fatal", "error");
          set(setOpts, logger2, "warn", "error");
          set(setOpts, logger2, "info", "log");
          set(setOpts, logger2, "debug", "log");
          set(setOpts, logger2, "trace", "log");
        }
        function child(bindings, childOptions) {
          if (!bindings) {
            throw new Error("missing bindings for child Pino");
          }
          childOptions = childOptions || {};
          if (serialize && bindings.serializers) {
            childOptions.serializers = bindings.serializers;
          }
          const childOptionsSerializers = childOptions.serializers;
          if (serialize && childOptionsSerializers) {
            var childSerializers = Object.assign({}, serializers, childOptionsSerializers);
            var childSerialize = opts.browser.serialize === true ? Object.keys(childSerializers) : serialize;
            delete bindings.serializers;
            applySerializers([bindings], childSerialize, childSerializers, this._stdErrSerialize);
          }
          function Child(parent) {
            this._childLevel = (parent._childLevel | 0) + 1;
            this.error = bind(parent, bindings, "error");
            this.fatal = bind(parent, bindings, "fatal");
            this.warn = bind(parent, bindings, "warn");
            this.info = bind(parent, bindings, "info");
            this.debug = bind(parent, bindings, "debug");
            this.trace = bind(parent, bindings, "trace");
            if (childSerializers) {
              this.serializers = childSerializers;
              this._serialize = childSerialize;
            }
            if (transmit2) {
              this._logEvent = createLogEventShape([].concat(parent._logEvent.bindings, bindings));
            }
          }
          Child.prototype = this;
          return new Child(this);
        }
        return logger2;
      }
      pino2.levels = {
        values: {
          fatal: 60,
          error: 50,
          warn: 40,
          info: 30,
          debug: 20,
          trace: 10
        },
        labels: {
          10: "trace",
          20: "debug",
          30: "info",
          40: "warn",
          50: "error",
          60: "fatal"
        }
      };
      pino2.stdSerializers = stdSerializers;
      pino2.stdTimeFunctions = Object.assign({}, { nullTime, epochTime, unixTime, isoTime });
      function set(opts, logger2, level, fallback) {
        const proto = Object.getPrototypeOf(logger2);
        logger2[level] = logger2.levelVal > logger2.levels.values[level] ? noop : proto[level] ? proto[level] : _console[level] || _console[fallback] || noop;
        wrap(opts, logger2, level);
      }
      function wrap(opts, logger2, level) {
        if (!opts.transmit && logger2[level] === noop)
          return;
        logger2[level] = function(write) {
          return function LOG() {
            const ts = opts.timestamp();
            const args = new Array(arguments.length);
            const proto = Object.getPrototypeOf && Object.getPrototypeOf(this) === _console ? _console : this;
            for (var i = 0; i < args.length; i++)
              args[i] = arguments[i];
            if (opts.serialize && !opts.asObject) {
              applySerializers(args, this._serialize, this.serializers, this._stdErrSerialize);
            }
            if (opts.asObject)
              write.call(proto, asObject(this, level, args, ts));
            else
              write.apply(proto, args);
            if (opts.transmit) {
              const transmitLevel = opts.transmit.level || logger2.level;
              const transmitValue = pino2.levels.values[transmitLevel];
              const methodValue = pino2.levels.values[level];
              if (methodValue < transmitValue)
                return;
              transmit(this, {
                ts,
                methodLevel: level,
                methodValue,
                transmitLevel,
                transmitValue: pino2.levels.values[opts.transmit.level || logger2.level],
                send: opts.transmit.send,
                val: logger2.levelVal
              }, args);
            }
          };
        }(logger2[level]);
      }
      function asObject(logger2, level, args, ts) {
        if (logger2._serialize)
          applySerializers(args, logger2._serialize, logger2.serializers, logger2._stdErrSerialize);
        const argsCloned = args.slice();
        let msg = argsCloned[0];
        const o = {};
        if (ts) {
          o.time = ts;
        }
        o.level = pino2.levels.values[level];
        let lvl = (logger2._childLevel | 0) + 1;
        if (lvl < 1)
          lvl = 1;
        if (msg !== null && typeof msg === "object") {
          while (lvl-- && typeof argsCloned[0] === "object") {
            Object.assign(o, argsCloned.shift());
          }
          msg = argsCloned.length ? format(argsCloned.shift(), argsCloned) : void 0;
        } else if (typeof msg === "string")
          msg = format(argsCloned.shift(), argsCloned);
        if (msg !== void 0)
          o.msg = msg;
        return o;
      }
      function applySerializers(args, serialize, serializers, stdErrSerialize) {
        for (const i in args) {
          if (stdErrSerialize && args[i] instanceof Error) {
            args[i] = pino2.stdSerializers.err(args[i]);
          } else if (typeof args[i] === "object" && !Array.isArray(args[i])) {
            for (const k in args[i]) {
              if (serialize && serialize.indexOf(k) > -1 && k in serializers) {
                args[i][k] = serializers[k](args[i][k]);
              }
            }
          }
        }
      }
      function bind(parent, bindings, level) {
        return function() {
          const args = new Array(1 + arguments.length);
          args[0] = bindings;
          for (var i = 1; i < args.length; i++) {
            args[i] = arguments[i - 1];
          }
          return parent[level].apply(this, args);
        };
      }
      function transmit(logger2, opts, args) {
        const send = opts.send;
        const ts = opts.ts;
        const methodLevel = opts.methodLevel;
        const methodValue = opts.methodValue;
        const val = opts.val;
        const bindings = logger2._logEvent.bindings;
        applySerializers(args, logger2._serialize || Object.keys(logger2.serializers), logger2.serializers, logger2._stdErrSerialize === void 0 ? true : logger2._stdErrSerialize);
        logger2._logEvent.ts = ts;
        logger2._logEvent.messages = args.filter(function(arg) {
          return bindings.indexOf(arg) === -1;
        });
        logger2._logEvent.level.label = methodLevel;
        logger2._logEvent.level.value = methodValue;
        send(methodLevel, logger2._logEvent, val);
        logger2._logEvent = createLogEventShape(bindings);
      }
      function createLogEventShape(bindings) {
        return {
          ts: 0,
          messages: [],
          bindings: bindings || [],
          level: { label: "", value: 0 }
        };
      }
      function asErrValue(err) {
        const obj = {
          type: err.constructor.name,
          msg: err.message,
          stack: err.stack
        };
        for (const key in err) {
          if (obj[key] === void 0) {
            obj[key] = err[key];
          }
        }
        return obj;
      }
      function getTimeFunction(opts) {
        if (typeof opts.timestamp === "function") {
          return opts.timestamp;
        }
        if (opts.timestamp === false) {
          return nullTime;
        }
        return epochTime;
      }
      function mock() {
        return {};
      }
      function passthrough(a) {
        return a;
      }
      function noop() {
      }
      function nullTime() {
        return false;
      }
      function epochTime() {
        return Date.now();
      }
      function unixTime() {
        return Math.round(Date.now() / 1e3);
      }
      function isoTime() {
        return new Date(Date.now()).toISOString();
      }
      function pfGlobalThisOrFallback() {
        function defd(o) {
          return typeof o !== "undefined" && o;
        }
        try {
          if (typeof globalThis !== "undefined")
            return globalThis;
          Object.defineProperty(Object.prototype, "globalThis", {
            get: function() {
              delete Object.prototype.globalThis;
              return this.globalThis = this;
            },
            configurable: true
          });
          return globalThis;
        } catch (e) {
          return defd(self) || defd(window) || defd(this) || {};
        }
      }
    }
  });

  // src/index.ts
  var import_pino = __toModule(require_browser());
  var defaultEventCallback = (event) => {
    logger.debug({ event }, globalName);
  };
  var installCallback = (event) => {
    logger.debug({ event }, globalName);
    self.skipWaiting();
  };
  var logger = (0, import_pino.default)({
    browser: { asObject: true },
    level: "debug",
    name: "service-worker-global-scope",
    timestamp: import_pino.default.stdTimeFunctions.isoTime
  });
  var { name: globalName } = self.constructor;
  self.addEventListener("install", installCallback);
  self.addEventListener("activate", defaultEventCallback);
  self.addEventListener("contentdelete", defaultEventCallback);
  self.addEventListener("fetch", defaultEventCallback);
  self.addEventListener("message", defaultEventCallback);
  self.addEventListener("notificationclick", defaultEventCallback);
  self.addEventListener("notificationclose", defaultEventCallback);
  self.addEventListener("sync", defaultEventCallback);
  self.addEventListener("periodicsync", defaultEventCallback);
  self.addEventListener("push", defaultEventCallback);
  self.addEventListener("pushsubscriptionchange", defaultEventCallback);
})();
