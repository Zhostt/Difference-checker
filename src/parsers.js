
import YAML from 'yaml'
// преобразователь строк из файлов в объекты, парсит по указанному на входу формату

const stringParserToObject = (contentString, format) => {
  if (format === 'JSON'){
    return JSON.parse(contentString);
  }
  if (format === 'YML'){
    return YAML.parse(contentString);
  }
};

export default stringParserToObject