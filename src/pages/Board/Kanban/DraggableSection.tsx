import { useState, useRef } from "react";
import { useKanbanStore } from "@/store/KanbanStore";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { CSS } from "@dnd-kit/utilities";

import { AddIcon } from "@/components/svgIcons";

import DraggableCard from "./DraggableCard";
import { Input } from "@/components/ui/shadcn/input";
import { useForm } from "react-hook-form";
import AddCardForm from "./AddCardForm";
import { useDroppable, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Button } from "@/components/ui/shadcn/button";

import SectionPopover from "./SectionPopover";
import useDisable from "@/hooks/useDisable";

type SectionProps = {
  sectionId: string;
  sectionName: string;
  disabled: boolean;
};

type FormInput = {
  sectionName: string;
};

export default function DraggableSection({
  sectionId,
  sectionName,
  disabled,
}: SectionProps) {

  const { taskList, updateSection, swapTask } = useKanbanStore();

  /**for  data i/o */

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const filteredList = taskList
    .filter((task) => task.section_id === sectionId)
    .filter((task) => !task.archived)
    .reverse();


   /**handle form */ 
  const sectionNameRef = useRef<HTMLFormElement | null>(null);

  useOutsideClick({ ref: sectionNameRef, handler: () => setIsEditMode(false) });

  const { register, handleSubmit, setValue } = useForm<FormInput>();

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

  /**for  dnd */

  const [taskDisabled, setTaskDisabled] = useState<boolean>(true);

  const { setNodeRef: DroppableRef } = useDroppable({
    id: sectionId,
  });

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: sectionId, disabled: disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDragEnd = (event) => {
    setTaskDisabled(true);
    const { active, over } = event;
    const ids = filteredList.map((task) => task.task_id);

    if (active.id !== over.id) {
      const currentIndex = ids.indexOf(active.id);
      const newIndex = ids.indexOf(over.id);
      swapTask(currentIndex, newIndex);
    }
  };

  useDisable(() => setTaskDisabled(false));

  return (
    <section
      className="relative flex min-h-20 w-[272px] flex-shrink-0 flex-grow-0 flex-col items-center justify-start overflow-hidden rounded-md bg-zinc-900 py-3"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <header className="z-10 flex h-12 w-full items-center justify-between rounded-t-xl px-4 text-white">
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
      <DndContext
        onDragStart={() => setTaskDisabled(false)}
        onDragCancel={() => setTaskDisabled(true)}
        onDragEnd={handleDragEnd}
      >
        <main
          className="z-10 flex max-h-[60vh] w-full flex-col items-center justify-start gap-3 overflow-y-auto py-2"
          ref={DroppableRef}
        >
          {isFormOpen && (
            <AddCardForm
              sectionId={sectionId}
              toggleFormOpen={toggleFormOpen}
            />
          )}
          <SortableContext
            items={filteredList.map((task) => task.task_id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredList.map((task) => {
              return (
                <DraggableCard
                  key={task.task_id}
                  cardId={task.task_id}
                  sectionName={sectionName}
                  disabled={taskDisabled}
                />
              );
            })}
          </SortableContext>
        </main>
      </DndContext>

      <Button
        className="z-10 flex h-10 w-64 flex-shrink-0 flex-grow-0 items-center justify-start gap-3 rounded-md bg-zinc-900 normal-case text-white"
        onClick={toggleFormOpen}
      >
        <AddIcon width={20} height={20} />
        <p>add task here....</p>
      </Button>
    </section>
  );
}
