import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Task, Section } from "@/Types/FireStoreModels";

type TaskPayload = {
  task_title: string;
  section_id: string;
  description: string;
  start_date: Date | string;
  due_date: Date | string;
  archived: boolean;
};

type SectionPayload = {
  section_name: string;
  archived: boolean;
};

/**인터페이스 타입에 주의 할 것 */
type State = {
  sections: Section[];
  taskList: Task[];
};

const initialState: State = {
  sections: [],
  taskList: [],
};

interface IKanbanStore {
  resetState: () => void;
  setSections: (sections: Section[]) => void;
  setTaskList: (lists: Task[]) => void;
  getAliveSections: () => Section[];

  createSection: (sectionName: string) => void;
  updateSection: (targetId: string, payload: SectionPayload) => void;
  deleteSection: (targetId: string) => void;
  clearSection: (targetSectionId: string) => void;
  swapSection: (currentIndex: number, targetIndex: number) => void;

  createTask: (payload: TaskPayload) => void;
  deleteTask: (targetId: string) => void;
  updateTask: (payload: TaskPayload, targetId: string) => void;
}

export const useKanbanStore = create<State & IKanbanStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      resetState: () => {
        set(initialState);
      },

      setSections: (sections: Section[]) => {
        set(() => ({ sections: [...sections] }));
      },

      getAliveSections: () => {
        return get().sections.filter((section) => !section.archived);
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

      updateTask: (payload: TaskPayload, taskId: string) => {
        set((state) => ({
          taskList: state.taskList.map((task: Task) => {
            if (task && task.task_id === taskId) {
              return { ...task, ...payload };
            } else {
              return task;
            }
          }),
        }));
      },
    }),

    {
      name: "kanbanStorage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
