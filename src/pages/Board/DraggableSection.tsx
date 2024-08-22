import { useState, useRef } from "react";
import { useKanbanStore } from "@/store/KanbanStore";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { AddIcon, CloseIcon } from "@/components/svgIcons";
import MoreIcon from "@/components/svgIcons/MoreIcon";
import DraggableCard from "./DraggableCard";
import { Input } from "@/components/ui/shadcn/input";
import { useForm } from "react-hook-form";
import AddCardForm from "./AddCardForm";
import { Button } from "@/components/ui/shadcn/button";

type SectionProps = {
  sectionId: string;
  sectionName: string;
};

type FormInput = {
  sectionName: string;
};
export default function DraggableSection({
  sectionId,
  sectionName,
}: SectionProps) {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const { taskList, editSection } =
    useKanbanStore();

  const filteredList = taskList
    .filter((task) => task.section_id === sectionId)
    .filter((task) => !task.archived);

  const sectionNameRef = useRef<HTMLFormElement | null>(null);

  const { register, handleSubmit, setValue } = useForm<FormInput>();

  /* element scroll to the top */

  const toggleEditMode = () => setIsEditMode(!isEditMode);
  const toggleFormOpen = () => setIsFormOpen(!isFormOpen);

  const handleValid = ({ sectionName }: FormInput) => {
    editSection(sectionId, sectionName);
    setValue("sectionName", "");
    setIsEditMode(false);
  };

  useOutsideClick({ ref: sectionNameRef, handler: () => setIsEditMode(false) });

  return (
    <section className="relative flex min-h-20 w-72 flex-shrink-0 flex-grow-0 flex-col items-center justify-start gap-3 overflow-hidden rounded-3xl bg-zinc-900 py-3">
      <header className="flex h-16 w-full items-center justify-between rounded-t-xl px-4 py-3 text-white">
        {/**section name */}
        {isEditMode ? (
          <form
            ref={sectionNameRef}
            onSubmit={handleSubmit(handleValid)}
            className="flex w-full items-center justify-start gap-3"
          >
            <Input
              id="section name"
              className="rounde-xl h-12 w-56 border-slate-400 bg-zinc-700 pl-2 capitalize text-white"
              placeholder="Please write a section name"
              {...register("sectionName", {
                required: "Please write a section name",
              })}
            />
          </form>
        ) : (
          <p
            className="px-2 text-base font-semibold capitalize"
            onClick={() => toggleEditMode()}
          >
            {sectionName}
          </p>
        )}
        {/* section menu*/}
        <Popover>
          <PopoverTrigger>
            <MoreIcon />
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
                        d="M20.9519 3.04712C19.5543 1.6496 17.2885 1.64967 15.8911 3.04727L3.94103 14.9987C3.5347 15.4051 3.2491 15.9162 3.116 16.4753L2.02041 21.0767C1.96009 21.3301 2.03552 21.5966 2.21968 21.7808C2.40385 21.9649 2.67037 22.0404 2.92373 21.98L7.52498 20.8845C8.08418 20.7514 8.59546 20.4656 9.00191 20.0591L18.9995 10.0604C19.6777 10.7442 19.676 11.8484 18.9943 12.5301L17.2109 14.3135C16.918 14.6064 16.918 15.0812 17.2109 15.3741C17.5038 15.667 17.9786 15.667 18.2715 15.3741L20.055 13.5907C21.3224 12.3233 21.3242 10.2693 20.0601 8.99967L20.952 8.10763C22.3493 6.71015 22.3493 4.44453 20.9519 3.04712ZM16.9518 4.10787C17.7634 3.29611 19.0795 3.29607 19.8912 4.10778C20.7028 4.91942 20.7029 6.23534 19.8913 7.04704L7.94119 18.9985C7.73104 19.2087 7.46668 19.3564 7.17755 19.4253L3.76191 20.2385L4.57521 16.8227C4.64402 16.5337 4.79168 16.2694 5.00175 16.0593L16.9518 4.10787Z"
                        fill="white"
                      />
                      <path
                        d="M20.9519 3.04712C19.5543 1.6496 17.2885 1.64967 15.8911 3.04727L3.94103 14.9987C3.5347 15.4051 3.2491 15.9162 3.116 16.4753L2.02041 21.0767C1.96009 21.3301 2.03552 21.5966 2.21968 21.7808C2.40385 21.9649 2.67037 22.0404 2.92373 21.98L7.52498 20.8845C8.08418 20.7514 8.59546 20.4656 9.00191 20.0591L18.9995 10.0604C19.6777 10.7442 19.676 11.8484 18.9943 12.5301L17.2109 14.3135C16.918 14.6064 16.918 15.0812 17.2109 15.3741C17.5038 15.667 17.9786 15.667 18.2715 15.3741L20.055 13.5907C21.3224 12.3233 21.3242 10.2693 20.0601 8.99967L20.952 8.10763C22.3493 6.71015 22.3493 4.44453 20.9519 3.04712ZM16.9518 4.10787C17.7634 3.29611 19.0795 3.29607 19.8912 4.10778C20.7028 4.91942 20.7029 6.23534 19.8913 7.04704L7.94119 18.9985C7.73104 19.2087 7.46668 19.3564 7.17755 19.4253L3.76191 20.2385L4.57521 16.8227C4.64402 16.5337 4.79168 16.2694 5.00175 16.0593L16.9518 4.10787Z"
                        fill="white"
                      />
                    </svg>
                    <p className="popover-text">edit section name</p>
                  </li>
                  <li className="popover-item">
                    <svg
                      width={20}
                      height={14}
                      viewBox="0 0 20 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 flex-grow-0"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0.5 1C0.5 0.861932 0.611932 0.75 0.75 0.75H16.25C16.3881 0.75 16.5 0.861937 16.5 1C16.5 1.13806 16.3881 1.25 16.25 1.25H0.75C0.611932 1.25 0.5 1.13807 0.5 1ZM0.5 13C0.5 12.8619 0.611937 12.75 0.75 12.75H13.25C13.3881 12.75 13.5 12.8619 13.5 13C13.5 13.1381 13.3881 13.25 13.25 13.25H0.75C0.611937 13.25 0.5 13.1381 0.5 13ZM0.5 7C0.5 6.86194 0.611937 6.75 0.75 6.75H19.25C19.3881 6.75 19.5 6.86194 19.5 7C19.5 7.13806 19.3881 7.25 19.25 7.25H0.75C0.611937 7.25 0.5 7.13806 0.5 7Z"
                        fill="white"
                        stroke="white"
                      />
                    </svg>
                    <p className="popover-text">move setion</p>
                  </li>
                </ul>
                <ul className="popover-ul">
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
                        d="M10.5911 2.51301C11.4947 2.14671 12.5053 2.14671 13.4089 2.51301L20.9075 5.55298C21.5679 5.82071 22 6.46216 22 7.17477V16.8275C22 17.5401 21.5679 18.1815 20.9075 18.4493L13.4089 21.4892C12.5053 21.8555 11.4947 21.8555 10.5911 21.4892L3.09252 18.4493C2.43211 18.1815 2 17.5401 2 16.8275V7.17477C2 6.46216 2.43211 5.82071 3.09252 5.55298L10.5911 2.51301ZM12.8453 3.90312C12.3032 3.68334 11.6968 3.68334 11.1547 3.90312L9.24097 4.67894L16.7678 7.60604L19.437 6.57542L12.8453 3.90312ZM14.6911 8.40787L7.21472 5.50039L4.59029 6.56435L12.0013 9.44642L14.6911 8.40787ZM3.5 16.8275C3.5 16.9293 3.56173 17.0209 3.65607 17.0592L11.1547 20.0991C11.1863 20.112 11.2183 20.1241 11.2503 20.1354V10.7638L3.5 7.74979V16.8275ZM12.8453 20.0991L20.3439 17.0592C20.4383 17.0209 20.5 16.9293 20.5 16.8275V7.77292L12.7503 10.7651V20.1352C12.7822 20.1239 12.8139 20.1119 12.8453 20.0991Z"
                        fill="white"
                      />
                    </svg>
                    <p className="popover-text">archive this section</p>
                  </li>
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
                        d="M15.8697 2.66878L20.8382 7.6373C21.7169 8.51598 21.7169 9.94059 20.8382 10.8193L12.1564 19.4998L18.2543 19.5C18.634 19.5 18.9478 19.7821 18.9975 20.1482L19.0043 20.25C19.0043 20.6297 18.7222 20.9435 18.3561 20.9931L18.2543 21L9.84431 21.0012C9.2281 21.0348 8.6007 20.8163 8.12998 20.3456L3.16145 15.377C2.28277 14.4984 2.28277 13.0737 3.16145 12.1951L12.6877 2.66878C13.5664 1.7901 14.991 1.7901 15.8697 2.66878ZM5.70844 11.7678L4.22211 13.2557C3.92922 13.5486 3.92922 14.0235 4.22211 14.3164L9.19064 19.2849C9.33708 19.4314 9.52903 19.5046 9.72097 19.5046L9.74985 19.5L9.78834 19.5016C9.95725 19.4864 10.122 19.4142 10.2513 19.2849L11.7374 17.7978L5.70844 11.7678ZM13.7484 3.72944L6.76944 10.7068L12.7984 16.7368L19.7776 9.75862C20.0705 9.46573 20.0705 8.99085 19.7776 8.69796L14.8091 3.72944C14.5162 3.43654 14.0413 3.43654 13.7484 3.72944Z"
                        fill="white"
                      />
                    </svg>
                    <p className="popover-text">
                      {" "}
                      archive all tasks in this list
                    </p>
                  </li>
                </ul>
              </div>
            </section>
          </PopoverContent>
        </Popover>
      </header>
      <main className="flex max-h-[60vh] w-full flex-col items-center justify-start gap-4 overflow-y-auto py-2">
        {isFormOpen && (
          <AddCardForm sectionId={sectionId} toggleFormOpen={toggleFormOpen} />
        )}
        <>
          {filteredList.map((task) => {
            return <DraggableCard key={task.task_id} cardId={task.task_id} sectionName={sectionName} />;
          })}
        </>
      </main>
      <Button
        className="flex min-h-12 w-72 flex-shrink-0 flex-grow-0 items-center justify-start gap-3 rounded-xl bg-zinc-900 capitalize text-white"
        onClick={toggleFormOpen}
      >
        <AddIcon width={20} height={20} />
        <p>add task here....</p>
      </Button>
    </section>
  );
}
