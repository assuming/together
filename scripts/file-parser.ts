const Blamer = require('blamer');
import path from 'path';
import glob from 'glob';
import { CommitRecordItem } from './common';

interface FileListItem {
  name: string;
  path: string;
  extension: string;
  loc: number;
  commitRecord: CommitRecordItem[];
  contributeMap: ContributeMap;
}
interface ContributeMap {
  [key: string]: {
    totalLoc: number;
    percent: number;
    lines: number[];
  };
}

function parse() {
  const basePath = path.resolve(__dirname, '../../desktop');

  glob(
    '**/*.+(ts|tsx)',
    {
      cwd: basePath,
      root: basePath,
      realpath: true
    },
    async (err, files) => {
      const blamer = new Blamer();
      const result = await blamer.blameByFile(files[0]);
      console.log(result);
    }
  );
}

parse();
