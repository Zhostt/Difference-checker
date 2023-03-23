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

// Формирователь АСТ дерева сравнений из 2 объектов
export const compareTreeFormer = (object1, object2) => {
  const [removed, added, equal, modified, nested, stringified1, stringified2] = ['removed', 'added', 'equal', 'modified', 'nested', 'stringified1', 'stringified2'];
  // node structure = {key, status, depth, value1, value2}
  // statuses: removed, added, equal, modified, stringified1, stringified2
  const innerTreeFormer = (file1, file2, depthAcc) => {
    const keysAll = Object.keys(file1).concat(Object.keys(file2));
    const keysAllUniq = [...new Set(keysAll)].sort();

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
        // Тут нужна рекурсия - если оба значения = объекты
      } else if (_.isObject(value1) && _.isObject(value2)) {
        return ({
          key, status: nested, depth, value1: innerTreeFormer(value1, value2, depth + 1),
        });

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
    };
    return keysAllUniq.map((key) => iter(key, depthAcc));
  };
  return innerTreeFormer(object1, object2, 1);
};

export const stylish = (array, space = '    ') => {
  // node structure = {key, status, depth, value1, value2}
  // statuses: removed, added, equal, modified, stringified1, stringified2
  const spaceLength = space.length;
  const [removedSign, addedSign, equalSign] = ['- ', '+ ', '  '];
  const [removed, added, equal, modified, nested, stringified1, stringified2] = ['removed', 'added', 'equal', 'modified', 'nested', 'stringified1', 'stringified2'];
  const leftMargin = equalSign.length;

  // Обработка случая, когда значения ключа с одной стороны - Объект, с другой - нет.
  // Выдача объекта строкой.
  const stringifyObj = (obj, innderDepth) => {
    const margin = space.repeat(innderDepth);
    const objString = Object.keys(obj)
      .reduce((acc, key) => {
        const value = obj[key];
        if (!_.isObject(value)) {
          acc += `\n${margin}${key}: ${value}`;
          return acc;
        }
        acc += `\n${margin}${key}: ${stringifyObj(value, innderDepth + 1)}`;
        return acc;
      }, '');
    const resultString = `{${objString}\n${margin.slice(0, -spaceLength)}}`;
    return resultString;
  };

  // Обработка объекта - ребенка из массива value
  const iter = (acc, object) => {
    const {
      key, status, depth, value1, value2,
    } = object;
    const margin = space.repeat(depth).slice(0, -leftMargin);
    const marginSizeOfEqualSign = margin.slice(0, leftMargin);
    let [space1, space2] = [' ', ' '];
    if (value1 === '') {
      space1 = '';
    }
    if (value2 === '') {
      space2 = '';
    }

    switch (status) {
      case removed:
        acc += `${margin}${removedSign}${key}:${space1}${value1}\n`;
        return acc;
      case added:
        acc += `${margin}${addedSign}${key}:${space2}${value2}\n`;
        return acc;
      case equal:
        acc += `${margin}${equalSign}${key}:${space1}${value1}\n`;
        return acc;
      case modified:
        acc += `${margin}${removedSign}${key}:${space1}${value1}\n`;
        acc += `${margin}${addedSign}${key}:${space2}${value2}\n`;
        return acc;
      case nested:
        acc += `${margin}${equalSign}${key}:${space1}{\n${stylish(value1)}${margin + marginSizeOfEqualSign}}\n`;
        return acc;
      case stringified1:
        acc += `${margin}${removedSign}${key}:${space1}${stringifyObj(value1, depth + 1)}\n`;
        if (value2 !== undefined) {
          acc += `${margin}${addedSign}${key}:${space2}${(value2)}\n`;
        }
        return acc;
      case stringified2:
        if (value1 !== undefined) {
          acc += `${margin}${removedSign}${key}:${space1}${(value1)}\n`;
        }
        acc += `${margin}${addedSign}${key}:${space2}${stringifyObj(value2, depth + 1)}\n`;
        return acc;
      default:
        console.log('ERROR - wrong status type in recieved object, check compareTreeFormer func');
    }
    return acc;
  };

  //  Cannot destructure property 'key' of 'object' as it is undefined.
  // If using  array.reduce(iter,''). Dunno why.
  let result = '';
  for (const object of array) {
    result += iter('', object);
  }

  return result;
};

export const plain = (arrayTree) => {
  // node structure = {key, status, depth, value1, value2}
  // statuses: removed, added, equal, modified, stringified1, stringified2
  const [removed, added, equal, modified, nested, stringified1, stringified2] = ['removed', 'added', 'equal', 'modified', 'nested', 'stringified1', 'stringified2'];

  const iter = (array, ancestry) => {
    let resultString = '';

    for (const object of array) {
      const {
        key, status, value1, value2,
      } = object;
      // To prevent '.' in the begin of the path (like '.a.b.c')
      let newPath = ancestry === '' ? key : `${ancestry}.${key}`;
      // set quotes for string values, no quotes for others
      const value1Quotes = typeof (value1) === 'string' ? `'${value1}'` : value1;
      const value2Quotes = typeof (value2) === 'string' ? `'${value2}'` : value2;

      switch (status) {
        case removed:
          resultString += `Property '${newPath}' was removed\n`;
          break;
        case added:
          resultString += `Property '${newPath}' was added with value: ${value2Quotes}\n`;
          break;
        case modified:
          resultString += `Property '${newPath}' was updated. From ${value1Quotes} to ${value2Quotes}\n`;
          break;
        case nested:
          resultString += iter(value1, newPath);
          break;
        case stringified1:
          resultString += value2 === undefined ? `Property '${newPath}' was removed\n` : `Property '${newPath}' was updated. From [complex value] to ${value2Quotes}\n`;
          break;
        case stringified2:
          resultString += value1 === undefined ? `Property '${newPath}' was added with value: [complex value]\n` : `Property '${newPath}' was updated. From ${value1Quotes} to [complex value]\n`;
          break;
        default:
          break;
      }
    }
    return resultString;
  };
  return (iter(arrayTree, '')).slice(0, -1); // slice to cut the last \n
};

export const genDiff = (path1, path2, format = 'stylish') => {
  if (path1.length === 0 || path2.length === 0) {
    return 'enter valid path';
  }
  const [pathAbs1, pathAbs2] = [pathAbsolutizer(path1), pathAbsolutizer(path2)];
  const [dataString1, dataString2] = [fileStringExtractor(pathAbs1), fileStringExtractor(pathAbs2)];

  const object1 = stringParserToObject(dataString1, checkFileExtension(pathAbs1));
  const object2 = stringParserToObject(dataString2, checkFileExtension(pathAbs2));
  if (format === 'stylish') return `{\n${stylish(compareTreeFormer(object1, object2))}}`;
  if (format === 'plain') return plain(compareTreeFormer(object1, object2));
  return ('Error: Enter valid format or use default - stylish');
};

// for quick  test purposes
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

console.log(plain(compareTreeFormer(obj1, obj2)));
