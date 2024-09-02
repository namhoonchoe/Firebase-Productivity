export type UserDocument = {
  username: string;
  user_id: string;
};

export type FolderDocument = {
  folder_id: string;
  folder_name: string;
  memo_ids: string[];
};

export type MemoDocument = {
  memo_id: string;
  title: string;
  bookmarked: boolean;
};


export type BoardDocument = {
  user_id: string;
  board_id: string;
  board_name: string;
  board_description: string;
  board_due_date: Date | string;
  board_status:  string;
  board_bg_color: string;
  last_edited: string;
  archived: boolean;
};

export type SectionDocument = {
  board_id: string;
  section_id: string;
  section_name: string;
  archived: boolean;
};

export type TaskDocument = {
  task_id: string;
  section_id: string;
  board_id: string;
  start_date: Date| string;
  due_date: Date | string;
  task_title: string;
  description: string  ;
  archived: boolean;
};
