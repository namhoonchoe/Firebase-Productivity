export type UserDocument = {
  username: string;
  user_id: string; 
};

export type FolderDocument = {
  folder_id: string;
  folder_name: string;
  memo_ids:string [];
 };

export type MemoDocument = {
  memo_id: string;
  title: string;
  bookmarked: boolean;
};

export enum BoardStatus {
  onSchedule ="계획대로 진행중",
  behindSchedule = "지연됨",
  offTrack = "위험함",
  completed = "완료"
}

export type BoardDocument = {
  board_id: string;
  board_name: string;
  board_description: string|null;
  board_due_date: string|null;
  board_status: BoardStatus|null;
  board_bg_color: string;
  last_edited: string;
  section_ids: string [];
  archived: boolean;
};

export type SectionDocument = {
  section_id: string;
  section_name: string;
  archived: boolean;
};

export type TaskDocument = {
  task_id: string;
  section_id: string;
  start_date: string | null;
  due_date: string | null;
  task: string;
  description: string | null;
  archived: boolean;
};
