import { SectionDocument,TaskDocument } from "@/Types/FireStoreModels";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
  
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

interface IKanbanStore {
  sections: SectionDocument[];
  taskList: TaskDocument[];
  sectionsSnapShot: SectionDocument[];
  taskListSnapShot: TaskDocument[];
  sectionIds: string[];

  deletedTQ: string[];
  deletedSQ: string[];

  setSectionIds: (sections: SectionDocument[]) => void;
  setSections: (sections: SectionDocument[]) => void;
  setTaskList: (lists: TaskDocument[]) => void;
  setSsnapshot: (sections: SectionDocument[]) => void;
  setTsnapshot: (lists: TaskDocument[]) => void;
  setDeletedTasks: (targetId:string) => void;
  setDeletedSections: (targetId:string) => void;

  createSection: (sectionName: string, boardId: string) => void;
  updateSection: (targetId: string, payload: SectionPayload) => void;
  deleteSection: (targetId: string) => void;
  clearSection: (targetSectionId: string) => void;
  swapSection: (currentIndex: number, targetIndex: number) => void;

  createTask: (payload: TaskPayload, boardId: string) => void;
  deleteTask: (targetId: string) => void;
  updateTask: (payload: TaskPayload, targetId: string) => void;
}

export const useKanbanStore = create<IKanbanStore>()(
  persist(
    (set) => ({
      sections: [] as SectionDocument[],
      sectionsSnapShot: [] as SectionDocument[],
      taskList: [] as TaskDocument[],
      taskListSnapShot: [] as TaskDocument[],
      sectionIds: [] as string[],

      deletedTQ: [] as string[],
      deletedSQ: [] as string[],

      setSections: (sections: SectionDocument[]) => {
        set(() => ({ sections: [...sections] }));
      },

      setSsnapshot: (sections: SectionDocument[]) => {
        set(() => ({ sectionsSnapShot: [...sections] }));
      },

      setDeletedSections: (targetId:string) => {
        set((state) => ({
          deletedSQ:[
            ...state.deletedSQ,targetId
          ]
        }));
      },

      setTaskList: (lists: TaskDocument[]) => {
        set(() => ({ taskList: [...lists] }));
      },

      setTsnapshot: (lists: TaskDocument[]) => {
        set(() => ({ taskListSnapShot: [...lists] }));
      },

      setDeletedTasks: (targetId:string) => {
        set((state) => ({
          deletedTQ:[
            ...state.deletedTQ,targetId
          ]
        }));
      },

      setSectionIds: (sections: SectionDocument[]) => {
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

      createTask: (payload: TaskPayload, boardId: string) => {
        set((state) => ({
          taskList: [
            ...state.taskList,
            {
              ...payload,
              board_id: boardId,
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
          taskList: state.taskList.map((task: TaskDocument) => {
            if (task.task_id === taskId) {
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
