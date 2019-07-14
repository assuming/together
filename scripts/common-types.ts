export interface Author {
  name: string;
  email: string;
}
export interface CommitRecordItem {
  id: string;
  time: number;
  author: Author;
  message: string;
}
