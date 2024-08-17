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

export type BoardDocument = {
  board_id: string;
  board_name: string;
  last_edited: string;
  list_ids: string [];
};

export type TaskListDocument = {
  task_list_id: string;
  task_list_name: string;
  tasks: TaskDocument[];
};

export type TaskDocument = {
  task_id: string;
  task_list_id: string;
  start_date: string | null;
  due_date: string | null;
  task: string;
  description: string | null;
};
