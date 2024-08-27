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
  description: string | undefined;
  start_date: Date | undefined;
  due_date: Date | undefined;
  archived: boolean;
};

type TaskPayload = {
  task_title: string;
  section_id: string;
  description: string | undefined;
  start_date: Date | undefined;
  due_date: Date | undefined;
  archived: boolean;
};

type SectionPayload = {
  section_name: string;
  archived: boolean;
};

/**인터페이스 타입에 주의 할 것 */

interface IKanbanStore {
  sections: Section[];
  taskList: Task[];

  setSections: (sections: Section[]) => void;
  setTaskList: (lists: Task[]) => void;

  createSection: (sectionName: string) => void;
  updateSection:(targetId: string, payload: SectionPayload) => void;
   deleteSection: (targetId: string) => void;
  clearSection: (targetSectionId: string) => void;
 

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
          archived: false,
        },
      ],
    })),

  updateSection: (targetId: string, payload: SectionPayload) => {
    set((state) => ({
      sections: state.sections.map((section) => {
        if (section.section_id === targetId) {
          return { ...section, ...payload };
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

  clearSection: (targetSectionId: string) => {
    set((state) => ({
      taskList: state.taskList.map((task) => {
        if (task.section_id === targetSectionId) {
          return { ...task, archived: true };
        } else {
          return task;
        }
      }),
    }));
  },

  createTask: (payload: TaskPayload) => {
    set((state) => ({
      taskList: [
        ...state.taskList,
        {
          ...payload,
          task_id: crypto.randomUUID(),
          archived: false,
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
