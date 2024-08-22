import { create } from "zustand";

type Section = {
  section_name: string;
  section_id: string;
  archived: boolean;

};

type Task = {
  task_id: string;
  section_id: string;
  task_title: string;
  description: string | null;
  start_date: string | null;
  due_date: string | null;
  archived: boolean;

};

type TaskPayload = {
  title: string;
  sectionId: string;
  description: string | null;
  startDate: string | null;
  dueDate: string | null;
  archived: boolean;
};

/**인터페이스 타입에 주의 할 것 */

interface IKanbanStore {
  sections: Section[];
  taskList: Task[];

  setSections: (sections: Section[]) => void;
  setTaskList: (lists: Task[]) => void;

  createSection: (sectionName: string) => void;
  editSection: (targetId: string, newSectionName: string) => void;
  deleteSection: (targetId: string) => void;
  clearSection: (targetId: string) => void;

  createTask: (payload: TaskPayload) => void;
  deleteTask: (targetId: string) => void;
  updateTask: (payload: TaskPayload, targetId: string) => void;
}

export const useKanbanStore = create<IKanbanStore>((set) => ({
  sections: [],
  taskList: [],

  setSections: (sections: Section[]) => {
    set(() => ({ sections: [...sections] }));
  },
  setTaskList: (lists: Task[]) => {
    set(() => ({ taskList: [...lists] }));
  },

  createSection: (sectionName: string) =>
    set((state) => ({
      sections: [
        ...state.sections,
        {
          section_name: sectionName,
          section_id: crypto.randomUUID(),
          archived:false
        },
      ],
    })),

  editSection: (targetId: string, newSectionName: string) => {
    set((state) => ({
      sections: state.sections.map((section) => {
        if (section.section_id === targetId) {
          return { ...section, section_name:newSectionName };
        } else {
          return section;
        }
      }),
    }));
  },

  deleteSection: (targetId: string) => {
    set((state) => ({
      sections: state.sections.filter(
        (section) => section.section_id !== targetId,
      ),
    }));
  },

  clearSection: (targetId: string) => {
    set((state) => ({
      taskList: state.taskList.filter((task) => task.section_id !== targetId),
    }));
  },

  createTask: (payload: TaskPayload) => {
    const { title, description, startDate, dueDate, sectionId } = payload;

    set((state) => ({
      taskList: [
        ...state.taskList,
        {
          task_id: crypto.randomUUID(),
          task_title: title,
          description: description,
          start_date: startDate,
          due_date: dueDate,
          section_id: sectionId,
          archived:false
        },
      ],
    }));
  },

  deleteTask: (taskId: string) => {
    set((state) => ({
      taskList: state.taskList.filter((task) => task.task_id !== taskId),
    }));
  },

  /**
   * 업데이트 태스크 ?????
   *
   *
   */

  updateTask: (payload: TaskPayload, taskId: string) => {
    set((state) => ({
      taskList: state.taskList.map((task) => {
        if (task.task_id === taskId) {
          return { ...task, ...payload };
        } else {
          return task;
        }
      }),
    }));
  },
}));
