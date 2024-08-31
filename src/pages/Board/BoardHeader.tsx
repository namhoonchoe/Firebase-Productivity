import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/shadcn/input";

import { PopoverClose } from "@radix-ui/react-popover";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";

import { ArchiveIcon, ChevronDownIcon, CloseIcon } from "@/components/svgIcons";

import { iconColorDark } from "@/utils/constants";
import DetailDialog from "./DetailDialog";
import { useRef, useState } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useNavigate, useParams } from "react-router-dom";
import ColorPalette from "./ColorPalette";
import BoardDrawer from "./BoardDrawer";
import { SectionDocument } from "@/Types/FireStoreModels";

type FormInput = {
  boardName: string;
};

type BoardHeaderProps = {
  boardNameProp: string;
  boardStatusProp: string;
  boardDueDateProp: string | Date;
  boardDescriptionProp: string;
  sectionSnapshotProp: SectionDocument[];
};

export default function BoardHeader({
  boardStatusProp,
  boardDescriptionProp,
  boardDueDateProp,
  boardNameProp,
  sectionSnapshotProp,
}: BoardHeaderProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const toggleEdit = () => setIsEdit(!isEdit);

  const { boardId } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<FormInput>();
  const boardNameRef = useRef<HTMLFormElement | null>(null);

  useOutsideClick({ ref: boardNameRef, handler: toggleEdit });

  const editBoardName = async (boardName: string) => {
    /** 타입 맟추기용 꼼수 template literal */
    await updateDoc(doc(db, "boards", `${boardId}`), {
      board_name: boardName,
    });
    toggleEdit();
  };

  const onSubmit: SubmitHandler<FormInput> = ({ boardName }) => {
    editBoardName(boardName);
  };

  const archiveBoard = async () => {
    await updateDoc(doc(db, "boards", `${boardId}`), {
      archived: true,
    });
    navigate("/boards");
  };

  return (
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
            {boardNameProp}
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

                    <DetailDialog
                      bsProp={boardStatusProp}
                      ddProp={boardDueDateProp}
                      dsProp={boardDescriptionProp}
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
                    </DetailDialog>

                    {/* change background color */}
                    <ColorPalette />

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
                    <li className="popover-item" onClick={() => archiveBoard()}>
                      <ArchiveIcon />
                      <p className="popover-text">archive this board</p>
                    </li>
                    {/* drawer */}
                    <BoardDrawer sectionSnapshot={sectionSnapshotProp} />
                  </ul>
                </div>
              </section>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </header>
  );
}
