import AddSectionForm from "./AddSectionForm";
import DraggableSection from "./DraggableSection";
import { useKanbanStore } from "@/store/KanbanStore";

export default function Kanban() {
  const { sections } = useKanbanStore();
  const aliveSections = sections.filter((section) => !section.archived);

  return (
    <div className="flex h-full w-full items-start justify-start gap-20 overflow-auto bg-transparent px-5 py-6">
      {aliveSections.map((section) => (
        <DraggableSection
          sectionName={section.section_name}
          sectionId={section.section_id}
          key={section.section_id}
        />
      ))}
      <AddSectionForm />
    </div>
  );
}
