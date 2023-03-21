import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as gendiff from '../src/index.js';

const expectedBasic = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

const expectedNested = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow:
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;

// Ниже мы получаем абсолютный путь в любом месте - даже в вирт окружении (нужно для тестов на гите)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path1 = path.join(__dirname, '../__fixtures__/file1.json');
const path2 = '__fixtures__/file2.json';
const path3Yml = path.join(__dirname, '../__fixtures__/file1.yml');
const path4Yml = '__fixtures__/file2.YAML';
const path5NestedJSON = path.join(__dirname, '../__fixtures__/file1Nested.json');
const path6NestedYML = '__fixtures__/file2Nested.YAML';

describe('GenDiff - nested json yml diff', () => {
  test('Gendiff empty path', () => {
    expect(gendiff.genDiff('', '')).toEqual('enter valid path');
  });
  test('Gendiff NESTED basic - JSON, YML', () => {
    expect(gendiff.genDiff(path5NestedJSON, path6NestedYML)).toEqual(expectedNested);
  });
  // FLAT structure tests. Obsolete.
  test('Gendiff JSON', () => {
    expect(gendiff.genDiff(path1, path2)).toEqual(expectedBasic);
  });
  test('Gendiff YML', () => {
    expect(gendiff.genDiff(path3Yml, path4Yml)).toEqual(expectedBasic);
  });
  test('Gendiff JSON vs YML', () => {
    expect(gendiff.genDiff(path1, path4Yml)).toEqual(expectedBasic);
  });
});
