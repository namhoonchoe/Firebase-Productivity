import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Task, Section } from "@/Types/FireStoreModels";

type TaskPayload = {
  task_title: string;
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
};

const initialState: State = {
  sections: [],
};

interface IKanbanStore {
  resetState: () => void;
  setSections: (sections: Section[]) => void;
  getAliveSections: () => Section[];

  createSection: (sectionName: string) => void;
  updateSection: (targetId: string, payload: SectionPayload) => void;
  deleteSection: (targetId: string) => void;
  clearSection: (targetId: string) => void;
  swapSection: (currentIndex: number, targetIndex: number) => void;

  getTaskList: (secctionId: string) => Task[];
  setTaskList: (secctionId: string,newTaskList:Task[]) => void;
  createTask: (payload: TaskPayload, sectionId: string) => void;
  deleteTask: (targetId: string, sectionId: string) => void;
  updateTask: (
    payload: TaskPayload,
    targetId: string,
    sectionId: string,
  ) => void;
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

      createSection: (sectionName: string) =>
        set((state) => ({
          sections: [
            ...state.sections,
            {
              section_name: sectionName,
              section_id: crypto.randomUUID(),
              archived: false,
              task_list: [],
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

      clearSection: (sectionId: string) => {
        set((state) => ({
          sections: state.sections.map((section) => {
            if (section.section_id === sectionId) {
              return { ...section, task_list: [] };
            } else {
              return section;
            }
          }),
        }));
      },

      getTaskList: (sectionId: string) => {
        return get().sections.filter(
          (section) => section.section_id === sectionId,
        )[0].task_list;
      },

      setTaskList:(sectionId: string, newTaskList:Task[]) => {
        set((state) => ({
          sections: state.sections.map((section) => {
            if (section.section_id === sectionId) {
               
              return {
                ...section,
                task_list: [...newTaskList]
              };
            } else {
              return section;
            }
          }),
        }));
      },

      createTask: (payload: TaskPayload, sectionId: string) => {
        const newTask = {
          ...payload,
          task_id: crypto.randomUUID(),
          archived: false,
        };

        set((state) => ({
          sections: state.sections.map((section) => {
            if (section.section_id === sectionId) {
              const taskList = section.task_list
              return {
                ...section,
                task_list: [...taskList,newTask]
              };
            } else {
              return section;
            }
          }),
        }));
      },

      deleteTask: (taskId: string, sectionId: string) => {
        set((state) => ({
          sections: state.sections.map((section) => {
            if (section.section_id === sectionId) {
              return {
                ...section,
                task_list: section.task_list.filter(
                  (task) => task.task_id !== taskId,
                ),
              };
            } else {
              return section;
            }
          }),
        }));
      },

      updateTask: (payload: TaskPayload, taskId: string, sectionId: string) => {
        set((state) => ({
          sections: state.sections.map((section) => {
            if (section.section_id === sectionId) {
              return {
                ...section,
                task_list: section.task_list.map((task: Task) => {
                  if (task && task.task_id === taskId) {
                    return { ...task, ...payload };
                  } else {
                    return task;
                  }
                }),
              };
            } else {
              return section;
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
