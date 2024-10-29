import  { useState } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";

import SeeArchiveIcon from "@/components/svgIcons/SeeArchiveIcon";
import { DeleteIcon, RestoreIcon } from "@/components/svgIcons";
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import BoardCard from "@/components/ui/BoardCard";

import { db } from '@/services/firebase';
import { Link } from 'react-router-dom';
import { BoardDocument } from '@/Types/FireStoreModels';

export default function ArchivedDIalog({archivedBoards}:{archivedBoards:BoardDocument []}) {

  const [isArchivedOpen, setisArchivedOpen] = useState<boolean>(false);
  const toggleArchivedOpen = () => setisArchivedOpen(!isArchivedOpen);

  const restoreBoard = async (targetId: string) => {
    await updateDoc(doc(db, "boards", targetId), {
      archived: false,
    });
  };

  const deleteBoard = async (targetId: string) => {
    /* delete target board */
    await deleteDoc(doc(db, "boards", targetId));
  };

  return (
    <Dialog open={isArchivedOpen} onOpenChange={toggleArchivedOpen}>
        <DialogTrigger>
          <button className="absolute bottom-4 right-4 flex aspect-square w-16 items-center justify-center rounded-full bg-blue-500 shadow-sm">
            <SeeArchiveIcon width={32} height={32} />
          </button>
        </DialogTrigger>
        <DialogContent className="flex w-full max-w-[425px] flex-col items-start justify-start rounded-xl border-0 bg-zinc-700 p-0">
          <header className="relative flex w-full flex-shrink-0 flex-grow-0 items-center justify-between p-6">
            <p className="flex-shrink-0 flex-grow-0 text-left text-lg font-semibold text-white">
              Archived Boards
            </p>
            <DialogClose asChild>
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0 flex-grow-0"
                preserveAspectRatio="none"
              >
                <path
                  d="M0.64705 0.553791L0.71967 0.46967C0.98594 0.2034 1.4026 0.1792 1.69621 0.39705L1.78033 0.46967L8.25 6.939L14.7197 0.46967C15.0126 0.17678 15.4874 0.17678 15.7803 0.46967C16.0732 0.76256 16.0732 1.23744 15.7803 1.53033L9.311 8L15.7803 14.4697C16.0466 14.7359 16.0708 15.1526 15.8529 15.4462L15.7803 15.5303C15.5141 15.7966 15.0974 15.8208 14.8038 15.6029L14.7197 15.5303L8.25 9.061L1.78033 15.5303C1.48744 15.8232 1.01256 15.8232 0.71967 15.5303C0.42678 15.2374 0.42678 14.7626 0.71967 14.4697L7.189 8L0.71967 1.53033C0.4534 1.26406 0.4292 0.847401 0.64705 0.553791Z"
                  fill="white"
                />
              </svg>
            </DialogClose>
          </header>
          <main className="flex max-h-80 w-full flex-col items-center justify-start gap-4 overflow-auto py-3">
            {archivedBoards.map((board) => (
              <section className="flex w-full flex-col items-start justify-start gap-3 px-2">
                <Link to={`/boards/${board.board_id}`} className="w-full">
                  <BoardCard
                    bgColor={board.board_bg_color}
                    boardName={board.board_name}
                    boardStatus={board.board_status}
                  />
                </Link>
                <div className="flex flex-row items-center justify-start gap-3 pl-2 text-white">
                  {/* restore task */}
                  <p
                    className="text-md flex items-center gap-3 rounded-xl px-3 py-2 capitalize hover:bg-zinc-900"
                    onClick={() => restoreBoard(board.board_id)}
                  >
                    <RestoreIcon /> restore
                  </p>

                  {/* delete task */}
                  <p
                    className="text-md flex items-center gap-3 rounded-xl px-3 py-2 capitalize hover:bg-zinc-900"
                    onClick={() => deleteBoard(board.board_id)}
                  >
                    <DeleteIcon />
                    delete
                  </p>
                </div>
              </section>
            ))}
          </main>
        </DialogContent>
      </Dialog>
  )
}
