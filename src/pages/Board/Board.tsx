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
    deleteTask,
    updateTask,
    deleteSection,
    updateSection,
    setSections,
    setSectionIds,
  } = useKanbanStore();

  const toggleEdit = () => setIsEdit(!isEdit);

  const { boardId } = useParams();
  const boardNameRef = useRef<HTMLFormElement | null>(null);

  useOutsideClick({ ref: boardNameRef, handler: toggleEdit });
 

  const cleanUp = async () => {
    /** add new sections  */
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
    await batch.commit();
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    let mounted = true;

    const getBoard = async () => {
      const docRef = doc(db, "boards", `${boardId}`);
      /*       const boardQuery = query(boardRef, where("user_id", "==", userId));
       */
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

    if (mounted) {
      getBoard();
      getSections();
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
        />
      <section
        className={`h-[calc(100vh-120px)] w-full ${boardState.board_bg_color}`}
      >
       
        <Kanban />
      </section>
    </section>
  );
}
