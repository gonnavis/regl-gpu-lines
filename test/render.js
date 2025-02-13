const fs = require('fs');
const path = require('path');
const test = require('tape');
const createContext = require('./util/create-context.js');
const createREGL = require('regl/dist/regl.js');
const createDrawLinesDev = require('../src/index.js');
const createDrawLinesProd = require('../dist/regl-gpu-lines.min.js');
const savePixels = require('save-pixels');
const getPixels = require('get-pixels');
const ndarray = require('ndarray');
const glob = require('glob');
const async = require('async');
const pixelmatch = require('pixelmatch');
const pool = require('ndarray-scratch');

const UPDATE = process.env['UPDATE'] === '1';
const CI = process.env['CI'] === '1';
const ENV = (process.env['ENV'] || '').toUpperCase() === 'PRODUCTION' ? 'production' : 'development'
const filter = process.env['FILTER'] ? new RegExp(process.env['FILTER']) : null;

let createDrawLines;
console.log('ENV:', ENV);
if (ENV === 'production') {
  createDrawLines = createDrawLinesProd;
  console.error('Testing against production bundle dist/regl-gpu-lines.min.js');
} else {
  createDrawLines = createDrawLinesDev;
  console.error('Testing against source dir, src/');
}

function replaceNullWithNaN (data) {
  for (let i = 0; i < data.length; i++) {
    if (Array.isArray(data[i])) {
      replaceNullWithNaN(data[i]);
    } else if (data[i] === null) {
      data[i] = NaN;
    }
  }
  return data;
}

function renderFixture(regl, fixture) {
  const drawLines = createDrawLines(regl, {
    ...fixture.command,
    vert: fixture.command.vert.join('\n'),
    frag: fixture.command.frag.join('\n')
  });
  regl.clear({color: [1, 1, 1, 1], depth: 1});

  const lineData = fixture.data ? {...fixture.data} : {};
  lineData.vertexAttributes = {};
  lineData.endpointAttributes = {};


  if (fixture.vertexAttributes) {
    lineData.vertexAttributes = {};
    for (const [name, attribute] of Object.entries(fixture.vertexAttributes)) {
      const sanitizedAttr = replaceNullWithNaN(attribute);

      lineData.vertexAttributes[name] = regl.buffer(sanitizedAttr);
      lineData.vertexCount = sanitizedAttr.length;
    }
  }

  if (fixture.endpointAttributes) {
    lineData.endpointAttributes = {};
    for (const [name, attribute] of Object.entries(fixture.endpointAttributes)) {
      const sanitizedAttr = replaceNullWithNaN(attribute);

      // If endpoint data is provided, use it
      lineData.endpointAttributes[name] = regl.buffer(sanitizedAttr);
      lineData.endpointCount = sanitizedAttr.length;
    }
  }

  drawLines(lineData);
}

const fixtureDir = path.join(__dirname, "fixtures");
const fixturePaths = glob.sync(path.join(fixtureDir, "**/fixture.json"));
const gl = createContext(256, 256);

test('run image tests', function (t) {
  for (const fixturePath of fixturePaths) {
    const relPath = path.relative(fixtureDir, fixturePath)
    if (filter && !filter.test(relPath)) continue;
    t.test(path.dirname(relPath), function (t) {
      const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

      const shape = fixture.shape || [256, 256];
      gl.resize(shape[0], shape[1]);

      const regl = createREGL({gl, extensions: ['ANGLE_instanced_arrays']});

      renderFixture(regl, fixture);

      const outputName = UPDATE ? 'expected.png' : 'actual.png';
      const outputPath = path.join(path.dirname(fixturePath), outputName);
      const actualPixels = ndarray(regl.read(), [shape[1], shape[0], 4]).transpose(1, 0);

      regl.destroy();

      if (!CI) {
        savePixels(actualPixels.step(1, -1), 'png')
          .pipe(fs.createWriteStream(outputPath));
      }

      if (!UPDATE) {
        const expectedName = path.join(path.dirname(fixturePath), 'expected.png');

        getPixels(expectedName, function (err, unflippedExpectedPixels) {
          if (err) return t.fail(err);

          const expectedPixels = pool.clone(unflippedExpectedPixels.step(1, -1).transpose(1, 0));

          const diffData = new Uint8Array(shape[0] * shape[1] * 4);
          const badPixelCount = pixelmatch(actualPixels.data, expectedPixels.data, diffData, shape[0], shape[1], {
            threshold: fixture.threshold || 0.1,
            includeAA: true
          });

          if (!CI || badPixelCount) {
            const diffPath = path.join(path.dirname(fixturePath), 'diff.png');
            const diffPixels = ndarray(diffData, [shape[1], shape[0], 4]);
            savePixels(diffPixels.transpose(1, 0).step(1, -1), 'png')
              .pipe(fs.createWriteStream(diffPath));
          }

          const result = !badPixelCount;
          const msg = `zero unmatched pixels${badPixelCount ? ` (got ${badPixelCount} unmatched)` : ''}`;
          if (fixture.skip) {
            t.skip(result, msg);
          } else {
            t.ok(result, msg);
          }

          t.end();
        })

      } else {
        t.skip(`Wrote expected image to ${path.join(path.basename(path.dirname(fixturePath)), outputName)}`);
        regl.destroy();
        t.end();
      }
    });
  }
});
