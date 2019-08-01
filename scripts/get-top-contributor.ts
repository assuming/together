import path from 'path';
import { getTopContributor } from './utils';
import { saveJSON } from './utils/database';
import { basePath } from './utils/const';

export async function getTopContributorAndSave() {
  const topContributorResult = await getTopContributor(basePath, 1000);
  saveJSON('top-contributor.json', topContributorResult);
}

getTopContributorAndSave();
