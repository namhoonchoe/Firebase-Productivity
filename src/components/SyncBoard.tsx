import { db } from "@/services/firebase";
import { useKanbanStore } from "@/store/KanbanStore";
import { SectionDocument, TaskDocument } from "@/Types/FireStoreModels";
import { doc, writeBatch } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function SyncBoard() {
  const {
    sections,
    taskList,
    sectionsSnapShot,
    taskListSnapShot,
    deletedSQ,
    deletedTQ,
  } = useKanbanStore();
  const batch = writeBatch(db);
  const location = useLocation();
  const {
    state: { prevPath },
  } = location;

  useEffect(() => {
    const syncToFS = async () => {
      const updatedSQ = [] as SectionDocument[];
      const updatedTQ = [] as TaskDocument[];
      const newSQ = [] as SectionDocument[];
      const newTQ = [] as TaskDocument[];

      sections.map((section: SectionDocument) => {
        if (!sectionsSnapShot.includes(section)) {
          newSQ.push(section);
        } else {
          sectionsSnapShot.map((sectionSnapShot: SectionDocument) => {
            if (sectionSnapShot.section_id === section.section_id) {
              if (JSON.stringify(sectionSnapShot) !== JSON.stringify(section)) {
                updatedSQ.push(section);
              }
            }
          });
        }
      });

      taskList.map((task: TaskDocument) => {
        if (!taskListSnapShot.includes(task)) {
          newTQ.push(task);
        } else {
          taskListSnapShot.map((taskSnapShot: TaskDocument) => {
            if (taskSnapShot.task_id === task.task_id) {
              if (JSON.stringify(taskSnapShot) !== JSON.stringify(task)) {
                updatedTQ.push(task);
              }
            }
          });
        }
      });

      deletedSQ.map((sectionId) =>
        batch.delete(doc(db, "sections", sectionId)),
      );

      deletedTQ.map((taskId) => {
        batch.delete(doc(db, "tasks", taskId));
      });

      /** updated sections */
      updatedSQ.map((section: SectionDocument) => {
        batch.update(doc(db, "sections", section.section_id), {
          ...section,
        });
      });

      /** updated tasks */
      updatedTQ.map((task: TaskDocument) => {
        batch.update(doc(db, "tasks", task.task_id), {
          ...task,
        });
      });

      /** add new sections to firestore */
      newSQ.map((section: SectionDocument) => {
        batch.set(doc(db, "sections", section.section_id), {
          ...section,
        });
      });

      /** add new tasks to firetore */
      newTQ.map((task: TaskDocument) => {
        batch.set(doc(db, "tasks", task.task_id), {
          ...task,
        });
      });
    };
    console.log(prevPath);
    if (prevPath === "asdf") {
      syncToFS();
    }
  }, [location]);
}
