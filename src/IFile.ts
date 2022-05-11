export interface IFile {
  fileName: string;
  modifiedDate: Date | null;
  path: string;
  size: number;
  toBeDeleted: boolean;
}
