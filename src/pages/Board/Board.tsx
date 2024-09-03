import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
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

  const {
    setTaskList,
    setSsnapshot,
    setTsnapshot,
    setSections,
    setSectionIds,
  } = useKanbanStore();

  const toggleEdit = () => setIsEdit(!isEdit);

  const { boardId } = useParams();
  const boardNameRef = useRef<HTMLFormElement | null>(null);

  useOutsideClick({ ref: boardNameRef, handler: toggleEdit });

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const getBoard = async () => {
      const docRef = doc(db, "boards", `${boardId}`);

      unsubscribe = await onSnapshot(docRef, (doc) => {
        const board = doc.data() as BoardDocument;
        setBoardState(board);
      });
    };

    const getSections = async () => {
      const sectionRef = collection(db, "sections");
      const sectionQ = query(sectionRef, where("board_id", "==", boardId));
      const querySnapshot = await getDocs(sectionQ);

      const sections = [] as Array<SectionDocument>;

      querySnapshot.forEach((doc) => {
        sections.push(doc.data() as SectionDocument);
      });

      setSections(sections);
      setSsnapshot(sections);
      setSectionIds(sections);
    };

    const getTasks = async () => {
      const taskRef = collection(db, "tasks");
      const taskQ = query(taskRef, where("board_id", "==", boardId));
      const querySnapshot = await getDocs(taskQ);

      const tasks = [] as Array<TaskDocument>;

      querySnapshot.forEach((doc) => {
        tasks.push(doc.data() as TaskDocument);
      });
      setTaskList(tasks);
      setTsnapshot(tasks);
    };

    getBoard();
    getSections();
    getTasks();

    return () => {
      /*       unsubscribe && unsubscribe();
      onSanpShot 리스너 해지       */

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
