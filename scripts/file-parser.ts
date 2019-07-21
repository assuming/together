import path from 'path';
import glob from 'glob';
import {
  getTopContributor,
  getContributorInfo,
  ContributorInfoItem,
  CommitRecordItem,
  getCommitRecord,
  getLOC
} from './utils';
import { saveJSON } from './utils/database';

interface FileListItem {
  name: string;
  path: string;
  extension: string;
  loc: number;
  commitRecord: CommitRecordItem[];
  contributorInfo: ContributorInfoItem[];
}

async function parse() {
  const basePath = path.resolve(__dirname, '../../desktop');

  const topContributorResult = await getTopContributor(basePath, 1000);
  saveJSON('top-contributor.json', topContributorResult);

  const projectCommitRecordResult = await getCommitRecord(basePath);
  saveJSON('project-commit-record.json', projectCommitRecordResult);

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

parse();
