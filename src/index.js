/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
import stringParserToObject from '../src/parsers.js'
import path from 'path';
import fs from 'fs';

// проверка расширений файлов, определение дальнешего пути работы
export const checkFileExtension = (path1, path2) => {
  const [JSON, YML, JSON_YML, YML_JSON] = ['JSON', 'YML', 'JSON_YML', 'YML_JSON'];
  if (path1.slice(-5) === path2.slice(-5) && (path1.slice(-5) === '.json' || path1.slice(-5) === '.JSON')) {
    return JSON;
  }
};

// Превращатель пути в абсолютный
export const pathAbsolutizer = (pathGiven) => {
  if (pathGiven.startsWith('/')) {
    return pathGiven
  }
  return path.resolve(pathGiven);
}

// Извлекаем строку из файла по указанному пути
export const fileStringExtractor = (absPath) => {
  return fs.readFileSync(absPath, 'UTF-8')
}

// Сравнение 2 объектов, вывод строки
export const compareObjects = (file1, file2) => {
  const keysAll = Object.keys(file1).concat(Object.keys(file2));
  const keysAllUniq = [...new Set(keysAll)].sort();

  if (keysAll.length === 0) {
    return '{}';
  }

  const resultString = keysAllUniq.reduce((acc, key) => {
    if (file1[key] === file2[key]) {
      acc += `   ${key}: ${file1[key]}\n`;
    } else if (Object.hasOwn(file1, key) && !Object.hasOwn(file2, key)) {
      acc += ` - ${key}: ${file1[key]}\n`;
    } else if (!Object.hasOwn(file1, key) && Object.hasOwn(file2, key)) {
      acc += ` + ${key}: ${file2[key]}\n`;
    } else if (Object.hasOwn(file1, key) && Object.hasOwn(file2, key)
    && file1[key] !== file2[key]) {
      acc += ` - ${key}: ${file1[key]}\n`;
      acc += ` + ${key}: ${file2[key]}\n`;
    }
    return acc;
  }, '');
  return `{\n${resultString}}`;
};

export const genDiff = (path1, path2) => {
  if (path1.length === 0 || path2.length === 0) {
    return 'enter valid path';
  }
  const [pathAbs1, pathAbs2] = [pathAbsolutizer(path1), pathAbsolutizer(path2)]
  const [dataString1, dataString2] = [fileStringExtractor(pathAbs1), fileStringExtractor(pathAbs2)]
  if (checkFileExtension(pathAbs1, pathAbs2) === 'JSON') {
    const [object1, object2] = [stringParserToObject(dataString1),stringParserToObject(dataString2)]
    return compareObjects(object1, object2);
  }
};

/*
console.log(compareObjects(file1, file2));
console.log(compareObjects({}, {}));
console.log(compareObjects(file1, {}));

expect
gendiff filepath1.json filepath2.json

{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}
*/
