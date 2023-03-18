import * as fs from 'fs';
import path from 'path';


// JSON преобразователь путей к файлам в их содержимое в виде объекта
const pathParserToObject = (pathGiven) => {
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


  export default pathParserToObject