import stringParserToObject from '../src/parsers.js';

const file1STR = `{
  "host": "hexlet.io",
  "timeout": 50,
  "proxy": "123.234.53.22",
  "follow": false
}`;

const file1 = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};

const file2YmlStr = `timeout: 20
verbose: true
host: "hexlet.io"`;

const file2Yml = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
};

describe('String Parser to object', () => {
  test('JSON parser', () => {
    expect(stringParserToObject(file1STR, 'JSON')).toEqual(file1);
  });
  test('YML parser', () => {
    expect(stringParserToObject(file2YmlStr, 'YML')).toEqual(file2Yml);
  });
  // YML парсер нормально парсит JSON, потому ошибка только на JSON парсер
  test('wrong format parser', () => {
    expect(() => stringParserToObject(file2YmlStr, 'JSON')).toThrow();
  });
});
