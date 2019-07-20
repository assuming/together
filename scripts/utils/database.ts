import fs from 'fs';
import path from 'path';

const databasePath = path.resolve(__dirname, '../../database/');

export function saveJSON(name: string, jsonData: any) {
  const filePath = path.resolve(databasePath, name);
  fs.writeFileSync(filePath, JSON.stringify(jsonData, undefined, 2));
}
