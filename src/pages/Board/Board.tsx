import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
   writeBatch,
} from "firebase/firestore";

import { db } from "@/services/firebase";
import { Unsubscribe } from "firebase/auth";
import {
  BoardDocument,
  SectionDocument,
  TaskDocument,
} from "@/Types/FireStoreModels";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import Kanban from "@/pages/Board/Kanban";
import { useKanbanStore } from "@/store/KanbanStore";
import BoardHeader from "./BoardHeader";

export default function Board() {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [boardState, setBoardState] = useState<BoardDocument>({
    user_id: "",
    board_id: "",
    board_name: "",
    board_description: "",
    board_due_date: "",
    tasks: [],
    sections: [],
    board_status: "",
    board_bg_color: "",
    last_edited: "",
    section_ids: [],
    taks_ids: [],
    archived: false,
  });

  const {
    sections,
    taskList,
    sectionIds,
    taskIds,
    sectionsSnapShot,
    taskListSnapShot,
    deletedSQ,
    deletedTQ,
    setTaskList,
    setSsnapshot,
    setTsnapshot,
    setSections,
    setTaskIds,
    setSectionIds,
    resetState
  } = useKanbanStore();

  const batch = writeBatch(db);

  const syncToFS = async () => {
    const updatedSQ = [] as SectionDocument[];
    const updatedTQ = [] as TaskDocument[];
    const newSQ = [] as SectionDocument[];
    const newTQ = [] as TaskDocument[];

    setTaskIds(taskList)
    setSectionIds(sections)


    await setDoc(doc(db,`boards/${boardId}`), {
      section_ids: sectionIds,
      taks_ids: taskIds,
    },{merge: true});
    

    /**set updated sq */
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
    
    /**set updated tq */
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
      batch.delete(doc(db, `boards/${boardId}/sections`, sectionId)),
    );

    deletedTQ.map((taskId) => {
      batch.delete(doc(db, `boards/${boardId}/tasks`, taskId));
    });

    /** updated sections */
    updatedSQ.map((section: SectionDocument) => {
      batch.update(doc(db, `boards/${boardId}/sections`, section.section_id), {
        ...section,
      });
    });

    /** updated tasks */
    updatedTQ.map((task: TaskDocument) => {
      batch.update(doc(db, `boards/${boardId}/tasks`, task.task_id), {
        ...task,
      });
    });

    /** add new sections to firestore */
    newSQ.map((section: SectionDocument) => {
      batch.set(doc(db, `boards/${boardId}/sections`, section.section_id), {
        ...section,
      });
    });

    /** add new tasks to firetore */
    newTQ.map((task: TaskDocument) => {
      batch.set(doc(db, `boards/${boardId}/tasks`, task.task_id), {
        ...task,
      });
    });

    /**send task ids to order tasklist */
    

    await batch.commit();
  };

  const dispatchRef = useRef<() => Promise<void>>();
  /**왜 여기에 선언해야 하는지 설명해야 함 */
  dispatchRef.current = syncToFS;

  const toggleEdit = () => setIsEdit(!isEdit);

  const { boardId } = useParams();
  const boardNameRef = useRef<HTMLFormElement | null>(null);

  useOutsideClick({ ref: boardNameRef, handler: toggleEdit });

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    resetState()

    const getBoard = async () => {
      const docRef = doc(db, "boards", `${boardId}`);

      unsubscribe = await onSnapshot(docRef, (doc) => {
        const board = doc.data() as BoardDocument;
        console.log(board);
        setBoardState(board);
      });
    };

    const getSections = async () => {
      const querySnapshot = await getDocs(
        collection(db, `boards/${boardId}/sections`),
      );

      const sections = [] as Array<SectionDocument>;

      querySnapshot.forEach((doc) => {
        sections.push(doc.data() as SectionDocument);
      });

      setSections(sections);
      setSsnapshot(sections);
      setSectionIds(sections);
    };

    const getTasks = async () => {
      const querySnapshot = await getDocs(
        collection(db, `boards/${boardId}/tasks`),
      );

      const tasks = [] as Array<TaskDocument>;

      querySnapshot.forEach((doc) => {
        tasks.push(doc.data() as TaskDocument);
      });
      setTaskList(tasks);
      setTsnapshot(tasks);
      setTaskIds(tasks);
    };

    getBoard();
    getSections();
    getTasks();

    return () => {
      /*       unsubscribe && unsubscribe();
      onSanpShot 리스너 해지       */

      //+
      if (dispatchRef.current) {
        dispatchRef.current();
      }

      unsubscribe && unsubscribe();
    };
  }, []);

  if (!boardState) return <div>Loading...</div>;

  return (
    <section className="flex w-full flex-col items-start justify-start">
      <BoardHeader
        boardStatusProp={boardState.board_status}
        boardDescriptionProp={boardState.board_description}
        boardDueDateProp={boardState.board_due_date}
        boardNameProp={boardState.board_name}
      />
      <div
        className={`h-[calc(100vh-120px)] w-full ${boardState.board_bg_color}`}
      >
        <Kanban />
      </div>
    </section>
  );
}
