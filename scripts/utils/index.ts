import { spawn } from 'child_process';
const Blamer = require('blamer');
const linecount = require('linecount');

export async function getTopContributor(
  pathString: string,
  n: number
): Promise<
  Array<{
    name: string;
    count: number;
  }>
> {
  return new Promise((resolve, reject) => {
    const cmd = spawn('git', ['shortlog', '-sn'], {
      cwd: pathString,
      stdio: ['inherit', 'pipe', 'pipe']
    });
    let result = '';

    cmd.stdout!.on('data', data => {
      result += data.toString();
    });
    cmd.on('error', err => reject(err));
    cmd.on('close', () => {
      const topList = result.split('\n').map(item => {
        const [countRawString, name] = item.split('\t');
        return {
          name,
          count: parseInt(countRawString)
        };
      });
      resolve(topList.slice(0, n));
    });
  });
}

export interface ContributorInfoItem {
  author: string;
  loc: number;
  percent: number;
  lines: number[];
}
export async function getContributorInfo(
  pathString: string
): Promise<ContributorInfoItem[]> {
  const blamer = new Blamer();
  const blamerResult = (await blamer.blameByFile(pathString))[pathString];
  const blamerResultArray = Object.keys(blamerResult).map(line => ({
    ...blamerResult[line],
    author: blamerResult[line].author.trim(),
    line: parseInt(line)
  }));

  const fileLoc = blamerResultArray.length;
  const hash = {};
  blamerResultArray.map(item => {
    if (hash[item.author]) {
      hash[item.author].push(item.line);
    } else {
      hash[item.author] = [item.line];
    }
  });
  const ownerList = Object.keys(hash)
    .map(key => ({
      author: key,
      loc: hash[key].length,
      percent: parseFloat((hash[key].length / fileLoc).toFixed(4)),
      lines: hash[key]
    }))
    .sort((a, b) => b.loc - a.loc);

  return ownerList;
}

export interface CommitRecordItem {
  id: string;
  time: number;
  author: string;
  message: string;
}
export async function getCommitRecord(
  rootPath: string,
  filePath?: string
): Promise<CommitRecordItem[]> {
  return new Promise((resolve, reject) => {
    const seperator = '=====';
    let commandArray = ['log', `--pretty=%h%n%an%n%at%n%s%n${seperator}`];
    const byFileCommandArray = ['--', filePath!];
    commandArray = filePath
      ? [...commandArray, ...byFileCommandArray]
      : commandArray;

    const cmd = spawn('git', commandArray, {
      cwd: rootPath,
      stdio: ['inherit', 'pipe', 'pipe']
    });
    let res = '';

    cmd.stdout!.on('data', data => {
      res += data.toString();
    });
    cmd.on('error', err => reject(err));
    cmd.on('close', () => {
      const splitted = res.split(seperator);
      splitted.pop();
      const result = splitted.map((rawCommitInfoString, index) => {
        const [id, author, time, message] = rawCommitInfoString
          .split('\n')
          .filter(i => i);
        return {
          id,
          time: parseInt(time),
          author,
          message
        };
      });
      resolve(result);
    });
  });
}

export async function getLOC(pathString: string): Promise<number> {
  return new Promise((resolve, reject) => {
    linecount(pathString, (err, count: number) => {
      if (err) {
        reject(err);
      } else {
        resolve(count);
      }
    });
  });
}
