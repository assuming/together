import { spawn } from 'child_process';

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
