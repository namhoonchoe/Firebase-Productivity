import useDisable from "@/hooks/useDisable";
import AddSectionForm from "./AddSectionForm";
import DraggableSection from "./DraggableSection";
import { useKanbanStore } from "@/store/KanbanStore";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";

export default function Kanban() {
  const { sections, swapSection } = useKanbanStore();
  const aliveSections = sections.filter((section) => !section.archived);
  const [disabled, setDisabled] = useState<boolean>(true);

  const handleDragEnd = (event) => {
    setDisabled(true);
    const { active, over } = event;
    const ids = aliveSections.map((section) => section.section_id);

    if (active.id !== over.id) {
      const currentIndex = ids.indexOf(active.id);
      const newIndex = ids.indexOf(over.id);
      swapSection(currentIndex, newIndex);
    }
  };
 
  useDisable(()=>setDisabled(false))

  return (
    <DndContext
      onDragStart={() => setDisabled(false)}
      onDragCancel={() => setDisabled(true)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full w-full items-start justify-start gap-20 overflow-auto bg-transparent px-5 py-6">
        <SortableContext
          items={aliveSections.map((section) => section.section_id)}
          /**
           * https://github.com/clauderic/dnd-kit/issues/807  Amareis 참조!!!
           */
        >
          {aliveSections.map((section) => (
            <DraggableSection
              sectionName={section.section_name}
              sectionId={section.section_id}
              disabled={disabled}
              key={section.section_id}
            />
          ))}
        </SortableContext>
        <AddSectionForm />
      </div>
    </DndContext>
  );
}
