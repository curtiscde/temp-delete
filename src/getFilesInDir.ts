import { walk } from 'https://deno.land/std@0.138.0/fs/mod.ts';
import { IFile } from './IFile.ts';
import { daysUntilDelete } from './config.ts';

const now: Date = new Date();
const delThreshold: Date = new Date(now);
delThreshold.setDate(delThreshold.getDate() - daysUntilDelete);

export const getFilesInDir = async (directory: string): Promise<IFile[]> => {
  const files: IFile[] = [];

  for await (const dirEntry of walk(directory)) {
    if (dirEntry.isFile) {
      const fileInfo = await Deno.stat(dirEntry.path);

      const file: IFile = {
        fileName: dirEntry.name,
        modifiedDate: fileInfo.mtime,
        path: dirEntry.path,
        size: fileInfo.size,
        toBeDeleted: fileInfo.mtime
          ? fileInfo.mtime.getTime() < delThreshold.getTime()
          : false,
      };

      files.push(file);
    }
  }

  return files;
};
