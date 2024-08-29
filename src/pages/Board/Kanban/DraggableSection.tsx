import { useState, useRef } from "react";
import { useKanbanStore } from "@/store/KanbanStore";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { AddIcon, CloseIcon,MoreIcon, EsIcon, MoveIcon, ArchiveIcon} from "@/components/svgIcons";
 import DraggableCard from "./DraggableCard";
import { Input } from "@/components/ui/shadcn/input";
import { useForm } from "react-hook-form";
import AddCardForm from "./AddCardForm";
import { Button } from "@/components/ui/shadcn/button";
import EraseIcon from "@/components/svgIcons/EraseIcon";
 

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
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const { taskList, updateTask, updateSection } = useKanbanStore();

  const filteredList = taskList
    .filter((task) => task.section_id === sectionId)
    .filter((task) => !task.archived)
    .reverse();

  const sectionNameRef = useRef<HTMLFormElement | null>(null);

  const { register, handleSubmit, setValue } = useForm<FormInput>();

  /* element scroll to the top */

  const toggleEditMode = () => setIsEditMode(!isEditMode);
  const toggleFormOpen = () => setIsFormOpen(!isFormOpen);
  const toggleIsPopoverOpen = () => setIsPopoverOpen(!isPopoverOpen);

  const handleValid = ({ sectionName }: FormInput) => {
    updateSection(sectionId, {
      section_name: sectionName,
      archived: false,
    });
    setValue("sectionName", "");
    setIsEditMode(false);
  };

  useOutsideClick({ ref: sectionNameRef, handler: () => setIsEditMode(false) });

  return (
    <section className="relative flex min-h-20 w-[272px] flex-shrink-0 flex-grow-0 flex-col items-center justify-start overflow-hidden rounded-md bg-zinc-900 py-3">
      <header className="flex h-12 w-full items-center justify-between rounded-t-xl px-4 text-white">
        {/**section name */}
        {isEditMode ? (
          <form
            ref={sectionNameRef}
            onSubmit={handleSubmit(handleValid)}
            className="flex w-full items-center justify-start gap-3"
          >
            <Input
              id="section name"
              className="h-9 w-52 rounded-md border-slate-400 bg-zinc-700 pl-2 normal-case text-white"
              placeholder="Please write a section name"
              {...register("sectionName", {
                required: "Please write a section name",
              })}
            />
          </form>
        ) : (
          <p
            className="px-2 text-base font-semibold normal-case"
            onClick={() => toggleEditMode()}
          >
            {sectionName}
          </p>
        )}
        {/* section menu*/}
        <Popover
          open={isPopoverOpen}
          onOpenChange={() => toggleIsPopoverOpen()}
        >
          <PopoverTrigger>
            <MoreIcon />
          </PopoverTrigger>
          <PopoverContent className="popover-content" align="start">
            <section className="flex w-full flex-col items-start justify-center gap-2 pb-2">
              <header className="flex w-full flex-row items-center justify-between border-0 border-b border-zinc-500 p-3">
                <div className="relative h-4 w-[19px] flex-shrink-0 flex-grow-0 overflow-hidden" />
                <p className="popover-text normal-case">actions</p>
                <PopoverClose>
                  <CloseIcon width={16} height={16} />
                </PopoverClose>
              </header>
              <div className="flex w-full flex-col items-center justify-center">
                <ul className="popover-ul border-0 border-b border-zinc-500">
                  <li className="popover-item">
                    <EsIcon width={16} height={16} />
                    <p
                      className="popover-text"
                      onClick={() => {
                        toggleEditMode();
                        toggleIsPopoverOpen();
                      }}
                    >
                      edit section name
                    </p>
                  </li>
                  <li className="popover-item">
                    <MoveIcon width={16} height={16}/>
                    <p className="popover-text">move setion</p>
                  </li>
                </ul>
                <ul className="popover-ul">
                  <li
                    className="popover-item"
                    onClick={() => {
                      updateSection(sectionId, {
                        section_name: sectionName,
                        archived: true,
                      });
                      toggleIsPopoverOpen();
                    }}
                  >
                    <ArchiveIcon/>
                    <p className="popover-text">archive this section</p>
                  </li>
                  <li className="popover-item">
                    <EraseIcon/>
                    <p
                      className="popover-text"
                      onClick={() => {
                        filteredList.map((task) => {
                          const { task_id, ...payload } = task;
                          updateTask({ ...payload, archived: true }, task_id);
                        });
                        toggleIsPopoverOpen();
                      }}
                    >
                      archive all tasks in section
                    </p>
                  </li>
                </ul>
              </div>
            </section>
          </PopoverContent>
        </Popover>
      </header>
      <main className="flex max-h-[60vh] w-full flex-col items-center justify-start gap-3 overflow-y-auto py-2">
        {isFormOpen && (
          <AddCardForm sectionId={sectionId} toggleFormOpen={toggleFormOpen} />
        )}
        <>
          {filteredList.map((task) => {
            return (
              <DraggableCard
                key={task.task_id}
                cardId={task.task_id}
                sectionName={sectionName}
              />
            );
          })}
        </>
      </main>
      <Button
        className="flex h-10 w-64 flex-shrink-0 flex-grow-0 items-center justify-start gap-3 rounded-md bg-zinc-900 normal-case text-white"
        onClick={toggleFormOpen}
      >
        <AddIcon width={20} height={20} />
        <p>add task here....</p>
      </Button>
    </section>
  );
}
