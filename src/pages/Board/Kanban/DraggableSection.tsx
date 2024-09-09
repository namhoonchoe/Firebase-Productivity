import { useState, useRef } from "react";
import { useKanbanStore } from "@/store/KanbanStore";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import {CSS} from '@dnd-kit/utilities';

import { AddIcon } from "@/components/svgIcons";

import DraggableCard from "./DraggableCard";
import { Input } from "@/components/ui/shadcn/input";
import { useForm } from "react-hook-form";
import AddCardForm from "./AddCardForm";
import { useDraggable, Sensors } from "@dnd-kit/core";
import {useSortable} from '@dnd-kit/sortable';

import { Button } from "@/components/ui/shadcn/button";

import SectionPopover from "./SectionPopover";

type SectionProps = {
  sectionId: string;
  sectionName: string;
  disabled:boolean
 
};

type FormInput = {
  sectionName: string;
};

export default function DraggableSection({
  sectionId,
  sectionName,
  disabled,
 
}: SectionProps) {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const { taskList, updateSection, swapSection, sections } = useKanbanStore();

  const filteredList = taskList
    .filter((task) => task.section_id === sectionId)
    .filter((task) => !task.archived)
    .reverse();

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({id:sectionId,disabled:disabled});
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

  const sectionNameRef = useRef<HTMLFormElement | null>(null);

  const { register, handleSubmit, setValue } = useForm<FormInput>();

  /* element scroll to the top */

  const toggleEditMode = () => setIsEditMode(!isEditMode);
  const toggleFormOpen = () => setIsFormOpen(!isFormOpen);

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
    <section
      className="relative flex min-h-20 w-[272px] flex-shrink-0 flex-grow-0 flex-col items-center justify-start overflow-hidden rounded-md bg-zinc-900 py-3"
      ref={setNodeRef} style={style} {...attributes} {...listeners}
      
     >
      <header className="flex h-12 w-full items-center justify-between rounded-t-xl px-4 text-white z-10">
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
        <SectionPopover
          sectionId={sectionId}
          sectionName={sectionName}
          toggleEditMode={toggleEditMode}
          filteredList={filteredList}
        />
      </header>
      <main className="flex max-h-[60vh] w-full flex-col items-center justify-start gap-3 overflow-y-auto py-2 z-10">
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
        className="flex h-10 w-64 flex-shrink-0 flex-grow-0 items-center justify-start gap-3 rounded-md bg-zinc-900 normal-case text-white z-10"
        onClick={toggleFormOpen}
      >
        <AddIcon width={20} height={20} />
        <p>add task here....</p>
      </Button>
    </section>
  );
}
