
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import stringParserToObject from '../src/parsers.js'

const file1STR = 
`{
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

describe('String Parser to object', () => {
    test('JSON parser', () => {
      expect(stringParserToObject(file1STR)).toEqual(file1);
    });
  });