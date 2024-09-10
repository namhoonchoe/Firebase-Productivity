import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { doc, onSnapshot, writeBatch } from "firebase/firestore";

import { db } from "@/services/firebase";
import { Unsubscribe } from "firebase/auth";
import { BoardDocument } from "@/Types/FireStoreModels";
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
    sectionList: "[]",
    taskList: "[]",
    archived: false,
  });

  const { resetState, setTaskList, setSections, sections, taskList } =
    useKanbanStore();
  const batch = writeBatch(db);
  const syncToFS = async () => {
    batch.update(doc(db, `boards/${boardId}`), {
      sectionList: JSON.stringify(sections),
    });
    batch.update(doc(db, `boards/${boardId}`), {
      taskList: JSON.stringify(taskList),
    });

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
    resetState();

    const getBoard = async () => {
      const docRef = doc(db, "boards", `${boardId}`);

      unsubscribe = await onSnapshot(docRef, (doc) => {
        const board = doc.data() as BoardDocument;
        setBoardState(board);
        setSections(JSON.parse(board.sectionList));
        setTaskList(JSON.parse(board.taskList));
      });
    };

    getBoard();

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
