/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
// import path from 'path';
import fs from 'fs';
import path, { dirname } from 'path';
import stringParserToObject from './parsers.js';

// проверка расширений файлов, определение дальнешего пути работы
export const checkFileExtension = (pathGiven) => {
  const [JSON, YML] = ['JSON', 'YML'];
  if (path.extname(pathGiven) === '.json' || path.extname(pathGiven) === '.JSON') {
    return JSON;
  }
  if (['.yml', '.YML', '.YAML', '.yaml'].includes(path.extname(pathGiven))) {
    return YML;
  }
};

// Превращатель пути в абсолютный
export const pathAbsolutizer = (pathGiven) => {
  if (pathGiven.startsWith('/')) {
    return pathGiven;
  }
  return path.resolve(pathGiven);
};

// Извлекаем строку из файла по указанному пути
export const fileStringExtractor = (absPath) => fs.readFileSync(absPath, 'UTF-8');

// Сравнение 2 плоских объектов, вывод строки
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

// сравнение объектов (в тч вложенных)
export const stylish = (file1, file2, depth = 1, space = '    ') => {
  const [removed, added, equal] = ['- ', '+ ', '  '];
  const margin = space.repeat(depth).slice(0, -equal.length);
  const keysAll = Object.keys(file1).concat(Object.keys(file2));
  const keysAllUniq = [...new Set(keysAll)].sort();

  if (keysAll.length === 0) {
    return '{}';
  }

  const stringify = (obj, innerDepth) => {
    const innerMargin = space.repeat(innerDepth).slice(0, -equal.length);
    const marginNestedStr = innerMargin + space + innerMargin.slice(0, equal.length);
    const objString = Object.keys(obj)
      .reduce((acc, key) => {
        if (!_.isObject(obj[key])) {
          acc += `\n${marginNestedStr}${key}: ${obj[key]}`;
          return acc;
        }
        acc += `\n${marginNestedStr}${key}: ${stringify(obj[key], innerDepth + 1)}`
        return acc;
      }, '');
    const resultString = `{${objString}\n${innerMargin + innerMargin.slice(0, equal.length)}}`;
    return resultString;
  };

  const resultString = keysAllUniq.reduce((acc, key) => {
    const value1 = file1[key];
    const value2 = file2[key];
    let [space1, space2] = [' ', ' ']
    if (value1 === ''){
      space1 = ''   
    }
    if (value2 === ''){
      space2 = ''   
    }
    if (!_.isObject(value1) && !_.isObject(value2)) {
      if (file1[key] === file2[key]) {
        acc += `${margin}${equal}${key}:${space1}${file1[key]}\n`;
      } else if (Object.hasOwn(file1, key) && !Object.hasOwn(file2, key)) {
        acc += `${margin}${removed}${key}:${space1}${file1[key]}\n`;
      } else if (!Object.hasOwn(file1, key) && Object.hasOwn(file2, key)) {
        acc += `${margin}${added}${key}:${space2}${file2[key]}\n`;
      } else if (Object.hasOwn(file1, key) && Object.hasOwn(file2, key)
      && file1[key] !== file2[key]) {
        acc += `${margin}${removed}${key}:${space1}${file1[key]}\n`;
        acc += `${margin}${added}${key}:${space2}${file2[key]}\n`;
      }
    } else if (_.isObject(value1) && _.isObject(value2)) {
      acc += `${margin}  ${key}: ${stylish(value1, value2, depth + 1)}\n`;
    } else if (((_.isObject(value1) && !_.isObject(value2)))) {
      acc += `${margin}${removed}${key}:${space1}${stringify(value1, depth)}\n`;
      if (value2 !== undefined) {
        acc += `${margin}${added}${key}:${space2}${(value2)}\n`;
      }
    } else if ((!_.isObject(value1) && _.isObject(value2))) {
      if (value1 !== undefined) {
        acc += `${margin}${removed}${key}:${space1}${(value1)}\n`;
      }
      acc += `${margin}${added}${key}:${space2}${(stringify(value2, depth))}\n`;
    }

    return acc;
  }, '');
  return `{\n${resultString}${margin.slice(0, -equal.length)}}`;
};

export const genDiff = (path1, path2) => {
  if (path1.length === 0 || path2.length === 0) {
    return 'enter valid path';
  }
  const [pathAbs1, pathAbs2] = [pathAbsolutizer(path1), pathAbsolutizer(path2)];
  const [dataString1, dataString2] = [fileStringExtractor(pathAbs1), fileStringExtractor(pathAbs2)];

  const object1 = stringParserToObject(dataString1, checkFileExtension(pathAbs1));
  const object2 = stringParserToObject(dataString2, checkFileExtension(pathAbs2));
  return stylish(object1, object2);
};

const file1 = {
  common: {
    HaveBoth: true,
    DontHave: 'aga',
    NestedHaveBoth: { have: true },
    NestedDontHave: { have: false },
    NestedFirstOnly: { bitch: 'no', abc: 12345, deeper: {hola: 'piupo'} },
    NestedNested: { key: { keyNN: 'value' } },
  },
};
const file2 = {
  common: {
    HaveBoth: true,
    DontHave: 'no',
    OnlyInSecond: 'no',
    NestedHaveBoth: { have: true },
    NestedDontHave: { have: '123' },
    NestedSecond: { one: 2 },
    NestedNested: { key: { keyNN: 'AAA' } },
    NestedNestedSECONDONLY: { aba: { booba: { ruka: 'zalupa' }, zhopa: 'govno' } },
  },
};

const file3 = {
  NestedFirstOnly: { bitch: 'no', abc: 12345, deeper: {hola: 'piupo'} },
}

const file4 = {
  NestedFirstOnly23: { bitch: 'yes', abc: 21353, deeper: {hola: 'hahah'} },
};

console.log(stylish(file3, file4));
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
