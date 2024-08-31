import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/shadcn/input";
import { db } from "@/services/firebase";
import { Unsubscribe } from "firebase/auth";
import {
  BoardDocument,
  SectionDocument,
  TaskDocument,
} from "@/Types/FireStoreModels";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";

import { PopoverClose } from "@radix-ui/react-popover";

import * as SheetPrimitive from "@radix-ui/react-dialog";

import { useOutsideClick } from "@/hooks/useOutsideClick";

import Kanban from "@/pages/Board/Kanban";

import {
  ArchiveIcon,
  ChevronDownIcon,
  RestoreIcon,
  DeleteIcon,
  CloseIcon,
} from "@/components/svgIcons";

import { iconColorDark } from "@/utils/constants";

import { useKanbanStore } from "@/store/KanbanStore";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/shadcn/hover-card";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/shadcn/sheet";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shadcn/tabs";

import { colors } from "@/utils/constants";

import BoardDialog from "./DetailDialog";

import SeeArchiveIcon from "@/components/svgIcons/SeeArchiveIcon";

type FormInput = {
  boardName?: string;
  bgColor?: string;
};

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

  const navigate = useNavigate();

  const archivedList = taskList.filter((task) => task.archived);
  const archivedSections = sections.filter((section) => section.archived);

  const toggleEdit = () => setIsEdit(!isEdit);

  const { boardId } = useParams();
  const { register, handleSubmit } = useForm<FormInput>();
  const boardNameRef = useRef<HTMLFormElement | null>(null);

  useOutsideClick({ ref: boardNameRef, handler: toggleEdit });

  /** write functions below
   *  @param boardName
   *
   * delete sections
   * delete tasks
   *
   * update board
   * update tasks
   */

  const editBoardName = async (boardName: string | undefined) => {
    /** 타입 맟추기용 꼼수 template literal */
    await updateDoc(doc(db, "boards", `${boardState.board_id}`), {
      board_name: boardName,
    });
    toggleEdit();
  };

  const onSubmit: SubmitHandler<FormInput> = ({ boardName }) => {
    editBoardName(boardName);
  };

  const updatebgColor = async (bgColor: string | undefined) => {
    /** 타입 맟추기용 꼼수 template literal */
    await updateDoc(doc(db, "boards", `${boardState.board_id}`), {
      board_bg_color: bgColor,
    });
  };

  const archiveBoard = async () => {
    await updateDoc(doc(db, "boards", `${boardId}`), {
      archived: true,
    });
    navigate("/boards");
  };

  /** delete sction in firesotre */

  const deleteSectionFS = async (targetId: string) => {
    await deleteDoc(doc(db, "sections", targetId));
  };

  const dsHandler = (targetId: string) => {
    const snapshotIds = [] as string[];

    sectionSnapShot.map((snapShot) => {
      snapshotIds.push(snapShot.section_id);
    });

    if (snapshotIds.includes(targetId)) {
      deleteSectionFS(targetId);
    }
    deleteSection(targetId);
  };

  /* delete task in firestore*/

  const deleteTaskFS = async (targetId: string) => {
    await deleteDoc(doc(db, "tasks", targetId));
  };

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

  const submitColor: SubmitHandler<FormInput> = ({ bgColor }) => {
    updatebgColor(bgColor);
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
      <header className="flex h-16 w-full items-center justify-start overflow-hidden bg-white pl-5 shadow-sm">
        {isEdit ? (
          <div className="flex items-center justify-start gap-2">
            <form onSubmit={handleSubmit(onSubmit)} ref={boardNameRef}>
              <Input
                id="boardName"
                type="text"
                placeholder="your board name"
                {...register("boardName", { required: true })}
                required
              />
            </form>
          </div>
        ) : (
          <div className="flex items-center justify-start gap-2">
            <p onClick={toggleEdit} className="text-xl capitalize">
              {boardState.board_name}
            </p>
            {/** board actions popover */}
            <Popover>
              <PopoverTrigger>
                <ChevronDownIcon fill={iconColorDark} width={16} height={16} />
              </PopoverTrigger>
              <PopoverContent className="popover-content" align="start">
                <section className="flex w-full flex-col items-start justify-center gap-2 pb-2">
                  <header className="flex w-full flex-row items-center justify-between border-0 border-b border-zinc-500 p-3">
                    <div className="relative h-4 w-[19px] flex-shrink-0 flex-grow-0 overflow-hidden" />
                    <p className="popover-text capitalize">actions</p>
                    <PopoverClose>
                      <CloseIcon width={16} height={16} />
                    </PopoverClose>
                  </header>
                  <div className="flex w-full flex-col items-center justify-center">
                    <ul className="popover-ul border-0 border-b border-zinc-500">
                      {/* edit board detail */}

                      <BoardDialog
                        bsProp={boardState.board_status}
                        ddProp={boardState.board_due_date}
                        dsProp={boardState.board_description}
                      >
                        <li className="popover-item">
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="relative h-6 w-6 flex-shrink-0 flex-grow-0"
                            preserveAspectRatio="none"
                          >
                            <path
                              d="M20 4.74609C20 3.22731 18.7688 1.99609 17.25 1.99609H4.75C3.23122 1.99609 2 3.22731 2 4.74609V17.2461C2 18.7649 3.23122 19.9961 4.75 19.9961H11.416L11.5209 19.5763C11.617 19.1921 11.7739 18.8276 11.9842 18.4961H4.75C4.05964 18.4961 3.5 17.9364 3.5 17.2461V4.74609C3.5 4.05574 4.05964 3.49609 4.75 3.49609H17.25C17.9404 3.49609 18.5 4.05574 18.5 4.74609V11.8592C18.9371 11.4593 19.4562 11.1989 20 11.078V4.74609ZM16 14.3545V6.72881L15.9932 6.62983C15.9435 6.27381 15.6297 5.9994 15.25 5.9994C14.8358 5.9994 14.5 6.32597 14.5 6.72881V15.27L14.5068 15.369C14.5243 15.4942 14.5744 15.6093 14.6486 15.7059L16 14.3545ZM7.49315 8.64485C7.44349 8.28034 7.1297 7.9994 6.75 7.9994C6.33579 7.9994 6 8.33374 6 8.74618V15.2526L6.00685 15.354C6.05651 15.7185 6.3703 15.9994 6.75 15.9994C7.16421 15.9994 7.5 15.6651 7.5 15.2526V8.74618L7.49315 8.64485ZM11.707 11.6168C11.6549 11.2628 11.3458 10.9925 10.9751 10.9961C10.5707 11.0001 10.246 11.3285 10.25 11.7296L10.2854 15.277L10.293 15.3755C10.3451 15.7295 10.6542 15.9997 11.0249 15.9962C11.4293 15.9921 11.754 15.6637 11.75 15.2626L11.7146 11.7153L11.707 11.6168ZM19.0999 12.669L13.1974 18.5714C12.8533 18.9155 12.6092 19.3467 12.4911 19.8189L12.0334 21.6496C11.8344 22.4457 12.5556 23.1668 13.3517 22.9678L15.1824 22.5101C15.6545 22.3921 16.0857 22.148 16.4299 21.8038L22.3323 15.9014C23.2249 15.0088 23.2249 13.5616 22.3323 12.669C21.4397 11.7763 19.9925 11.7763 19.0999 12.669Z"
                              fill="white"
                            />
                          </svg>
                          <p className="popover-text">edit board detail</p>
                        </li>
                      </BoardDialog>

                      {/* change background color */}
                      <HoverCard>
                        <HoverCardTrigger>
                          <li className="popover-item">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.83885 5.85764C6.77986 1.94203 12.8685 0.802643 17.2028 3.49752C21.4826 6.15853 23.0566 11.2746 21.3037 16.0749C19.6485 20.6075 15.2873 22.4033 12.144 20.1233C10.9666 19.2692 10.5101 18.1985 10.2895 16.4595L10.1841 15.4715L10.1387 15.0741C10.016 14.14 9.82762 13.7216 9.43435 13.5024C8.89876 13.2038 8.54213 13.1969 7.83887 13.4694L7.48775 13.615L7.30902 13.693C6.29524 14.1332 5.62085 14.2879 4.76786 14.1092L4.56761 14.062L4.40407 14.0154C1.61511 13.1512 1.20202 9.36827 3.83885 5.85764ZM4.82307 12.5741L4.94598 12.6105L5.07993 12.6414C5.519 12.7283 5.89425 12.6558 6.51695 12.3995L7.11912 12.1423C8.32126 11.6494 9.10436 11.6012 10.1646 12.1921C11.0822 12.7036 11.4399 13.4897 11.6223 14.8518L11.6755 15.3109L11.7297 15.8427L11.7768 16.2651C11.9489 17.6263 12.2617 18.3556 13.0248 18.9091C15.3001 20.5595 18.5592 19.2175 19.8947 15.5604C21.411 11.4082 20.0688 7.04581 16.4107 4.77137C12.7365 2.4869 7.5123 3.46453 5.03822 6.75848C2.96343 9.52082 3.21791 12.038 4.82307 12.5741ZM16.0476 10.5797C15.8689 9.91288 16.2646 9.22746 16.9314 9.04878C17.5983 8.87011 18.2837 9.26583 18.4624 9.93267C18.6411 10.5995 18.2453 11.2849 17.5785 11.4636C16.9117 11.6423 16.2262 11.2465 16.0476 10.5797ZM16.5421 14.0684C16.3635 13.4015 16.7592 12.7161 17.426 12.5374C18.0929 12.3588 18.7783 12.7545 18.957 13.4213C19.1356 14.0882 18.7399 14.7736 18.0731 14.9523C17.4062 15.1309 16.7208 14.7352 16.5421 14.0684ZM14.0691 7.57703C13.8904 6.9102 14.2861 6.22478 14.9529 6.0461C15.6198 5.86742 16.3052 6.26315 16.4839 6.92998C16.6625 7.59681 16.2668 8.28224 15.6 8.46091C14.9331 8.63959 14.2477 8.24386 14.0691 7.57703ZM14.0406 16.5754C13.8619 15.9086 14.2576 15.2232 14.9245 15.0445C15.5913 14.8658 16.2767 15.2615 16.4554 15.9284C16.6341 16.5952 16.2383 17.2806 15.5715 17.4593C14.9047 17.638 14.2192 17.2422 14.0406 16.5754ZM10.5436 6.60544C10.365 5.9386 10.7607 5.25318 11.4275 5.07451C12.0944 4.89583 12.7798 5.29156 12.9585 5.95839C13.1371 6.62522 12.7414 7.31064 12.0746 7.48932C11.4077 7.668 10.7223 7.27227 10.5436 6.60544Z"
                                fill="white"
                              />
                            </svg>
                            <p className="popover-text">
                              change background color
                            </p>
                          </li>
                        </HoverCardTrigger>
                        <HoverCardContent
                          side="right"
                          align="start"
                          sideOffset={20}
                          className="relative flex w-60 flex-col items-center justify-center gap-4 overflow-hidden rounded-md border-0 bg-zinc-700 p-4"
                        >
                          <label
                            htmlFor="color"
                            className="mt-1 text-base text-slate-200"
                          >
                            Choose a color
                          </label>
                          <form
                            className="flex w-full flex-col justify-start gap-2"
                            onSubmit={handleSubmit(submitColor)}
                          >
                            <section className="flex flex-wrap justify-between gap-2">
                              {colors.map((color) => (
                                <div key={color} className="flex items-center">
                                  <label
                                    htmlFor={color}
                                    className={`h-10 w-10 rounded-md ${color} flex cursor-pointer items-center justify-center`}
                                  >
                                    <Input
                                      type="radio"
                                      id={color}
                                      {...register("bgColor", {
                                        required: true,
                                      })}
                                      value={color}
                                      className="z-20 h-4 w-4 cursor-pointer focus:ring-sky-500"
                                    />
                                  </label>
                                </div>
                              ))}
                            </section>
                            <button
                              type="submit"
                              className="flex w-full items-center justify-center rounded-md bg-zinc-900 p-2 text-white"
                            >
                              <p>change color</p>
                            </button>
                          </form>
                        </HoverCardContent>
                      </HoverCard>

                      <li className="popover-item">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="relative h-6 w-6 flex-shrink-0 flex-grow-0"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M3.5 6.25V8H8.12868C8.32759 8 8.51836 7.92098 8.65901 7.78033L10.1893 6.25L8.65901 4.71967C8.51836 4.57902 8.32759 4.5 8.12868 4.5H5.25C4.2835 4.5 3.5 5.2835 3.5 6.25ZM2 6.25C2 4.45507 3.45507 3 5.25 3H8.12868C8.72542 3 9.29771 3.23705 9.71967 3.65901L11.5607 5.5H18.75C20.5449 5.5 22 6.95507 22 8.75V12.8096C21.5557 12.3832 21.051 12.0194 20.5 11.7322V8.75C20.5 7.7835 19.7165 7 18.75 7H11.5607L9.71967 8.84099C9.29771 9.26295 8.72542 9.5 8.12868 9.5H3.5V17.75C3.5 18.7165 4.2835 19.5 5.25 19.5H11.3135C11.4858 20.0335 11.7253 20.5368 12.0218 21H5.25C3.45507 21 2 19.5449 2 17.75V6.25ZM17.5 12C20.5376 12 23 14.4624 23 17.5C23 20.5376 20.5376 23 17.5 23C14.4624 23 12 20.5376 12 17.5C12 14.4624 14.4624 12 17.5 12ZM14.5 17C14.2239 17 14 17.2239 14 17.5C14 17.7761 14.2239 18 14.5 18H19.2929L17.6464 19.6464C17.4512 19.8417 17.4512 20.1583 17.6464 20.3536C17.8417 20.5488 18.1583 20.5488 18.3536 20.3536L20.8536 17.8536C21.0488 17.6583 21.0488 17.3417 20.8536 17.1464L18.3536 14.6464C18.1583 14.4512 17.8417 14.4512 17.6464 14.6464C17.4512 14.8417 17.4512 15.1583 17.6464 15.3536L19.2929 17H14.5Z"
                            fill="white"
                          />
                        </svg>
                        <p className="popover-text">export to csv</p>
                      </li>
                    </ul>
                    <ul className="popover-ul border-0">
                      <li
                        className="popover-item"
                        onClick={() => archiveBoard()}
                      >
                        <ArchiveIcon />
                        <p className="popover-text">archive this board</p>
                      </li>
                      {/* drawer */}
                      <Sheet>
                        <SheetTrigger>
                          <li className="popover-item">
                            <SeeArchiveIcon />
                            <p className="popover-text">see archived items</p>
                          </li>
                        </SheetTrigger>
                        <SheetContent className="border-0 bg-zinc-900">
                          <SheetHeader className="relative mb-3 flex w-full flex-row items-center justify-center border-0 border-b border-zinc-500 pb-3">
                            <SheetTitle className="text-xl font-medium capitalize text-white">
                              Archived
                            </SheetTitle>
                            <SheetPrimitive.Close className="absolute right-0">
                              <CloseIcon />
                            </SheetPrimitive.Close>
                          </SheetHeader>
                          <Tabs defaultValue="cards">
                            <TabsList className="grid w-full grid-cols-2 bg-zinc-600 font-medium capitalize text-white shadow-lg">
                              <TabsTrigger value="cards">Cards</TabsTrigger>
                              <TabsTrigger value="sections">
                                Sections
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="cards">
                              <ul className="flex w-full flex-col items-center justify-start gap-4 py-4">
                                {/* archived cards */}
                                {archivedList.map((card) => {
                                  const [section] = sections.filter(
                                    (section) =>
                                      section.section_id === card.section_id,
                                  );
                                  const { task_id: targetId, ...payload } =
                                    card;
                                  return (
                                    <section className="flex w-full flex-col items-start justify-start gap-3">
                                      <div className="w-full rounded-xl bg-zinc-800 px-6 py-4">
                                        <p className="max-w-full break-all text-lg font-semibold text-white">
                                          {card.task_title} in
                                          {section.section_name}
                                        </p>
                                      </div>
                                      <div className="flex flex-row items-center justify-start gap-3 pl-2 text-white">
                                        <div>
                                          {/* restore task */}
                                          <p
                                            className="text-md flex items-center gap-3 rounded-xl px-3 py-2 capitalize hover:bg-zinc-900"
                                            onClick={() =>
                                              updateTask(
                                                {
                                                  ...payload,
                                                  archived: false,
                                                },
                                                targetId,
                                              )
                                            }
                                          >
                                            <RestoreIcon /> restore
                                          </p>
                                        </div>
                                        <div>
                                          {/* delete task */}
                                          <p
                                            className="text-md flex items-center gap-3 rounded-xl px-3 py-2 capitalize hover:bg-zinc-900"
                                            onClick={() =>
                                              deleteTask(card.task_id)
                                            }
                                          >
                                            <DeleteIcon />
                                            delete
                                          </p>
                                        </div>
                                      </div>
                                    </section>
                                  );
                                })}
                              </ul>
                            </TabsContent>
                            <TabsContent value="sections">
                              <ul className="flex w-full flex-col items-center justify-start gap-4 py-4">
                                {archivedSections.map((section) => {
                                  return (
                                    <section className="flex w-full flex-col items-start justify-start gap-3">
                                      <div className="w-full rounded-xl bg-zinc-800 px-6 py-4">
                                        <p className="max-w-full break-all text-lg font-semibold text-white">
                                          {section.section_name}
                                        </p>
                                      </div>
                                      <div className="flex flex-row items-center justify-start gap-3 pl-2 text-white">
                                        {/* restore task */}
                                        <p
                                          className="text-md flex items-center gap-3 rounded-xl px-3 py-2 capitalize hover:bg-zinc-900"
                                          onClick={() => {
                                            const { section_id, ...payload } =
                                              section;
                                            updateSection(section_id, {
                                              ...payload,
                                              archived: false,
                                            });
                                          }}
                                        >
                                          <RestoreIcon /> restore
                                        </p>

                                        {/* delete task */}
                                        <p
                                          className="text-md flex items-center gap-3 rounded-xl px-3 py-2 capitalize hover:bg-zinc-900"
                                          onClick={() =>
                                            dsHandler(section.section_id)
                                          }
                                        >
                                          <DeleteIcon />
                                          delete
                                        </p>
                                      </div>
                                    </section>
                                  );
                                })}
                              </ul>
                            </TabsContent>
                          </Tabs>
                        </SheetContent>
                      </Sheet>
                    </ul>
                  </div>
                </section>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </header>
      <section
        className={`h-[calc(100vh-120px)] w-full ${boardState.board_bg_color}`}
      >
        <Kanban />
      </section>
    </section>
  );
}
