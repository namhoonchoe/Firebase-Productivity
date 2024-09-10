import { useState, useRef } from "react";
import { useKanbanStore } from "@/store/KanbanStore";
import { useOutsideClick } from "@/hooks/useOutsideClick";

import { AddIcon } from "@/components/svgIcons";
import { Input } from "@/components/ui/shadcn/input";
import { useForm } from "react-hook-form";

import SectionPopover from "./SectionPopover";
import DraggableCard from "./DraggableCard";
import AddCardForm from "./AddCardForm";
import { Button } from "@/components/ui/shadcn/button";

import { Droppable, Draggable } from "@hello-pangea/dnd";

type SectionProps = {
  sectionId: string;
  sectionName: string;
  sectionIndex: number;
};

type FormInput = {
  sectionName: string;
};

export default function DraggableSection({
  sectionId,
  sectionName,
  sectionIndex,
}: SectionProps) {
  const { taskList, updateSection } = useKanbanStore();

  /**for  data i/o */

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

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

  const filteredTasks = taskList
    ?.filter((task) => !task?.archived)
    .filter((task) => task?.section_id === sectionId)
     

  /**for  dnd */
  if (taskList)
    return (
      <Draggable draggableId={sectionId} index={sectionIndex} key={sectionId}>
        {(provided) => (
          <section
            className="relative flex min-h-20 w-[272px] flex-shrink-0 flex-grow-0 flex-col items-center justify-start overflow-hidden rounded-md bg-zinc-900 py-3"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
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
                filteredList={filteredTasks}
              />
            </header>
            <Droppable
              droppableId={sectionId}
              direction="vertical"
            >
              {(provided) => (
                <main
                  className="z-10 flex max-h-[60vh] w-full flex-col items-center justify-start gap-3 overflow-y-auto grow  py-2"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {isFormOpen && (
                    <AddCardForm
                      sectionId={sectionId}
                      toggleFormOpen={toggleFormOpen}
                    />
                  )}

                  {filteredTasks.map((task) => {
                    return (
                      <DraggableCard
                        key={task.task_id}
                        cardId={task.task_id}
                        sectionName={sectionName}
                      />
                    );
                  })}
                  {provided.placeholder}
                </main>
              )}
            </Droppable>
            <Button
              className="z-10 flex h-10 w-64 flex-shrink-0 flex-grow-0 items-center justify-start gap-3 rounded-md bg-zinc-900 normal-case text-white"
              onClick={toggleFormOpen}
            >
              <AddIcon width={20} height={20} />
              <p>add task here....</p>
            </Button>
          </section>
        )}
      </Draggable>
    );
}
