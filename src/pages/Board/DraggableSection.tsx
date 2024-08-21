import { useState, useRef } from "react";
import { useKanbanStore } from "@/store/KanbanStore";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { CloseIcon } from "@/components/svgIcons";
import MoreIcon from "@/components/svgIcons/MoreIcon";

import { Input } from "@/components/ui/shadcn/input";
import { useForm } from "react-hook-form";

type SectionProps = {
  sectionId: string;
  sectionName: string;
};

type FormInput = {
  sectionName: string;
};
export default function DraggableSection({sectionId,sectionName}:SectionProps){
   const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { taskList, editSection, deleteSection } = useKanbanStore();

  const sectionNameRef = useRef<HTMLFormElement | null>(null);
  
  const { register, handleSubmit, setValue } = useForm<FormInput>();
  
  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const handleValid = ({ sectionName }: FormInput) => {
    editSection(sectionId, sectionName);
    console.log("form submitted");
    console.log(sectionName)
    setValue("sectionName", "");
    setIsEditMode(false);
  };

  useOutsideClick({ ref: sectionNameRef, handler: () => setIsEditMode(false) });

  return (
    <section className="relative flex min-h-20 w-[330px] flex-shrink-0 flex-grow-0 flex-col items-start justify-center gap-2.5 overflow-hidden rounded-3xl bg-gray-900">
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
              className="rounde-xl h-12 w-56 border-slate-400 bg-gray-900 pl-2 capitalize text-white"
              placeholder="Please write a section name"
              {...register("sectionName", {
                required: "Please write a section name",
              })}
            />
          </form>
        ) : (
          <p
            className="text-base font-semibold capitalize"
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
          <PopoverContent
            className="flex w-60 flex-col justify-start"
            align="start"
          >
            <section className="flex w-full flex-col items-start justify-center gap-2">
              <header className="flex w-full flex-row items-center justify-between">
                <PopoverClose>
                  <CloseIcon />
                </PopoverClose>
              </header>
            </section>
          </PopoverContent>
        </Popover>
      </header>
    </section>
  );
}
