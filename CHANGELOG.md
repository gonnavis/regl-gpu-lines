## 0.0.19

- Add `insertCaps` option to be explicit about when caps are automatically inserted
- Switch to preferring `w = 0` instead of `NaN` since `NaN` detection is a bit unreliable in GLSL.

## 0.0.18

### Features

- Now inserts caps when it encounters NaN. With some remaining API cleanup since miters and bevels don't have enough points per instance to build a proper round.

### Bugfixes

- Resolve hairpin and collinear cases!! :tada:

## 0.0.17

### Bugfixes

- Fix debug instance ID

## 0.0.16

### Features

- Almost a complete rewrite. Consolidated everything into a single shader with two switches (round vs. miter, cap vs. interior).
- Line dashes work with both round and miter
- SDF borders now work with round and miter
- Bundle size down to 11kB minified, 4.5kB gzipped

### Limitations

- Degenerate lines which turn 180 degrees are a regression. They sometimes but not always work. A tiny floating point offset will fix things.

## 0.0.15

### Features

- Completely reworked rounded join geometry to split joins down the middle. This makes dashes usable, currently only with rounded joins.
- Improved handling of z-coordinate
- Improved handling of some corner cases, including self-intersecting lines and short segments
- Added tests

## 0.0.14

### Features

- Convert the index attribute into a unit-grid-aligned coordinate for wireframes. This is equivalent but much easier than exploding the triangle strip geometry into individual triangles.

### Bugfixes 

- Republish after botched 0.0.13 publish

## 0.0.12

### Bufixes

- Fix an issue in which varying parameters were not triggering inclusion of their respective attributes.
- Fix custom attribute divisor not set correctly

### Features

- Debugged interleaved attributes. They work great! :tada:
 
## 0.0.11

### Features

- Rename `isstart` to `capOrientation` and change from a boolean to a float. `isstart` seemed unpleasantly asymmetric.  `CAP_START` and `CAP_END` are now exported as constants on the `reglLines` function. In the future this may be used as a bit mask to additionally allow signaling two-vertex lines.
 
### Bugfixes

- Throw errors when attempting to forward `count`, `elements`, `attributes` or `instances` to regl.

## 0.0.10

### Bugfixes

- Fix inner miters to clip to the lesser of the two adjacent segment lengths

## 0.0.9

### Bugfixes

- Remove the minimum-length constraint (was 1/100 pixel) since it sometimes results in missing caps.
- Improved documentation!

## 0.0.8

### Bugfixes

- Fix an issue with using nan or w=0 to split lines into multiple segments

## 0.0.7

Beginning a changelog as the module is starting to stabilize. :tada:

### Features

- It's proving extremely common to implement a regl wrapper with customization that falls outside the scope of this module. This release adds the ability to merge that config with the arguments to this module. It now uses the `vert`, `frag`, and `debug` options and forward all other configuration to a regl wrapper, invoked on each draw.


