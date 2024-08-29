import { useState, useRef } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Label } from "@/components/ui/shadcn/label";
import { Input } from "@/components/ui/shadcn/input";
import { useForm } from "react-hook-form";
import { useKanbanStore } from "@/store/KanbanStore";
import { AddIcon } from "@/components/svgIcons";
import { useOutsideClick } from "@/hooks/useOutsideClick";

export default function AddSectionForm() {
  const [isAddMode, setIsAddMode] = useState<boolean>(false);
  const toggleAddMode = () => setIsAddMode(!isAddMode);
  const addFormRef = useRef<HTMLFormElement | null>(null);

  const { register, handleSubmit, setValue } = useForm<FormInput>();
  const { createSection } = useKanbanStore();

  useOutsideClick({ ref: addFormRef, handler: () => toggleAddMode() });

  type FormInput = {
    sectionName: string;
  };

  const handleValid = ({ sectionName }: FormInput) => {
    createSection(sectionName);
    setValue("sectionName", "");
    toggleAddMode();
  };

  return (
    <>
      {isAddMode ? (
        <section className="flex w-64 flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-3 overflow-hidden rounded-md bg-zinc-900">
          <form
            onSubmit={handleSubmit(handleValid)}
            className="flex w-full flex-col items-start justify-start gap-3 px-3 py-4"
            ref={addFormRef}
          >
            <Label
              className="text-lg font-semibold text-white"
              htmlFor="section name"
            >
              Section Name
            </Label>
            <Input
              id="section name"
              className="h-12 w-full rounded-md border-slate-400 bg-zinc-900 pl-2 text-white"
              placeholder="Please write a section name"
              {...register("sectionName", {
                required: "Please write a section name",
              })}
            />
            <Button className="flex w-full flex-shrink-0 flex-grow-0 items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-400">
              <p>Add section </p>
            </Button>
          </form>
        </section>
      ) : (
        <Button
          className="flex min-h-12 w-64 flex-shrink-0 flex-grow-0 items-center justify-start gap-3 rounded-md bg-zinc-900 text-white"
          onClick={() => toggleAddMode()}
        >
          <AddIcon />
          <p>Add section </p>
        </Button>
      )}
    </>
  );
}
