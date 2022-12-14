import ModuleStatusCache from '../../../lib/-private/module-status-cache.js';
import { getProjectConfig } from '../../../lib/get-config.js';

describe('ModuleStatusCache', function () {
  const workingDir = process.cwd();

  it('Merges the overrides rules with existing rules config', function () {
    let config = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
      overrides: [
        {
          files: ['**/templates/**/*.hbs'],
          rules: {
            baz: 'bang',
          },
        },
      ],
    };

    let expectedRule = {
      foo: 'bar',
      baz: 'bang',
    };
    let actual = new ModuleStatusCache(workingDir, config).getConfigForFile({
      filePath: 'app/templates/foo.hbs',
    });

    expect(actual.rules).toEqual(expectedRule);
  });

  it('Merges the overrides rules with existing rules from plugin', async function () {
    let config = {
      plugins: [
        {
          name: 'foobar',
          configurations: {
            recommended: {
              rules: {
                foo: 'foo',
                bar: 'bar',
              },
            },
          },
          rules: {
            foo: class Rule {},
            bar: class Rule {},
          },
        },
      ],
      extends: ['foobar:recommended'],
      overrides: [
        {
          files: ['**/templates/**/*.hbs'],
          rules: {
            bar: 'bar-override',
          },
        },
      ],
    };

    let expectedRule = {
      foo: { config: 'foo', severity: 2 },
      bar: { config: 'bar-override', severity: 2 },
    };

    const projectConfig = await getProjectConfig(workingDir, { config });

    let actual = new ModuleStatusCache(workingDir, projectConfig).getConfigForFile({
      filePath: 'app/templates/foo.hbs',
    });

    expect(actual.rules).toEqual(expectedRule);
  });

  it('Merges the overrides rules with existing rules from plugin and config', async function () {
    let config = {
      plugins: [
        {
          name: 'foobar',
          configurations: {
            recommended: {
              rules: {
                foo: 'foo',
                bar: 'bar',
              },
            },
          },
          rules: {
            foo: class Rule {},
            bar: class Rule {},
          },
        },
      ],
      extends: ['foobar:recommended'],
      rules: {
        bar: 'bar-rules',
        rules: 'rules-only',
      },
      overrides: [
        {
          files: ['**/templates/**/*.hbs'],
          rules: {
            bar: 'bar-overrides',
            overrides: 'overrides-only',
          },
        },
      ],
    };

    let expectedRule = {
      foo: { config: 'foo', severity: 2 },
      bar: { config: 'bar-overrides', severity: 2 },
      rules: { config: 'rules-only', severity: 2 },
      overrides: { config: 'overrides-only', severity: 2 },
    };

    const projectConfig = await getProjectConfig(workingDir, { config });

    let actual = new ModuleStatusCache(workingDir, projectConfig).getConfigForFile({
      filePath: 'app/templates/foo.hbs',
    });

    expect(actual.rules).toEqual(expectedRule);
  });

  it('Returns the correct rules config if overrides is empty/not present', function () {
    let config = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
      overrides: [],
    };

    // clone to ensure we are not mutating
    let expected = JSON.parse(JSON.stringify(config));

    let actual = new ModuleStatusCache(workingDir, config).getConfigForFile({
      filePath: 'app/templates/foo.hbs',
    });

    expect(actual.rules).toEqual(expected.rules);

    delete config.overrides;

    actual = new ModuleStatusCache(workingDir, config).getConfigForFile('app/templates/foo.hbs');

    expect(actual.rules).toEqual(expected.rules);
  });

  it('Merges the overrides rules from multiple overrides with existing rules config', function () {
    let config = {
      rules: {
        qux: 'blobber',
        foo: 'bar',
        baz: 'derp',
      },
      overrides: [
        {
          files: ['**/templates/**/*.hbs'],
          rules: {
            baz: 'bang',
          },
        },
        {
          files: ['**/foo.hbs'],
          rules: {
            foo: 'zomg',
          },
        },
      ],
    };

    let expectedRule = {
      qux: 'blobber',
      foo: 'zomg',
      baz: 'bang',
    };
    let actual = new ModuleStatusCache(workingDir, config).getConfigForFile({
      filePath: 'app/templates/foo.hbs',
    });

    expect(actual.rules).toEqual(expectedRule);
  });
});
