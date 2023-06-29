import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import axios from 'axios';

dotenv.config();

const apiKey = process.env.POSTMAN_API_KEY;
const collectionUid = process.env.COLLECTION_UID;
const environmentId = process.env.ENVIRONMENT_ID;
const updateCollectionUrl = `https://api.getpostman.com/collections/${collectionUid}`;
const updateEnvUrl = `https://api.getpostman.com/environments/${environmentId}`;

// Generate the absolute path for the JSON file

const directoryPath = path.resolve(__dirname, '../../postman/collections');
const mainJsonName = 'main.json';
const mainPath = path.resolve(__dirname, `${directoryPath}/${mainJsonName}`);

let collection = JSON.parse(fs.readFileSync(mainPath, 'utf-8'));

// function to get file content and return the required object structure
const getFileContent = (filePath: string, fileName: string): object => {
  const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return {
    "name": fileName.replace('.json', ''),
    "item": fileContent
  };
};
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.error('Unable to scan directory: ' + err);
  }

  for (const file of files) {
    if (file !== mainJsonName) {
      const filePath = path.join(directoryPath, file);
      const fileContentObject = getFileContent(filePath, file);
      collection.item.push(fileContentObject);
    }
  }

  const headers = {
    'X-Api-Key': apiKey,
    'Content-Type': 'application/json'
  };

  axios.put(updateCollectionUrl, {collection}, {headers: headers})
    .then(response => console.log(response.data))
    .catch(error => {
        console.log(error.response.data)
      }
    );

  const envConfigPath = path.resolve(__dirname, '../../postman/env/env.json');
  let environment = JSON.parse(fs.readFileSync(envConfigPath, 'utf-8'));

  axios.put(updateEnvUrl, {environment}, {headers: headers})
    .then(response => console.log(response.data))
    .catch(error => {
        console.log(error.response.data)
      }
    );
});




