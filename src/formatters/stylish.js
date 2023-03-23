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

/*
    // spaces should not be added if value is ''. Obsolete.
    let [space1, space2] = [' ', ' '];
    if (value1 === '') {
      space1 = '';
    }
    if (value2 === '') {
      space2 = '';
    }
*/
    switch (status) {
      case removed:
        acc += `${margin}${removedSign}${key}: ${value1}\n`;
        return acc;
      case added:
        acc += `${margin}${addedSign}${key}: ${value2}\n`;
        return acc;
      case equal:
        acc += `${margin}${equalSign}${key}: ${value1}\n`;
        return acc;
      case modified:
        acc += `${margin}${removedSign}${key}: ${value1}\n`;
        acc += `${margin}${addedSign}${key}: ${value2}\n`;
        return acc;
      case nested:
        acc += `${margin}${equalSign}${key}: {\n${stylish(value1)}${margin + marginSizeOfEqualSign}}\n`;
        return acc;
      case stringified1:
        acc += `${margin}${removedSign}${key}: ${stringifyObj(value1, depth + 1)}\n`;
        if (value2 !== undefined) {
          acc += `${margin}${addedSign}${key}: ${(value2)}\n`;
        }
        return acc;
      case stringified2:
        if (value1 !== undefined) {
          acc += `${margin}${removedSign}${key}: ${(value1)}\n`;
        }
        acc += `${margin}${addedSign}${key}: ${stringifyObj(value2, depth + 1)}\n`;
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
