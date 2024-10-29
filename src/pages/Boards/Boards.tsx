import {
 
  collection,
  where,
  query,
  onSnapshot,
  
} from "firebase/firestore";
import { Unsubscribe } from "firebase/auth";

import { db, auth } from "@/services/firebase";
import { BoardDocument } from "@/Types/FireStoreModels";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import BoardCard from "@/components/ui/BoardCard";
import ArchivedDIalog from "./ArchivedDIalog";
import CreateBoardDialog from "./CreateBoardDialog";

export default function Boards() {
  const user = auth.currentUser;

  const [boards, setBoards] = useState<BoardDocument[]>([]);

  const alivingBoards = boards.filter((board) => board.archived === false);
  const archivedBoards = boards.filter((board) => board.archived === true);


  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const getBoards = async (userId: string) => {
      const boardRef = collection(db, "boards");
      const boardsQuery = query(boardRef, where("user_id", "==", userId));

      unsubscribe = await onSnapshot(boardsQuery, (snapshot) => {
        const boards = snapshot.docs.map((doc) => {
          const {
            user_id,
            board_id,
            board_name,
            last_edited,
            board_description,
            board_due_date,
            board_status,
            board_bg_color,
            taskList,
            sectionList,
            archived,
          } = doc.data();
          return {
            user_id,
            board_id,
            board_name,
            last_edited,
            board_description,
            board_due_date,
            board_status,
            board_bg_color,
            taskList,
            sectionList,
            archived,
          };
        });
        setBoards(boards);
      });
    };

    if (user) {
      getBoards(user.uid);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <div className="relative flex min-h-[calc(100vh-56px)] w-full flex-col gap-12">
      <section className="grid w-full grid-cols-4 content-start gap-4 px-5">
        {/* Create board */}
        <CreateBoardDialog userId={`${user?.uid}`} />
        {/* board list link to board */}

        {alivingBoards.map((board) => (
          <Link to={`/boards/${board.board_id}`}>
            <BoardCard
              bgColor={board.board_bg_color}
              boardName={board.board_name}
              boardStatus={board.board_status}
            />
          </Link>
        ))}
      </section>
        {/**Archived Dialog */}
        <ArchivedDIalog archivedBoards={archivedBoards}/>
    </div>
  );
}
