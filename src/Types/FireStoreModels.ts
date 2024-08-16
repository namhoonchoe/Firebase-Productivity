export type UserDocument = {
  username: string;
  user_id: string; 
};

export type FolderDocument = {
  folder_id: string;
  folder_name: string;
  user_id: string;
};

export type MemoDocument = {
  memo_id: string;
  title: string;
  bookmarked: boolean;
  user_id: string;
  folder_id: string;
};

export type BoardDocument = {
  board_id: string;
  board_name: string;
  last_edited: string;
  list_ids: string [];
  user_id: string; /* ????? 필요 없는듯 */
};

export type TaskListDocument = {
  task_list_id: string;
  task_list_name: string;
  tasks: TaskDocument[];
};

export type TaskDocument = {
  task_id: string;
  task_list_id: string;
  start_date: string;
  due_date: string;
  task: string;
  description: string;
};
