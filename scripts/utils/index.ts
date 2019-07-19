import { spawn } from 'child_process';
const Blamer = require('blamer');

/**
 * Get the top contributor list from a given project
 *
 * @param path
 * @param n
 */
export async function getTopContributor(
  path: string,
  n: number
): Promise<
  Array<{
    name: string;
    commitCount: number;
  }>
> {
  return new Promise((resolve, reject) => {
    const cmd = spawn('git', ['shortlog', '-sn'], {
      cwd: path,
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
          commitCount: parseInt(countRawString)
        };
      });
      resolve(topList.slice(0, n));
    });
  });
}

/**
 * Get the git blame info for given file
 *
 * @param path
 */
export async function getBlameInfo(
  path: string
): Promise<
  Array<{
    rev: string;
    author: string;
    data: string;
    line: string;
  }>
> {
  const blamer = new Blamer();
  const result = await blamer.blameByFile(path);

  const obj = result[path];
  return Object.keys(obj).map(key => obj[key]);
}

/**
 * Get the contribution array per author sorted from large to small
 * @param lineInfoList
 */
export function getOwnerList(
  lineInfoList: Array<{ author: string }>
): Array<{
  author: string;
  loc: number;
}> {
  const hash = {};
  lineInfoList.map(item => {
    if (hash[item.author]) {
      hash[item.author] += 1;
    } else {
      hash[item.author] = 1;
    }
  });
  const ownerList = Object.keys(hash)
    .map(key => ({
      author: key,
      loc: hash[key]
    }))
    .sort((a, b) => b.loc - a.loc);

  return ownerList;
}
