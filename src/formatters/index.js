import stylish from './stylish.js';
import plain from './plain.js';

const formatSelector = (compareTree, format) => {
  if (format === 'stylish') return `{\n${stylish(compareTree)}}`;
  if (format === 'plain') return plain(compareTree);
  return ('Error: Enter valid format or use default - stylish');
};

export default formatSelector;
