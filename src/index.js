/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import stringParserToObject from './parsers.js';
import formatSelector from './formatters/index.js';

// проверка расширений файлов, определение дальнешего пути работы
export const checkFileExtension = (pathGiven) => {
  const [JSON, YML] = ['JSON', 'YML'];
  if (path.extname(pathGiven) === '.json' || path.extname(pathGiven) === '.JSON') {
    return JSON;
  }
  if (['.yml', '.YML', '.YAML', '.yaml'].includes(path.extname(pathGiven))) {
    return YML;
  }
  console.log('unexpected file extension. Try yml/yaml or json');
  return null;
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

// Формирователь АСТ дерева сравнений из 2 объектов
export const compareTreeFormer = (object1, object2) => {
  const [removed, added, equal, modified, nested, stringified1, stringified2] = ['removed', 'added', 'equal', 'modified', 'nested', 'stringified1', 'stringified2'];
  // node structure = {key, status, depth, value1, value2}
  // statuses: removed, added, equal, modified, stringified1, stringified2
  const innerTreeFormer = (file1, file2, depthAcc) => {
    const keysAll = Object.keys(file1).concat(Object.keys(file2));
    const nonMutatingSort = (array) => {
      const copy = [...array];
      return copy.sort();
    };
    const keysAllUniq = nonMutatingSort([...new Set(keysAll)]);
    // Итерирующая каждый ключ функция
    const iter = (key, depth) => {
      const value1 = file1[key];
      const value2 = file2[key];
      // Если оба значения - не объекты
      if (!_.isObject(value1) && !_.isObject(value2)) {
        if (value1 === value2) {
          return ({
            key, status: equal, depth, value1, value2,
          });
        } if (Object.hasOwn(file1, key) && !Object.hasOwn(file2, key)) {
          return ({
            key, status: removed, depth, value1,
          });
        } if (!Object.hasOwn(file1, key) && Object.hasOwn(file2, key)) {
          return ({
            key, status: added, depth, value2,
          });
        } if (Object.hasOwn(file1, key) && Object.hasOwn(file2, key)
          && value1 !== value2) {
          return ({
            key, status: modified, depth, value1, value2,
          });
        }
        // Если первое значение объект, второе нет
      } else if (((_.isObject(value1) && !_.isObject(value2)))) {
        return ({
          key, status: stringified1, depth, value1, value2,
        });

      // Если второе значение объект, первое нет
      } else if ((!_.isObject(value1) && _.isObject(value2))) {
        return ({
          key, status: stringified2, depth, value1, value2,
        });
      }
      // И если оба значения - объект, то ныряем в рекурсию
      return ({
        key, status: nested, depth, value1: innerTreeFormer(value1, value2, depth + 1),
      });
    };
    return keysAllUniq.map((key) => iter(key, depthAcc));
  };
  return innerTreeFormer(object1, object2, 1);
};

const genDiff = (path1, path2, format = 'stylish') => {
  if (path1.length === 0 || path2.length === 0) {
    return 'enter valid path';
  }
  const [pathAbs1, pathAbs2] = [pathAbsolutizer(path1), pathAbsolutizer(path2)];
  const [dataString1, dataString2] = [fileStringExtractor(pathAbs1), fileStringExtractor(pathAbs2)];

  const object1 = stringParserToObject(dataString1, checkFileExtension(pathAbs1));
  const object2 = stringParserToObject(dataString2, checkFileExtension(pathAbs2));
  const compareTree = compareTreeFormer(object1, object2);
  return formatSelector(compareTree, format);
};

export default genDiff;
/*
const obj1 = {
  a: {
    b: {
      c: 1,
    },
  },
  d: 'e',
  modded: '1',
  f: { nestedOne: 'object' },
  g: 'notNestedFirst',
  h: { nested: 'firstOnly' },
  removed: 'first',
};

const obj2 = {
  a:
  {
    b:
    { c: 2 },
  },
  d: 'e',
  modded: '2',
  f: 'notObj',
  g: {
    nested: 'second',
  },
  added: 'second',
};

console.log(JSON.stringify(compareTreeFormer(obj1, obj2)));
console.log('JSON', formatSelector(compareTreeFormer(obj1, obj2), 'json'));
*/
