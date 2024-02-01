"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deserialize = deserialize;
exports.serialize = serialize;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * Serialize React element to JSON string
 *
 * @param {ReactNode} element
 * @returns {string}
 */
function serialize(element) {
  var replacer = function replacer(key, value) {
    switch (key) {
      case "_owner":
      case "_store":
      case "ref":
      case "key":
        return;
      default:
        return value;
    }
  };
  return JSON.stringify(element, replacer);
}

/**
 * Deserialize JSON string to React element
 *
 * @param {string|object} data
 * @param {object?} options
 * @param {object?} options.components
 * @param {function?} options.reviver
 * @returns {ReactNode}
 */
function deserialize(data, options) {
  if (typeof data === "string") {
    data = JSON.parse(data);
  }
  if (data instanceof Object) {
    return deserializeElement(data, options);
  }
  throw new Error("Deserialization error: incorrect data type");
}
function deserializeElement(element) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var key = arguments.length > 2 ? arguments[2] : undefined;
  var _options$components = options.components,
    components = _options$components === void 0 ? {} : _options$components,
    reviver = options.reviver;
  if (_typeof(element) !== "object") {
    return element;
  }
  if (element === null) {
    return element;
  }
  if (element instanceof Array) {
    return element.map(function (el, i) {
      return deserializeElement(el, options, i);
    });
  }

  // Now element has following shape { type: string, props: object }

  var type = element.type,
    props = element.props;
  if (typeof type !== "string") {
    throw new Error("Deserialization error: element type must be string");
  }
  type = components[type] || type.toLowerCase();
  if (props.children) {
    props = _objectSpread(_objectSpread({}, props), {}, {
      children: deserializeElement(props.children, options)
    });
  }
  if (reviver) {
    ;
    var _reviver = reviver(type, props, key, components);
    type = _reviver.type;
    props = _reviver.props;
    key = _reviver.key;
    components = _reviver.components;
  }
  return /*#__PURE__*/_react["default"].createElement(type, _objectSpread(_objectSpread({}, props), {}, {
    key: key
  }));
}