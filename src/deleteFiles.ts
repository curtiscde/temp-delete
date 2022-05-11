import { IFile } from "./IFile.ts";

export const deleteFiles = async (files: IFile[]) => {
  let i = 0;

  for (const file of files) {
    if (i == 0){
      await Deno.remove(file.path);
      console.log(`🗑 ${file.path} has been deleted`);
    }

    i = i + 1;
  }
}