import { IFile } from './IFile.ts';

export const deleteFiles = async (files: IFile[]) => {
  for (const file of files) {
    await Deno.remove(file.path);
    console.log(`🗑 ${file.path} has been deleted`);
  }
};
