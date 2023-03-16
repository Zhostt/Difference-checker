/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
import * as fs from 'fs';
import path from 'path';

// проверка расширений файлов, определение дальнешего пути работы
export const checkFileExtension = (path1, path2) => {
  const [JSON, YML, JSON_YML, YML_JSON] = ['JSON', 'YML', 'JSON_YML', 'YML_JSON'];
  if (path1.slice(-5) === path2.slice(-5) && (path1.slice(-5) === '.json' || path1.slice(-5) === '.JSON')) {
    return JSON;
  }
};

// преобразователь путей к файлам в их содержимое в виде объекта
export const makeFilepathObject = (pathGiven) => {
  // если путь уже абсолютный
  if (pathGiven.startsWith('/')) {
    const contentString = fs.readFileSync(pathGiven, 'UTF-8');
    const parsedObject = JSON.parse(contentString);
    return parsedObject;
  }
  // если путь относительный
  const absPath = path.resolve(pathGiven);
  const contentStringRelative = fs.readFileSync(absPath, 'UTF-8');
  const parsedObjectRelative = JSON.parse(contentStringRelative);
  return parsedObjectRelative;
  // readFileSync(filePath, 'UTF-8') => дает строку файла
  // JSON.parse(string) => нужный объект
};

// Сравнение 2 JSON файлов
export const compareJSONS = (file1, file2) => {
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
  if (checkFileExtension(path1, path2) === 'JSON') {
    const file1 = makeFilepathObject(path1);
    const file2 = makeFilepathObject(path2);
    return compareJSONS(file1, file2);
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
