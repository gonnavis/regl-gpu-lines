'use strict';

const ORIENTATION = require('./constants/orientation.json');

module.exports = createDrawSegmentCommand;

function createDrawSegmentCommand(isRound, isEndpoints, {
  regl,
  meta,
  frag,
  segmentSpec,
  endpointSpec,
  indexAttributes,
  insertCaps,
  debug,
}) {
  const spec = isEndpoints ? endpointSpec : segmentSpec;
  const verts = ['B', 'C', 'D'];
  if (!isEndpoints) verts.unshift('A');

  return regl({
    vert: `${meta.glsl}
const float CAP_START = ${ORIENTATION.CAP_START}.0;
const float CAP_END = ${ORIENTATION.CAP_END}.0;

${spec.glsl}

attribute float index;
${debug ? 'attribute float debugInstanceID;' : ''}

uniform vec3 joinRes;
uniform vec2 resolution, capScale;
uniform float miterLimit;
${meta.orientation || !isEndpoints ? '' : 'uniform float orientation;'}

varying vec2 lineCoord;
varying float dir;
${debug ? 'varying vec2 triStripCoord;' : ''}
${debug ? 'varying float instanceID;' : ''}

bool isnan(float val) {
  return (val < 0.0 || 0.0 < val || val == 0.0) ? false : true;
}

bool invalid(vec4 p) {
  return p.w == 0.0 || isnan(p.x);
}

const bool isRound = ${isRound ? 'true' : 'false'};
const float pi = 3.141592653589793;

void main() {
  lineCoord = vec2(0);

  ${debug ? `instanceID = ${isEndpoints ? '-1.0' : 'debugInstanceID'};` : ''}
  ${debug ? 'triStripCoord = vec2(floor(index / 2.0), mod(index, 2.0));' : ''}

  ${verts.map(vert => `vec4 p${vert} = ${meta.position.generate(vert)};`).join('\n')}

  // Check for invalid vertices
  if (invalid(pB) || invalid(pC)${insertCaps ? '' : `${isEndpoints ? '' : '|| invalid(pA)'} || invalid(pD)`}) {
    gl_Position = vec4(1,1,1,0);
    return;
  }

  // If we're past the first half-join and half of the segment, then we swap all vertices and start
  // over from the opposite end.
  bool isMirrored = index > joinRes.x * 2.0 + 3.0;

  // Convert to screen-pixel coordinates
  // Save w so we can perspective re-multiply at the end to get varyings depth-correct
  float pw = isMirrored ? pC.w : pB.w;
  ${verts.map(v => `p${v} = vec4(vec3(p${v}.xy * resolution, p${v}.z) / p${v}.w, 1);`).join('\n')}

  // If it's a cap, mirror A back onto C to accomplish a round
  ${isEndpoints ? `vec4 pA = pC;` : ''}

  vec2 res = isMirrored ? joinRes.yx : joinRes.xy;

  float mirrorSign = isMirrored ? -1.0 : 1.0;
  if (isMirrored) {
    vec4 tmp;
    tmp = pC; pC = pB; pB = tmp;
    tmp = pD; pD = pA; pA = tmp;
  }

  ${isEndpoints ? `bool isCap = !isMirrored;` : `bool isCap = false;`};

  if (invalid(pA)) { pA = pC; isCap = true; }
  if (invalid(pD)) { pD = pB; }

  float width = isMirrored ? ${meta.width.generate('C')} : ${meta.width.generate('B')};

  // Invalidate triangles too far in front of or behind the camera plane
  if (max(abs(pB.z), abs(pC.z)) > 1.0) {
    gl_Position = vec4(1,1,1,0);
    return;
  }

  // Tangent and normal vectors
  vec2 tBC = pC.xy - pB.xy;
  float lBC = length(tBC);
  tBC /= lBC;
  vec2 nBC = vec2(-tBC.y, tBC.x);

  vec2 tAB = pB.xy - pA.xy;
  float lAB = length(tAB);
  if (lAB > 0.0) tAB /= lAB;
  vec2 nAB = vec2(-tAB.y, tAB.x);

  vec2 tCD = pD.xy - pC.xy;
  float lCD = length(tCD);
  if (lCD > 0.0) tCD /= lCD;
  vec2 nCD = vec2(-tCD.y, tCD.x);

  float cosB = clamp(dot(tAB, tBC), -1.0, 1.0);

  // This section is very fragile. When lines are collinear, signs flip randomly and break orientation
  // of the middle segment. The fix appears straightforward, but this took a few hours to get right.
  const float tol = 1e-4;
  float dirB = -dot(tBC, nAB);
  float dirC = dot(tBC, nCD);
  bool bCollinear = abs(dirB) < tol;
  bool cCollinear = abs(dirC) < tol;
  bool bIsHairpin = bCollinear && cosB < 0.0;
  bool cIsHairpin = cCollinear && dot(tBC, tCD) < 0.0;
  dirB = bCollinear ? -mirrorSign : sign(dirB);
  dirC = cCollinear ? -mirrorSign : sign(dirC);

  vec2 miter = bIsHairpin ? -tBC : 0.5 * (nAB + nBC) * dirB;

  // The second half of the triangle strip instance is just the first, reversed, and with vertices swapped!
  float i = index < 2.0 * joinRes.x + 4.0 ? index : 2.0 * (res.x + res.y) + 5.0 - index;

  // Chop off the join to get at the segment part index
  float iSeg = i - 2.0 * res.x;

  // After the first half-join, repeat two vertices of the segment strip in order to get the orientation correct
  // for the next join. These are wasted vertices, but they enable using a triangle strip. for two joins which
  // might be oriented differently.
  if (iSeg > 1.0 && iSeg <= 3.0) {
    iSeg -= 2.0;
    if (dirB * dirC >= 0.0) iSeg += iSeg == 0.0 ? 1.0 : -1.0;
  }

  vec2 xBasis = tBC;
  vec2 yBasis = nBC * dirB;
  vec2 xy = vec2(0, 1);

  lineCoord.y = dirB * mirrorSign;

  // Adjustment of B-C varying due to vertex offsets
  float dC = 0.0;

  if (iSeg < 0.0) {
    // Draw half of a join
    float m2 = dot(miter, miter);
    float lm = length(miter);
    yBasis = miter / lm;
    bool isBevel = 1.0 > miterLimit * m2;

    if (mod(i, 2.0) == 0.0) {
      // Outer joint points
      if (isRound || isCap) {
        // Round joins
        xBasis = dirB * vec2(yBasis.y, -yBasis.x);
        float divisor = ${isEndpoints ? 'res.x' : 'min(res.x, isCap ? joinRes.z : res.x)'} * 2.0;
        //
        float theta = -0.5 * (acos(cosB) * (min(i, divisor) / divisor) - pi) * (isCap ? 2.0 : 1.0);
        xy = vec2(cos(theta), sin(theta));

        if (isCap) {
          if (xy.y > 0.5) xy *= capScale;
          lineCoord = xy.yx * lineCoord.y;
        }
      } else {
        // Miter joins
        yBasis = bIsHairpin ? vec2(0) : miter;
        if (!isBevel) xy.y /= m2;
        dC += dot(tBC * mirrorSign, miter);
      }
    } else {
      // Repeat vertex B to create a triangle fan
      lineCoord.y = 0.0;
      xy = vec2(0);

      // Offset the center vertex position to get bevel SDF correct
      if (!isRound && isBevel && !isCap) {
        xy.y = -1.0 + sqrt((1.0 + cosB) * 0.5);
        dC += dot(tBC * mirrorSign, miter / lm) * xy.y;
      }
    }
  //} else if (iSeg == 0.0) { // No op: vertex B + line B-C normal
  } else if (iSeg > 0.0) {
    // vertex B + inner miter
    lineCoord.y = -lineCoord.y;

    float miterExt = 0.0;
    if (cosB > -0.9999) {
      float sinB = tAB.x * tBC.y - tAB.y * tBC.x;
      miterExt = sinB / (1.0 + cosB);
    }
    float m = abs(miterExt);
    m = min(m, min(lBC, lAB) / width);
    xy = vec2(m, -1);
    dC += xy.x * mirrorSign;
  }

  ${isEndpoints ? `float orientation = ${meta.orientation ? meta.orientation.generate('') : 'mod(orientation,2.0)'};` : ''};
  ${isEndpoints ? `if (orientation == CAP_END) lineCoord = -lineCoord;` : ''}

  float useC = (isMirrored ? 1.0 : 0.0) + dC * (width / lBC);
  ${[...meta.varyings.values()].map(varying => varying.generate('useC', 'B', 'C')).join('\n')}

  gl_Position = pB;
  gl_Position.xy += width * (mat2(xBasis, yBasis) * xy);
  gl_Position.xy /= resolution;
  gl_Position *= pw;
}`,
    frag,
    attributes: {
      ...indexAttributes,
      ...spec.attrs
    },
    uniforms: {
      joinRes: (ctx, props) => [
        // First half-join is actually a cap if we're drawing endpoints
        isEndpoints ? props.capResolution : props.joinResolution,

        // Second half-join is always a join
        props.joinResolution,

        // The resolution of inserted caps
        props.capType === 'square' ? props.capResolution : props.capType === 'none' ? 0 : props.joinResolution,
      ],
      miterLimit: (ctx, props) => props.miterLimit * props.miterLimit,
      orientation: regl.prop('orientation'),
      capScale: regl.prop('capScale'),
    },
    primitive: 'triangle strip',
    instances: isEndpoints
      ? (ctx, props) => props.splitCaps ? (props.orientation === ORIENTATION.CAP_START ? Math.ceil(props.count / 2) : Math.floor(props.count / 2)) : props.count
      : (ctx, props) => props.count - 3,
    count: isRound
      ? (ctx, props) => 6 + 2 * (props.joinResolution + (isEndpoints ? props.capResolution : props.joinResolution))
      : (ctx, props) => 6 + 2 * (1 + (isEndpoints ? props.capResolution : 1)) + 10
  });
}
