import _ from 'lodash';

const stylish = (array, space = '    ') => {
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
          return `${acc}\n${margin}${key}: ${value}`;
        }
        return `${acc}\n${margin}${key}: ${stringifyObj(value, innderDepth + 1)}`;
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

    switch (status) {
      case removed:
        return `${acc}${margin}${removedSign}${key}: ${value1}\n`;
      case added:
        return `${acc}${margin}${addedSign}${key}: ${value2}\n`;
      case equal:
        return `${acc}${margin}${equalSign}${key}: ${value1}\n`;
      case modified:
        return `${acc}${margin}${removedSign}${key}: ${value1}\n${margin}${addedSign}${key}: ${value2}\n`;
      case nested:
        return `${acc}${margin}${equalSign}${key}: {\n${stylish(value1)}${margin + marginSizeOfEqualSign}}\n`;
      case stringified1:
        if (value2 !== undefined) {
          return `${acc}${margin}${removedSign}${key}: ${stringifyObj(value1, depth + 1)}\n${margin}${addedSign}${key}: ${(value2)}\n`;
        }
        return `${acc}${margin}${removedSign}${key}: ${stringifyObj(value1, depth + 1)}\n`;
      case stringified2:
        if (value1 !== undefined) {
          return `${acc}${margin}${removedSign}${key}: ${(value1)}\n${margin}${addedSign}${key}: ${stringifyObj(value2, depth + 1)}\n`;
        }
        return `${acc}${margin}${addedSign}${key}: ${stringifyObj(value2, depth + 1)}\n`;
      default:
        throw new Error(`Unknown status: ${status}`);
    }
  };

  const result = array.reduce(iter, '');
  return result;
};

export default stylish;

// for quick  test purposes
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
*/
