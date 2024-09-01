import { create } from "zustand";

type Section = {
  section_name: string;
  board_id: string;
  section_id: string;
  archived: boolean;
};

type Task = {
  task_id: string;
  section_id: string;
  board_id: string;
  task_title: string;
  description: string  ;
  start_date: Date | string;
  due_date: Date | string;
  archived: boolean;
};

type TaskPayload = {
  task_title: string;
  section_id: string;
  description: string  ;
  start_date: Date | string;
  due_date: Date | string;
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
  sectionIds: string[];

  setSectionIds: (sections: Section[]) => void;
  setSections: (sections: Section[]) => void;
  setTaskList: (lists: Task[]) => void;

  createSection: (sectionName: string, boardId: string) => void;
  updateSection: (targetId: string, payload: SectionPayload) => void;
  deleteSection: (targetId: string) => void;
  clearSection: (targetSectionId: string) => void;
  swapSection: (currentIndex: number, targetIndex: number) => void;

  createTask: (payload: TaskPayload, boardId:string) => void;
  deleteTask: (targetId: string) => void;
  updateTask: (payload: TaskPayload, targetId: string) => void;
}

export const useKanbanStore = create<IKanbanStore>((set) => ({
  sections: [],
  taskList: [],
  sectionIds: [],

  setSections: (sections: Section[]) => {
    set(() => ({ sections: [...sections] }));
  },

  setTaskList: (lists: Task[]) => {
    set(() => ({ taskList: [...lists] }));
  },

  setSectionIds: (sections: Section[]) => {
    const idBucket = [] as string[];
    sections.map((section) => idBucket.push(section.section_id));
    set(() => ({
      sectionIds: idBucket,
    }));
  },

  createSection: (sectionName: string, boardId: string) =>
    set((state) => ({
      sections: [
        ...state.sections,
        {
          section_name: sectionName,
          board_id: boardId,
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

  swapSection: (currentIndex: number, targetIndex: number) => {
    if (currentIndex > targetIndex) {
      set((state) => ({
        sections: [
          ...state.sections.slice(0, targetIndex),
          state.sections[currentIndex] /** part a  */,
          ...state.sections.slice(targetIndex + 1, currentIndex),
          /** part b */
          state.sections[targetIndex],
          ...state.sections.slice(currentIndex + 1),
        ],
      }));
    }

    if (currentIndex < targetIndex) {
      set((state) => ({
        sections: [
          ...state.sections.slice(0, currentIndex),
          state.sections[targetIndex] /** part a  */,
          ...state.sections.slice(currentIndex + 1, targetIndex),
          /** part b */
          state.sections[currentIndex],
          ...state.sections.slice(targetIndex + 1),
        ],
      }));
    }
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

  createTask: (payload: TaskPayload,boardId:string) => {
    set((state) => ({
      taskList: [
        ...state.taskList,
        {
          ...payload,
          board_id:boardId,
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
