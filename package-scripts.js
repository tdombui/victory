const os = require("os");
// Can override with, e.g., `CONCURRENCY=2 yarn nps build-package-dists`.
const CONCURRENCY = parseInt(process.env.CONCURRENCY || os.cpus().length, 10);
const npsUtils = require("nps-utils");

module.exports = {
  scripts: {
    server: {
      dev: {
        ts: "webpack serve --config ./config/webpack/demo/webpack.config.dev-ts.js",
        default:
          "webpack serve --config ./config/webpack/demo/webpack.config.dev.js --content-base demo/js"
      },
      hot: "webpack serve --config ./config/webpack/demo/webpack.config.hot.js --inline --hot --content-base demo/js",
      test: "webpack serve --config ./config/webpack/webpack.config.test.js"
    },
    karma: {
      ci: "karma start --browsers ChromeHeadlessCustom,Firefox ./config/karma/karma.conf.coverage.js",
      cov: "karma start ./config/karma/karma.conf.coverage.js",
      watch: "karma start --auto-watch ./config/karma/karma.conf.js",
      default: "karma start ./config/karma/karma.conf.js"
    },
    jest: {
      native: "jest --config=jest-native-config.js",
      default: "cross-env BABEL_ENV=commonjs jest --config=jest-config.js"
    },
    "test-node": {
      default: "mocha ./test/node"
    },
    test: {
      cov: npsUtils.series.nps("build-package-libs", "karma.cov"),
      dev: "karma start ./config/karma/karma.conf.dev.js",
      watch: npsUtils.concurrent.nps("watch", "karma.watch"),
      default: npsUtils.series.nps("build-package-libs", "karma")
    },
    storybook: {
      server: "start-storybook -p 6006",
      default: npsUtils.concurrent.nps("watch", "storybook.server")
    },
    start: {
      ts: npsUtils.concurrent.nps("watch", "server.dev.ts"),
      default: npsUtils.concurrent.nps("watch", "server.dev", "server.test")
    },
    lint: {
      // Note: Using a base `nps` command with extra args.
      // 1. You need to add double quotes around the extra part (e.g. `test` below)
      // 2. If going through a `lerna exec` you need to escape with an extra backslash `\` (e.g. `src` below)
      base: "yarn eslint --color",
      fix: "yarn eslint --color --fix",
      src: 'lerna exec --ignore victory-vendor --stream -- yarn nps \\"lint.base src\\"',
      vendor:
        'lerna exec --scope victory-vendor -- yarn nps \\"lint.base scripts\\"',
      config: 'yarn nps "lint.base package-scripts.js config"',
      demo: 'yarn nps "lint.base demo"',
      docs: 'yarn nps "lint.base docs"',
      stories: 'yarn nps "lint.base stories"',
      test: 'yarn nps "lint.base test"',
      default: npsUtils.series.nps(
        "lint.config",
        "lint.test",
        "lint.stories",
        "lint.demo",
        // TODO: Needs `docs` install to work -- "lint.docs",
        "lint.vendor",
        "lint.src"
      )
    },
    format: {
      fix: 'prettier --write "./**/*.{js,jsx,json,ts,tsx}"',
      ci: 'prettier --list-different "./**/*.{js,jsx,json,ts,tsx}"',
      default: "yarn nps format.fix"
    },
    typecheck: {
      default: npsUtils.series.nps("typecheck.core"),
      base: "tsc --noEmit",
      demo: "tsc -p ./demo/tsconfig.json --noEmit",
      core: "lerna exec --scope victory-core -- nps typecheck.base"
    },
    check: {
      ci: npsUtils.series.nps(
        "format.ci",
        "lint",
        "typecheck",
        "build-package-libs",
        "build-package-dists",
        "test-node",
        "jest",
        "jest.native",
        "karma.ci"
      ),
      cov: npsUtils.series.nps("lint", "test.cov"),
      dev: npsUtils.series.nps("lint", "test.dev"),
      default: npsUtils.series.nps("lint", "test")
    },
    watch: {
      es: "lerna exec --parallel --ignore victory-native --ignore victory-vendor -- cross-env BABEL_ENV=es babel src --out-dir es --config-file ../../.babelrc.js --copy-files --extensions .tsx,.ts,.jsx,.js --watch",
      lib: "lerna exec --parallel --ignore victory-native --ignore victory-vendor -- cross-env BABEL_ENV=commonjs babel src --out-dir lib --config-file ../../.babelrc.js --copy-files --extensions .tsx,.ts,.jsx,.js --watch",
      core: npsUtils.concurrent.nps("watch.es", "watch.lib"),
      // `victory-vendor` is built 1x up front and not watched.
      default: npsUtils.series.nps("build-package-libs-vendor", "watch.core")
    },
    clean: {
      lib: "rimraf lib",
      es: "rimraf es",
      dist: "rimraf dist",
      default: npsUtils.concurrent.nps("clean.es", "clean.lib", "clean.dist"),
      all: "lerna exec --parallel -- nps clean"
    },
    // Version testing helpers
    "lerna-dry-run":
      "lerna version --no-git-tag-version --no-push --loglevel silly",
    // TODO: organize build scripts once build perf is sorted out
    "babel-es":
      "cross-env BABEL_ENV=es babel src --out-dir es --config-file ../../.babelrc.js --copy-files --extensions .tsx,.ts,.jsx,.js",
    "babel-lib":
      "cross-env BABEL_ENV=commonjs babel src --out-dir lib --config-file ../../.babelrc.js --copy-files --extensions .tsx,.ts,.jsx,.js",
    "build-es": npsUtils.series.nps("clean.es", "babel-es"),
    "build-lib": npsUtils.series.nps("clean.lib", "babel-lib"),
    "build-libs": npsUtils.series.nps("build-lib", "build-es"),
    "build-package-libs-core": `lerna exec --concurrency ${CONCURRENCY} --stream --ignore victory-native --ignore victory-vendor -- nps build-libs`,
    "build-package-libs-vendor":
      "lerna exec --scope victory-vendor -- yarn build",
    "build-package-libs": npsUtils.series.nps(
      "build-package-libs-core",
      "build-package-libs-vendor"
    ),
    "build-dist-dev":
      "webpack --bail --config ../../config/webpack/webpack.config.dev.js",
    "build-dist-min":
      "webpack --bail --config ../../config/webpack/webpack.config.js",
    "build-dists": npsUtils.concurrent.nps("build-dist-min", "build-dist-dev"),
    "build-dist": npsUtils.series.nps("clean.dist", "build-dists"),
    "build-package-dists": `lerna exec --concurrency ${CONCURRENCY} --stream --ignore victory-native --ignore victory-vendor -- nps build-dists`,
    bootstrap: "lerna bootstrap",
    "link-parent-bin": "link-parent-bin"
  }
};
