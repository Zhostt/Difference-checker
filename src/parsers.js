import YAML from 'yaml';
// преобразователь строк из файлов в объекты, парсит по указанному на входу формату

const stringParserToObject = (contentString, format) => {
  if (format === 'JSON') {
    return JSON.parse(contentString);
  }
  if (format === 'YML') {
    return YAML.parse(contentString);
  }
  console.log('unknown format type. Try YAML or JSON');
  return null;
};

export default stringParserToObject;
