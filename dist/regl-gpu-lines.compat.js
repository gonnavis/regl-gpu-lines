(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.reglLines = factory());
})(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var CAP_START = 0;
  var CAP_END = 1;
  var CAP_SHORT = 2;
  var require$$5 = {
  	CAP_START: CAP_START,
  	CAP_END: CAP_END,
  	CAP_SHORT: CAP_SHORT
  };

  var ORIENTATION$2 = require$$5;
  var drawSegment = createDrawSegmentCommand;

  function createDrawSegmentCommand(isRound, isEndpoints, _ref) {
    var regl = _ref.regl,
        meta = _ref.meta,
        frag = _ref.frag,
        segmentSpec = _ref.segmentSpec,
        endpointSpec = _ref.endpointSpec,
        indexAttributes = _ref.indexAttributes,
        insertCaps = _ref.insertCaps,
        debug = _ref.debug;
    var spec = isEndpoints ? endpointSpec : segmentSpec;
    var verts = ['B', 'C', 'D'];
    if (!isEndpoints) verts.unshift('A');
    return regl({
      vert: "".concat(meta.glsl, "\nconst float CAP_START = ").concat(ORIENTATION$2.CAP_START, ".0;\nconst float CAP_END = ").concat(ORIENTATION$2.CAP_END, ".0;\n\n").concat(spec.glsl, "\n\nattribute float index;\n").concat(debug ? 'attribute float debugInstanceID;' : '', "\n\nuniform vec3 joinRes;\nuniform vec2 resolution, capScale;\nuniform float miterLimit;\n").concat(meta.orientation || !isEndpoints ? '' : 'uniform float orientation;', "\n\nvarying vec2 lineCoord;\nvarying float dir;\n").concat(debug ? 'varying vec2 triStripCoord;' : '', "\n").concat(debug ? 'varying float instanceID;' : '', "\n\nbool isnan(float val) {\n  return (val < 0.0 || 0.0 < val || val == 0.0) ? false : true;\n}\n\nbool invalid(vec4 p) {\n  return p.w == 0.0 || isnan(p.x);\n}\n\nconst bool isRound = ").concat(isRound ? 'true' : 'false', ";\nconst float pi = 3.141592653589793;\n\nvoid main() {\n  lineCoord = vec2(0);\n\n  ").concat(debug ? "instanceID = ".concat(isEndpoints ? '-1.0' : 'debugInstanceID', ";") : '', "\n  ").concat(debug ? 'triStripCoord = vec2(floor(index / 2.0), mod(index, 2.0));' : '', "\n\n  ").concat(verts.map(function (vert) {
        return "vec4 p".concat(vert, " = ").concat(meta.position.generate(vert), ";");
      }).join('\n'), "\n\n  // Check for invalid vertices\n  if (invalid(pB) || invalid(pC)").concat(insertCaps ? '' : "".concat(isEndpoints ? '' : '|| invalid(pA)', " || invalid(pD)"), ") {\n    gl_Position = vec4(1,1,1,0);\n    return;\n  }\n\n  // If we're past the first half-join and half of the segment, then we swap all vertices and start\n  // over from the opposite end.\n  bool isMirrored = index > joinRes.x * 2.0 + 3.0;\n\n  // Convert to screen-pixel coordinates\n  // Save w so we can perspective re-multiply at the end to get varyings depth-correct\n  float pw = isMirrored ? pC.w : pB.w;\n  ").concat(verts.map(function (v) {
        return "p".concat(v, " = vec4(vec3(p").concat(v, ".xy * resolution, p").concat(v, ".z) / p").concat(v, ".w, 1);");
      }).join('\n'), "\n\n  // If it's a cap, mirror A back onto C to accomplish a round\n  ").concat(isEndpoints ? "vec4 pA = pC;" : '', "\n\n  vec2 res = isMirrored ? joinRes.yx : joinRes.xy;\n\n  float mirrorSign = isMirrored ? -1.0 : 1.0;\n  if (isMirrored) {\n    vec4 tmp;\n    tmp = pC; pC = pB; pB = tmp;\n    tmp = pD; pD = pA; pA = tmp;\n  }\n\n  ").concat(isEndpoints ? "bool isCap = !isMirrored;" : "bool isCap = false;", ";\n\n  if (invalid(pA)) { pA = pC; isCap = true; }\n  if (invalid(pD)) { pD = pB; }\n\n  float width = isMirrored ? ").concat(meta.width.generate('C'), " : ").concat(meta.width.generate('B'), ";\n\n  // Invalidate triangles too far in front of or behind the camera plane\n  if (max(abs(pB.z), abs(pC.z)) > 1.0) {\n    gl_Position = vec4(1,1,1,0);\n    return;\n  }\n\n  // Tangent and normal vectors\n  vec2 tBC = pC.xy - pB.xy;\n  float lBC = length(tBC);\n  tBC /= lBC;\n  vec2 nBC = vec2(-tBC.y, tBC.x);\n\n  vec2 tAB = pB.xy - pA.xy;\n  float lAB = length(tAB);\n  if (lAB > 0.0) tAB /= lAB;\n  vec2 nAB = vec2(-tAB.y, tAB.x);\n\n  vec2 tCD = pD.xy - pC.xy;\n  float lCD = length(tCD);\n  if (lCD > 0.0) tCD /= lCD;\n  vec2 nCD = vec2(-tCD.y, tCD.x);\n\n  float cosB = clamp(dot(tAB, tBC), -1.0, 1.0);\n\n  // This section is very fragile. When lines are collinear, signs flip randomly and break orientation\n  // of the middle segment. The fix appears straightforward, but this took a few hours to get right.\n  const float tol = 1e-4;\n  float dirB = -dot(tBC, nAB);\n  float dirC = dot(tBC, nCD);\n  bool bCollinear = abs(dirB) < tol;\n  bool cCollinear = abs(dirC) < tol;\n  bool bIsHairpin = bCollinear && cosB < 0.0;\n  bool cIsHairpin = cCollinear && dot(tBC, tCD) < 0.0;\n  dirB = bCollinear ? -mirrorSign : sign(dirB);\n  dirC = cCollinear ? -mirrorSign : sign(dirC);\n\n  vec2 miter = bIsHairpin ? -tBC : 0.5 * (nAB + nBC) * dirB;\n\n  // The second half of the triangle strip instance is just the first, reversed, and with vertices swapped!\n  float i = index < 2.0 * joinRes.x + 4.0 ? index : 2.0 * (res.x + res.y) + 5.0 - index;\n\n  // Chop off the join to get at the segment part index\n  float iSeg = i - 2.0 * res.x;\n\n  // After the first half-join, repeat two vertices of the segment strip in order to get the orientation correct\n  // for the next join. These are wasted vertices, but they enable using a triangle strip. for two joins which\n  // might be oriented differently.\n  if (iSeg > 1.0 && iSeg <= 3.0) {\n    iSeg -= 2.0;\n    if (dirB * dirC >= 0.0) iSeg += iSeg == 0.0 ? 1.0 : -1.0;\n  }\n\n  vec2 xBasis = tBC;\n  vec2 yBasis = nBC * dirB;\n  vec2 xy = vec2(0, 1);\n\n  lineCoord.y = dirB * mirrorSign;\n\n  // Adjustment of B-C varying due to vertex offsets\n  float dC = 0.0;\n\n  if (iSeg < 0.0) {\n    // Draw half of a join\n    float m2 = dot(miter, miter);\n    float lm = length(miter);\n    yBasis = miter / lm;\n    bool isBevel = 1.0 > miterLimit * m2;\n\n    if (mod(i, 2.0) == 0.0) {\n      // Outer joint points\n      if (isRound || isCap) {\n        // Round joins\n        xBasis = dirB * vec2(yBasis.y, -yBasis.x);\n        float divisor = ").concat(isEndpoints ? 'res.x' : 'min(res.x, isCap ? joinRes.z : res.x)', " * 2.0;\n        //\n        float theta = -0.5 * (acos(cosB) * (min(i, divisor) / divisor) - pi) * (isCap ? 2.0 : 1.0);\n        xy = vec2(cos(theta), sin(theta));\n\n        if (isCap) {\n          if (xy.y > 0.5) xy *= capScale;\n          lineCoord = xy.yx * lineCoord.y;\n        }\n      } else {\n        // Miter joins\n        yBasis = bIsHairpin ? vec2(0) : miter;\n        if (!isBevel) xy.y /= m2;\n        dC += dot(tBC * mirrorSign, miter);\n      }\n    } else {\n      // Repeat vertex B to create a triangle fan\n      lineCoord.y = 0.0;\n      xy = vec2(0);\n\n      // Offset the center vertex position to get bevel SDF correct\n      if (!isRound && isBevel && !isCap) {\n        xy.y = -1.0 + sqrt((1.0 + cosB) * 0.5);\n        dC += dot(tBC * mirrorSign, miter / lm) * xy.y;\n      }\n    }\n  //} else if (iSeg == 0.0) { // No op: vertex B + line B-C normal\n  } else if (iSeg > 0.0) {\n    // vertex B + inner miter\n    lineCoord.y = -lineCoord.y;\n\n    float miterExt = 0.0;\n    if (cosB > -0.9999) {\n      float sinB = tAB.x * tBC.y - tAB.y * tBC.x;\n      miterExt = sinB / (1.0 + cosB);\n    }\n    float m = abs(miterExt);\n    m = min(m, min(lBC, lAB) / width);\n    xy = vec2(m, -1);\n    dC += xy.x * mirrorSign;\n  }\n\n  ").concat(isEndpoints ? "float orientation = ".concat(meta.orientation ? meta.orientation.generate('') : 'mod(orientation,2.0)', ";") : '', ";\n  ").concat(isEndpoints ? "if (orientation == CAP_END) lineCoord = -lineCoord;" : '', "\n\n  float useC = (isMirrored ? 1.0 : 0.0) + dC * (width / lBC);\n  ").concat(_toConsumableArray(meta.varyings.values()).map(function (varying) {
        return varying.generate('useC', 'B', 'C');
      }).join('\n'), "\n\n  gl_Position = pB;\n  gl_Position.xy += width * (mat2(xBasis, yBasis) * xy);\n  gl_Position.xy /= resolution;\n  gl_Position *= pw;\n}"),
      frag: frag,
      attributes: _objectSpread2(_objectSpread2({}, indexAttributes), spec.attrs),
      uniforms: {
        joinRes: function joinRes(ctx, props) {
          return [// First half-join is actually a cap if we're drawing endpoints
          isEndpoints ? props.capResolution : props.joinResolution, // Second half-join is always a join
          props.joinResolution, // The resolution of inserted caps
          props.capType === 'square' ? props.capResolution : props.capType === 'none' ? 0 : props.joinResolution];
        },
        miterLimit: function miterLimit(ctx, props) {
          return props.miterLimit * props.miterLimit;
        },
        orientation: regl.prop('orientation'),
        capScale: regl.prop('capScale')
      },
      primitive: 'triangle strip',
      instances: isEndpoints ? function (ctx, props) {
        return props.splitCaps ? props.orientation === ORIENTATION$2.CAP_START ? Math.ceil(props.count / 2) : Math.floor(props.count / 2) : props.count;
      } : function (ctx, props) {
        return props.count - 3;
      },
      count: isRound ? function (ctx, props) {
        return 6 + 2 * (props.joinResolution + (isEndpoints ? props.capResolution : props.joinResolution));
      } : function (ctx, props) {
        return 6 + 2 * (1 + (isEndpoints ? props.capResolution : 1)) + 10;
      }
    });
  }

  var attrUsage = {
    NONE: 0,
    REGULAR: 1,
    EXTENDED: 2,
    PER_INSTANCE: 4
  };

  var ATTR_USAGE$1 = attrUsage;
  var parsePragmas = parseShaderPragmas$1;
  var PRAGMA_REGEX = /^\s*#pragma\s+lines\s*:\s*([^;]*);?$/i;
  var ATTRIBUTE_REGEX = /^\s*attribute\s+(float|vec2|vec3|vec4)\s+([\w\d_]+)\s*$/i;
  var PROPERTY_REGEX = /^\s*(position|width|orientation)\s+=\s+([\w\d_]+)\s*\(([^)]*)\)\s*$/i;
  var VARYING_REGEX = /^\s*varying\s+(float|vec2|vec3|vec4)\s+([\w\d_]+)\s*=\s*([\w\d_]+)\(([^)]*)\)\s*$/;
  var DIMENSION_GLSL_TYPES = {
    "float": 1,
    "vec2": 2,
    "vec3": 3,
    "vec4": 4
  };

  function parseShaderPragmas$1(glsl) {
    var pragmas = [];
    var lines = glsl.split('\n');

    for (var i = 0; i < lines.length; i++) {
      lines[i] = lines[i].replace(PRAGMA_REGEX, function (match, pragma) {
        pragmas.push(parsePragma(pragma));
        return '';
      });
    }

    return _objectSpread2({
      glsl: lines.join('\n').trim()
    }, analyzePragmas(pragmas));
  }

  function parsePragma(pragma) {
    pragma = pragma.trim();
    var match;

    if (match = pragma.match(ATTRIBUTE_REGEX)) {
      var dimension = DIMENSION_GLSL_TYPES[match[1]];
      var name = match[2];
      return {
        type: 'attribute',
        dimension: dimension,
        name: name
      };
    } else if (match = pragma.match(PROPERTY_REGEX)) {
      var property = match[1];
      var returnType = {
        width: 'float',
        position: 'vec4',
        orientation: 'bool'
      }[property];
      var _name = match[2];
      var inputs = match[3].split(',').map(function (str) {
        return str.trim();
      }).filter(function (x) {
        return !!x;
      });

      var generate = function generate(label, prefix) {
        return "".concat(_name, "(").concat(inputs.map(function (input) {
          return (prefix || '') + input + label;
        }).join(', '), ")");
      };

      return {
        type: 'property',
        property: property,
        returnType: returnType,
        name: _name,
        inputs: inputs,
        generate: generate
      };
    } else if (match = pragma.match(VARYING_REGEX)) {
      var _returnType = match[1];
      var _name2 = match[2];
      var getter = match[3];

      var _inputs = match[4].split(',').map(function (str) {
        return str.trim();
      }).filter(function (x) {
        return !!x;
      });

      var _generate = function _generate(interp, a, b) {
        return "".concat(_name2, " = ").concat(getter, "(").concat(_inputs.map(function (input) {
          return "mix(".concat(input + a, ", ").concat(input + b, ", ").concat(interp, ")");
        }).join(', '), ");");
      };

      return {
        type: 'varying',
        returnType: _returnType,
        name: _name2,
        getter: getter,
        inputs: _inputs,
        generate: _generate
      };
    } else {
      throw new Error("Unrecognized lines pragma: \"".concat(pragma, "\""));
    }
  }

  function analyzePragmas(pragmas) {
    var attrs = new Map();
    var varyings = new Map();

    var _iterator = _createForOfIteratorHelper(pragmas),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var pragma = _step.value;

        if (pragma.type === 'attribute') {
          attrs.set(pragma.name, pragma);
          pragma.vertexUsage = ATTR_USAGE$1.NONE;
          pragma.endpointUsage = ATTR_USAGE$1.NONE;
        } else if (pragma.type === 'varying') {
          varyings.set(pragma.name, pragma);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var width, position, orientation;

    var _iterator2 = _createForOfIteratorHelper(pragmas),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _pragma = _step2.value;
        if (_pragma.type !== 'property') continue;

        switch (_pragma.property) {
          case 'width':
            if (width) throw new Error("Unexpected duplicate pragma for property \"".concat(_pragma.property, "\""));
            width = _pragma;
            break;

          case 'position':
            if (position) throw new Error("Unexpected duplicate pragma for property \"".concat(_pragma.property, "\""));
            position = _pragma;
            break;

          case 'orientation':
            if (orientation) throw new Error("Unexpected duplicate pragma for property \"".concat(_pragma.property, "\""));
            orientation = _pragma;
            break;

          default:
            throw new Error("Invalid pragma property \"".concat(_pragma.property, "\""));
        }

        var _iterator4 = _createForOfIteratorHelper(_pragma.inputs),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var input = _step4.value;
            if (!attrs.has(input)) throw new Error("Missing attribute ".concat(input, " of property ").concat(_pragma.property));
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    var _iterator3 = _createForOfIteratorHelper(pragmas),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _pragma2 = _step3.value;
        if (!_pragma2.inputs) continue;

        var _iterator5 = _createForOfIteratorHelper(_pragma2.inputs),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var _input = _step5.value;
            var inputAttr = attrs.get(_input);

            if (_pragma2.type === 'property' || _pragma2.type === 'varying') {
              if (_pragma2.property === 'position') {
                inputAttr.vertexUsage |= ATTR_USAGE$1.EXTENDED;
                inputAttr.endpointUsage |= ATTR_USAGE$1.EXTENDED;
              } else if (_pragma2.property === 'orientation') {
                inputAttr.endpointUsage |= ATTR_USAGE$1.PER_INSTANCE;
              } else {
                inputAttr.endpointUsage |= ATTR_USAGE$1.REGULAR;
                inputAttr.vertexUsage |= ATTR_USAGE$1.REGULAR;
              }
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    return {
      varyings: varyings,
      attrs: attrs,
      width: width,
      position: position,
      orientation: orientation
    };
  }

  var DTYPES_SIZES = [];
  DTYPES_SIZES[5120] = 1; // int8

  DTYPES_SIZES[5122] = 2; // int16

  DTYPES_SIZES[5124] = 4; // int32

  DTYPES_SIZES[5121] = 1; // uint8

  DTYPES_SIZES[5123] = 2; // uint16

  DTYPES_SIZES[5125] = 4; // uint32

  DTYPES_SIZES[5126] = 4; // float32

  var dtypesizes = DTYPES_SIZES;

  var int8 = 5120;
  var int16 = 5122;
  var int32 = 5124;
  var uint8 = 5121;
  var uint16 = 5123;
  var uint32 = 5125;
  var float = 5126;
  var float32 = 5126;
  var require$$1 = {
  	int8: int8,
  	int16: int16,
  	int32: int32,
  	uint8: uint8,
  	uint16: uint16,
  	uint32: uint32,
  	float: float,
  	float32: float32
  };

  var sanitizeBuffer = sanitizeBufferInput;
  var DTYPE_SIZES = dtypesizes;
  var DTYPES = require$$1;

  function has(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  } // This function is run on every draw call in order to sanitize and configure the data layout


  function sanitizeBufferInput(metadata, buffersObj, isEndpoints) {
    var outputs = {};
    if (!buffersObj) return outputs;

    var _iterator = _createForOfIteratorHelper(metadata.attrs),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
            attrName = _step$value[0],
            attrMeta = _step$value[1];

        var input = buffersObj[attrName];
        var usage = isEndpoints ? attrMeta.endpointUsage : attrMeta.vertexUsage;
        if (!usage) continue;
        var output = {
          buffer: null,
          dimension: attrMeta.dimension,
          offset: 0,
          type: NaN,
          stride: NaN,
          divisor: 1,
          bytesPerElement: NaN
        };

        if (!input) {
          throw new Error("Missing buffer for ".concat(isEndpoints ? 'endpoint' : 'vertex', " attribute '").concat(attrName, "'"));
        } else if (input._reglType === 'buffer') {
          output.buffer = input;
          output.type = output.buffer._buffer.dtype;
        } else if (input.buffer._reglType === 'buffer') {
          output.buffer = input.buffer;

          if (has(input, 'dimension') && input.dimension !== output.dimension) {
            throw new Error("Size of attribute (".concat(input.dimension, ") does not match dimension specified in shader pragma (").concat(attrMeta.dimension, ")"));
          }

          if (has(input, 'offset')) output.offset = input.offset;

          if (has(input, 'type')) {
            output.type = DTYPES[input.type];
          } else {
            output.type = output.buffer._buffer.dtype;
          }

          if (has(input, 'divisor')) {
            output.divisor = input.divisor;
          }

          if (has(input, 'stride')) output.stride = input.stride;
        } else {
          throw new Error("Invalid buffer for attribute '".concat(attrName, "'"));
        }

        output.bytesPerElement = DTYPE_SIZES[output.type];

        if (Number.isNaN(output.stride)) {
          output.stride = output.bytesPerElement * attrMeta.dimension;
        }

        outputs[attrName] = output;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return outputs;
  }

  var GLSL_TYPES$1 = [];
  GLSL_TYPES$1[1] = 'float';
  GLSL_TYPES$1[2] = 'vec2';
  GLSL_TYPES$1[3] = 'vec3';
  GLSL_TYPES$1[4] = 'vec4';
  var glsltypes = GLSL_TYPES$1;

  var createAttrSpec$1 = createAttrSpecs;
  var ATTR_USAGE = attrUsage;
  var GLSL_TYPES = glsltypes;
  var ORIENTATION$1 = require$$5; // This function returns regl props, used for constructing the attribute layout regl accessors
  // and corresponding GLSL up front.

  function createAttrSpecs(meta, regl, isEndpoints) {
    var suffixes = isEndpoints ? ['B', 'C', 'D'] : ['A', 'B', 'C', 'D'];
    var attrLines = [];
    var attrSpecs = {};
    meta.attrs.forEach(function (attr, attrName) {
      var usage = isEndpoints ? attr.endpointUsage : attr.vertexUsage;
      if (!usage) return;
      var attrList = [];

      function emitAttr(index, suffix) {
        var attrOutName = attrName + suffix;
        attrList.push(attrOutName);

        if (isEndpoints) {
          var instanceStride = usage & ATTR_USAGE.PER_INSTANCE ? 1 : 3;
          attrSpecs[attrOutName] = {
            buffer: regl.prop("buffers.".concat(attrName, ".buffer")),
            offset: function offset(ctx, props) {
              return props.buffers[attrName].offset + props.buffers[attrName].stride * ((props.orientation === ORIENTATION$1.CAP_START || !props.splitCaps ? 0 : 3) + index);
            },
            stride: function stride(ctx, props) {
              return props.buffers[attrName].stride * instanceStride * (props.splitCaps ? 2 : 1);
            },
            divisor: function divisor(ctx, props) {
              return props.buffers[attrName].divisor;
            }
          };
        } else {
          attrSpecs[attrOutName] = {
            buffer: regl.prop("buffers.".concat(attrName, ".buffer")),
            offset: function offset(ctx, props) {
              return props.buffers[attrName].offset + props.buffers[attrName].stride * index;
            },
            stride: function stride(ctx, props) {
              return props.buffers[attrName].stride;
            },
            divisor: function divisor(ctx, props) {
              return props.buffers[attrName].divisor;
            }
          };
        }
      }

      if (usage & ATTR_USAGE.PER_INSTANCE) {
        emitAttr(0, '');
      }

      if (usage & ATTR_USAGE.REGULAR || usage & ATTR_USAGE.EXTENDED) {
        for (var i = 0; i < suffixes.length; i++) {
          var suffix = suffixes[i];
          if (!(usage & ATTR_USAGE.EXTENDED) && (suffix === 'D' || suffix === 'A')) continue;
          emitAttr(i, suffix);
        }
      }

      attrLines.push("attribute ".concat(GLSL_TYPES[attr.dimension], " ").concat(attrList.join(', '), ";"));
    });
    meta.varyings.forEach(function (varying, varyingName) {
      attrLines.push("varying ".concat(varying.returnType, " ").concat(varyingName, ";"));
    });
    return {
      glsl: attrLines.join('\n'),
      attrs: attrSpecs
    };
  }

  var sanitizeInList = function createSanitizer(label, list, dflt) {
    return function sanitizeValue(value) {
      if (!value) return dflt;

      if (list.indexOf(value) === -1) {
        throw new Error("Invalid ".concat(label, " type. Valid options are: ").concat(list.join(', '), "."));
      }

      return value;
    };
  };

  var createDrawSegment = drawSegment;
  var parseShaderPragmas = parsePragmas;
  var sanitizeBufferInputs = sanitizeBuffer;
  var createAttrSpec = createAttrSpec$1;
  var sanitizeInclusionInList = sanitizeInList;
  var ORIENTATION = require$$5;
  var src = reglLines;
  reglLines.CAP_START = ORIENTATION.CAP_START;
  reglLines.CAP_END = ORIENTATION.CAP_END;
  var FORBIDDEN_REGL_PROPS = new Set(['count', 'instances', 'attributes', 'elements']);
  var VALID_JOIN_TYPES = ['round', 'bevel', 'miter'];
  var VALID_CAP_TYPES = ['round', 'square', 'none'];
  var ROUND_CAP_SCALE = [1, 1];
  var SQUARE_CAP_SCALE = [2, 2 / Math.sqrt(3)];
  var MAX_ROUND_JOIN_RESOLUTION = 30;
  var MAX_DEBUG_VERTICES = 16384;

  function reglLines(regl) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _opts$vert = opts.vert,
        vert = _opts$vert === void 0 ? null : _opts$vert,
        _opts$frag = opts.frag,
        frag = _opts$frag === void 0 ? null : _opts$frag,
        _opts$debug = opts.debug,
        debug = _opts$debug === void 0 ? false : _opts$debug,
        _opts$insertCaps = opts.insertCaps,
        insertCaps = _opts$insertCaps === void 0 ? false : _opts$insertCaps; // Forward all regl parameters except for vert and frag along to regl.

    var forwardedCmdConfig = _objectSpread2({}, opts);

    for (var _i = 0, _arr = ['vert', 'frag', 'debug', 'insertCaps']; _i < _arr.length; _i++) {
      var prop = _arr[_i];
      delete forwardedCmdConfig[prop];
    }

    var forwarded = Object.keys(forwardedCmdConfig);
    var canReorder = forwarded.length === 0;
    forwarded.forEach(function (fwd) {
      if (FORBIDDEN_REGL_PROPS.has(fwd)) {
        throw new Error("Invalid parameter '".concat(fwd, "'. Parameters ").concat(_toConsumableArray(FORBIDDEN_REGL_PROPS).map(function (p) {
          return "'".concat(p, "'");
        }).join(', '), " may not be forwarded to regl."));
      }
    });
    if (!vert) throw new Error('Missing vertex shader, `vert`');
    if (!frag) throw new Error('Missing fragment shader, `frag`');
    var meta = parseShaderPragmas(vert);
    var segmentSpec = createAttrSpec(meta, regl, false);
    var endpointSpec = createAttrSpec(meta, regl, true);
    var setResolution = regl({
      uniforms: {
        resolution: function resolution(ctx) {
          return [ctx.viewportWidth, ctx.viewportHeight];
        }
      }
    });
    var userConfig = canReorder ? function (props, cb) {
      return cb();
    } : regl(forwardedCmdConfig);
    var indexAttributes = {};

    if (debug) {
      // TODO: Allocate/grow lazily to avoid an arbitrary limit
      indexAttributes.debugInstanceID = {
        buffer: regl.buffer(new Uint16Array(_toConsumableArray(Array(MAX_DEBUG_VERTICES).keys()))),
        divisor: 1
      };
    }

    indexAttributes.index = {
      buffer: regl.buffer(new Int8Array(_toConsumableArray(Array(MAX_ROUND_JOIN_RESOLUTION * 6 + 4).keys()))),
      divisor: 0
    }; // Instantiate commands

    var config = {
      regl: regl,
      meta: meta,
      segmentSpec: segmentSpec,
      endpointSpec: endpointSpec,
      frag: frag,
      indexAttributes: indexAttributes,
      debug: debug,
      insertCaps: insertCaps
    };
    var drawMiterSegment = createDrawSegment(false, false, config);
    var drawRoundedSegment = createDrawSegment(true, false, config);
    var drawMiterCap = createDrawSegment(false, true, config);
    var drawRoundedCap = createDrawSegment(true, true, config);
    var sanitizeJoinType = sanitizeInclusionInList('join', VALID_JOIN_TYPES, 'miter');
    var sanitizeCapType = sanitizeInclusionInList('cap', VALID_CAP_TYPES, 'square');
    var allRoundedSegments = [];
    var allRoundedCaps = [];
    var allMiterSegments = [];
    var allMiterCaps = [];

    function flush(props) {
      userConfig(props, function () {
        if (allRoundedSegments.length) drawRoundedSegment(allRoundedSegments);
        if (allMiterSegments.length) drawMiterSegment(allMiterSegments);
        if (allRoundedCaps.length) drawRoundedCap(allRoundedCaps);
        if (allMiterCaps.length) drawMiterCap(allMiterCaps);
        allRoundedSegments.length = 0;
        allMiterSegments.length = 0;
        allRoundedCaps.length = 0;
        allMiterCaps.length = 0;
      });
    }

    return function drawLines(props) {
      if (!props) return;
      var isArrayProps = Array.isArray(props);
      if (!isArrayProps) props = [props];
      var reorder = canReorder && !isArrayProps;
      setResolution(function () {
        var _iterator = _createForOfIteratorHelper(props),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var lineProps = _step.value;
            var joinType = sanitizeJoinType(lineProps.join);
            var capType = sanitizeCapType(lineProps.cap);
            var capResolution = lineProps.capResolution === undefined ? 12 : lineProps.capResolution;

            if (capType === 'square') {
              capResolution = 3;
            } else if (capType === 'none') {
              capResolution = 1;
            }

            var joinResolution = 1;
            if (joinType === 'round') joinResolution = lineProps.joinResolution === undefined ? 8 : lineProps.joinResolution;
            var miterLimit = joinType === 'bevel' ? 1 : lineProps.miterLimit === undefined ? 4 : lineProps.miterLimit;
            var capScale = capType === 'square' ? SQUARE_CAP_SCALE : ROUND_CAP_SCALE;
            var sharedProps = {
              joinResolution: joinResolution,
              capResolution: capResolution,
              capScale: capScale,
              capType: capType,
              miterLimit: miterLimit
            };

            if (lineProps.endpointAttributes && lineProps.endpointCount) {
              var endpointProps = _objectSpread2({
                buffers: sanitizeBufferInputs(meta, lineProps.endpointAttributes, true),
                count: lineProps.endpointCount
              }, sharedProps);

              var endpointDst = joinType === 'round' ? allRoundedCaps : allMiterCaps;

              if (meta.orientation) {
                endpointDst.push(_objectSpread2(_objectSpread2({}, endpointProps), {}, {
                  splitCaps: false
                }));
              } else {
                endpointDst.push(_objectSpread2(_objectSpread2({}, endpointProps), {}, {
                  orientation: ORIENTATION.CAP_START,
                  splitCaps: true
                }), _objectSpread2(_objectSpread2({}, endpointProps), {}, {
                  orientation: ORIENTATION.CAP_END,
                  splitCaps: true
                }));
              }
            }

            if (lineProps.vertexAttributes && lineProps.vertexCount) {
              var segmentDst = joinType === 'round' ? allRoundedSegments : allMiterSegments;
              segmentDst.push(_objectSpread2({
                buffers: sanitizeBufferInputs(meta, lineProps.vertexAttributes, false),
                count: lineProps.vertexCount
              }, sharedProps));
            }

            if (!reorder) flush(lineProps);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        if (reorder) flush(props);
      });
    };
  }

  return src;

}));
