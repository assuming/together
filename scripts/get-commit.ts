import path from 'path';
import { getCommitRecord } from './utils';
import { saveJSON } from './utils/database';
import { basePath } from './utils/const';

export async function getCommitAndSave() {
  const commitRecordResult = await getCommitRecord(basePath);
  saveJSON('commit-record.json', commitRecordResult);
}

getCommitAndSave();
