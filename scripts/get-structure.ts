import path from 'path';
import glob from 'glob';
import {
  getContributorInfo,
  ContributorInfoItem,
  CommitRecordItem,
  getCommitRecord,
  getLOC
} from './utils';
import { basePath } from './utils/const';
import { saveJSON } from './utils/database';

interface FileListItem {
  name: string;
  path: string;
  extension: string;
  loc: number;
  commitRecord: CommitRecordItem[];
  contributorInfo: ContributorInfoItem[];
}

async function getStructureAndSave() {
  glob(
    '**/*.+(ts|tsx)',
    {
      cwd: basePath,
      root: basePath,
      realpath: true
    },
    async (err, files) => {
      const list: FileListItem[] = [];
      for (const filepath of files) {
        console.log(`->  ${filepath}`);

        const [contributorInfo, commitRecord, loc] = await Promise.all([
          getContributorInfo(filepath),
          getCommitRecord(basePath, filepath),
          getLOC(filepath)
        ]);
        list.push({
          name: path.basename(filepath),
          path: filepath,
          extension: path.extname(filepath),
          loc,
          commitRecord,
          contributorInfo
        });
      }

      saveJSON('structure.json', list);
    }
  );
}

getStructureAndSave();
