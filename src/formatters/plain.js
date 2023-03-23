const plain = (arrayTree) => {
  // node structure = {key, status, depth, value1, value2}
  // statuses: removed, added, equal, modified, stringified1, stringified2
  const [removed, added, modified, nested, stringified1, stringified2] = ['removed', 'added', 'modified', 'nested', 'stringified1', 'stringified2'];

  const iter = (array, ancestry) => {
    let resultString = '';

    for (const object of array) {
      const {
        key, status, value1, value2,
      } = object;
        // To prevent '.' in the begin of the path (like '.a.b.c')
      const newPath = ancestry === '' ? key : `${ancestry}.${key}`;
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

export default plain;

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
