import { Table } from 'https://deno.land/x/cliffy@v0.16.0/table/mod.ts';
import { getFilesInDir } from './getFilesInDir.ts';
import { IFile } from './IFile.ts';
import { daysUntilDelete } from './config.ts';
import { deleteFiles } from './deleteFiles.ts';

const getTotalFileSize = (files: IFile[]): number =>
  files.map((f) => f.size).reduce((x, y) => x + y, 0);
const formatBytesToMB = (bytes: number): string =>
  (bytes / 1024 / 1024).toFixed(2);

const logFilesToBeDeleted = (filesToBeDeleted: IFile[]) => {
  console.log('Files to be deleted:');

  if (filesToBeDeleted.length > 100) {
    filesToBeDeleted.forEach((file) => {
      console.log(
        `${file.path} | ${file.modifiedDate!.toDateString()} | ${
          formatBytesToMB(file.size)
        }`,
      );
    });
  } else {
    // deno-lint-ignore no-explicit-any
    const tbody: any[] = [];
    let i = 0;
    filesToBeDeleted.forEach((file) => {
      if (i < 100) {
        tbody.push([
          file.path,
          file.modifiedDate!.toDateString(),
          formatBytesToMB(file.size),
        ]);
        i = i + 1;
      }
    });

    new Table()
      .header(['File', 'Last Modified', 'Size (MB)'])
      .body(tbody)
      .border(true)
      .render();
  }
};

const main = async () => {
  console.log('----------');
  console.log('🚀 tempdel 🚀');

  console.log('getting file information...');
  const files = await getFilesInDir('../../temp');
  const totalFileSize = getTotalFileSize(files);
  const totalFileSizeMb = formatBytesToMB(totalFileSize);

  const filesToBeDeleted = files.filter((f) => f.toBeDeleted);
  const filesToBeDeletedFileSize = getTotalFileSize(filesToBeDeleted);
  const filesToBeDeletedFileSizeMb = formatBytesToMB(filesToBeDeletedFileSize);

  const percentageToBeDeleted =
    ((filesToBeDeletedFileSize / totalFileSize) * 100).toFixed(2);

  if (filesToBeDeleted.length) {
    logFilesToBeDeleted(filesToBeDeleted);
  }

  new Table()
    .header(['', 'File Count', 'File Size (MB)', '%'])
    .body([
      ['All files', files.length, totalFileSizeMb, 100],
      [
        'To be deleted',
        filesToBeDeleted.length,
        filesToBeDeletedFileSizeMb,
        percentageToBeDeleted,
      ],
    ]).border(true).render();

  if (!filesToBeDeleted.length) {
    console.log(`There are 0 files older than ${daysUntilDelete} days`);
    return;
  }

  if (
    confirm(
      `Do you wish to delete the ${filesToBeDeleted.length} files that are older than ${daysUntilDelete} days?`,
    )
  ) {
    await deleteFiles(filesToBeDeleted);
  }
};

await main();
