
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pathParserToObject from '../src/parsers.js'

const file1 = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};

const file2 = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
};

// Ниже мы получаем абсолютный путь в любом месте - даже в вирт окружении (нужно для тестов на гите)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path1 = path.join(__dirname, '../__fixtures__/file1.json');
const path2 = '__fixtures__/file2.json';

describe('Parse Filepath JSON > Objects', () => {
    test('Parse Filepath JSON - ABSOLUTE path', () => {
      expect(pathParserToObject(path1)).toEqual(file1);
    });
  
    test('Parse Filepath JSON - RELATIVE path', () => {
      expect(pathParserToObject(path2)).toEqual(file2);
    });
  });