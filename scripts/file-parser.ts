import { Author, CommitRecordItem } from './common-types';

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

function parse() {}

// parse()
