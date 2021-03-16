const { SourceMapSource, RawSource } = require('webpack-sources');
const { version } = require('webpack');

const NAME = require('../package.json').name;
const processCSS = require('../src/process-css.js');
const virtualModules = require('./virtualModules.js');

const isWebpack5 = parseInt(version, 10) == 5;

class Style9Plugin {
  constructor({ test = /\.css$/ } = {}) {
    this.test = test;
  }

  apply(compiler) {
    virtualModules.apply(compiler);

    compiler.hooks.compilation.tap(NAME, compilation => {
      if (isWebpack5) {
        compilation.hooks.processAssets.tapPromise(
          { name: NAME, stage: 'PROCESS_ASSETS_STAGE_OPTIMIZE' },
          async assets => {
            const paths = Object.keys(assets).filter(path =>
              path.match(this.test)
            );

            for (const path of paths) {
              const asset = compilation.assets[path];
              const { source, map } = asset.sourceAndMap();
              const postcssOpts = {
                to: path,
                from: path,
                map: { prev: map || false }
              };
              const result = processCSS(source, postcssOpts);

              if (result.map) {
                compilation.assets[path] = new SourceMapSource(
                  result.css,
                  path,
                  JSON.parse(result.map),
                  source,
                  map,
                  true
                );
              } else {
                compilation.assets[path] = new RawSource(result.css);
              }
            }
          }
        );
      } else {
        compilation.hooks.optimizeChunkAssets.tapPromise(NAME, async chunks => {
          const paths = Array.from(chunks)
            .flatMap(chunk => Array.from(chunk.files))
            .filter(path => path.match(this.test));

          for (const path of paths) {
            const asset = compilation.assets[path];
            const { source, map } = asset.sourceAndMap();
            const postcssOpts = {
              to: path,
              from: path,
              map: { prev: map || false }
            };
            const result = processCSS(source, postcssOpts);

            if (result.map) {
              compilation.assets[path] = new SourceMapSource(
                result.css,
                path,
                JSON.parse(result.map),
                source,
                map,
                true
              );
            } else {
              compilation.assets[path] = new RawSource(result.css);
            }
          }
        });
      }
    });
  }
}

module.exports = Style9Plugin;

module.exports.loader = require.resolve('./loader.js');
