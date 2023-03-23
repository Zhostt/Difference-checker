import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const expectedBasic = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

const expectedStylish = `{
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

const expectedPlain = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;

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
    expect(genDiff('', '')).toEqual('enter valid path');
  });
  test('Gendiff nexted STYLISH - JSON, YML', () => {
    expect(genDiff(path5NestedJSON, path6NestedYML)).toEqual(expectedStylish);
  });
  test('Gendiff nexted PLAIN - JSON, YML', () => {
    expect(genDiff(path5NestedJSON, path6NestedYML, 'plain')).toEqual(expectedPlain);
  });
});
/*
  // FLAT structure tests. Obsolete - because of no sort function.
  test('Gendiff plain JSON', () => {
    expect(genDiff(path1, path2)).toEqual(expectedBasic);
  });
  test('Gendiff plain YML', () => {
    expect(genDiff(path3Yml, path4Yml)).toEqual(expectedBasic);
  });
  test('Gendiff plain JSON vs YML', () => {
    expect(genDiff(path1, path4Yml)).toEqual(expectedBasic);
  });
*/
