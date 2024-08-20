import React, { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Label } from "@/components/ui/shadcn/label";
import { Input } from "@/components/ui/shadcn/input";
import { useForm } from "react-hook-form";
import { useKanbanStore } from "@/store/KanbanStore";
import { SectionDocument } from "@/Types/FireStoreModels";
import CloseIcon from "@/components/svgIcons/CloseIcon";
import { AddIcon } from "@/components/svgIcons";

export default function AddSectionForm() {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { register, handleSubmit, setValue } = useForm<FormInput>();
  const { createSection, editSection, deleteSection } = useKanbanStore();

  type FormInput = {
    sectionName: string;
  };

  const handleValid = ({ sectionName }: FormInput) => {
    createSection(sectionName);
    setValue("sectionName", "");
    setIsAdding(false);
  };
  return (
    <>
      {isAdding ? (
        <section className="flex min-h-36 w-72 flex-shrink-0 flex-grow-0 flex-col items-start justify-start overflow-hidden rounded-xl bg-black">
          <form
            onSubmit={handleSubmit(handleValid)}
            className="flex w-full flex-col items-start justify-start gap-2 px-2 py-1"
          >
            <Input
              placeholder="Please write a section name"
              {...register("sectionName", {
                required: "Please write a section name",
              })}
            />
            <Button className="flex min-h-12 flex-shrink-0 flex-grow-0 items-center justify-start gap-3 rounded-xl bg-gray-900 capitalize text-white">
              <p>add section </p>
              <button onClick={() => setIsAdding(!isAdding)} className="*:text-white">
                <CloseIcon />
              </button>
            </Button>
          </form>
        </section>
      ) : (
        <Button
          className="flex min-h-12 w-72 flex-shrink-0 flex-grow-0 items-center justify-start gap-3 rounded-xl bg-gray-900 capitalize text-white"
          onClick={() => setIsAdding(!isAdding)}
        >
          <AddIcon />
          <p>add section </p>
        </Button>
      )}
    </>
  );
}
