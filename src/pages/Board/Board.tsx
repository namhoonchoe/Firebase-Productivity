import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
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
    board_status: "",
    board_bg_color: "",
    last_edited: "",

    archived: false,
  });
  const [sectionSnapShot, setSectionSnapShot] = useState<SectionDocument[]>([]);
  const [tasksSnapShot, setTasksSnapShot] = useState<TaskDocument[]>([]);
  const batch = writeBatch(db);

  const {
    taskList,
    sections,
    setTaskList,
    setSections,
    setSectionIds,
  } = useKanbanStore();

  const toggleEdit = () => setIsEdit(!isEdit);

  const { boardId } = useParams();
  const boardNameRef = useRef<HTMLFormElement | null>(null);

  useOutsideClick({ ref: boardNameRef, handler: toggleEdit });
 

  const cleanUp = async () => {

    /** add new sections  to firestore */
    sections.map((section) => {
      const { section_id, section_name, archived, board_id } = section;
      const sectionRef = doc(db, "sections", section_id);

      batch.set(sectionRef, {
        section_name: section_name,
        section_id: section_id,
        board_id: board_id,
        archived: archived,
      });
    });

    /** add new tasks to firetore */
    taskList.map((task) => {
      const { task_id, ...rest} = task;
      const taskRef = doc(db, "tasks", task_id);

      batch.set(taskRef, {
        task_id: task_id,
       ...rest,
      });
    })

    await batch.commit();
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    let mounted = true;

    const getBoard = async () => {
      const docRef = doc(db, "boards", `${boardId}`);
     
      unsubscribe = await onSnapshot(docRef, (doc) => {
        const board = doc.data() as BoardDocument;
        setBoardState(board);
      });
    };

    const getSections = async () => {
      setSections([]);
      setSectionIds([]);

      const sectionRef = collection(db, "sections");
      const sectionQ = query(sectionRef, where("board_id", "==", boardId));
      const querySnapshot = await getDocs(sectionQ);

      const sections = [] as Array<SectionDocument>;

      querySnapshot.forEach((doc) => {
        sections.push(doc.data() as SectionDocument);
      });
      setSections(sections);
      setSectionSnapShot(sections);
      setSectionIds(sections);
    };


    const getTasks = async () => { 
      setTaskList([])

      const taskRef = collection(db, "tasks");
      const taskQ = query(taskRef, where("board_id", "==", boardId));
      const querySnapshot = await getDocs(taskQ);
    
      const tasks = [] as Array<TaskDocument>;

      querySnapshot.forEach((doc) => {
        tasks.push(doc.data() as TaskDocument);
      });
      setTaskList(tasks);
      setTasksSnapShot(tasks);
    }

    if (mounted) {
      getBoard();
      getSections();
      getTasks()
    }

    return () => {
      /*       unsubscribe && unsubscribe();
      onSanpShot 리스너 해지       */
      cleanUp();
      mounted = false;

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
          sectionSnapshotProp={sectionSnapShot}
          tasksSnapShotPorp={tasksSnapShot}
        />
      <div
        className={`h-[calc(100vh-120px)] w-full ${boardState.board_bg_color}`}
      >
       
        <Kanban />
      </div>
    </section>
  );
}
