 import AddSectionForm from "./AddSectionForm";
import DraggableSection from "./DraggableSection";
import { useKanbanStore } from "@/store/KanbanStore";
/* 
const getLists = async () => {};

const createList = async () => {};

const deleteList = async () => {};

const editListName = async () => {};

const updateLsit = async () => {}; */

/**
 * 칸반 보드는 ??????
 * @returns
 *
 *
 */

export default function Kanban() {
  const { sections } = useKanbanStore();

 
  

  return (
    <div className="flex h-full w-full items-start justify-start gap-20 overflow-auto bg-transparent py-6 pl-5">
      {sections && sections.map((section) => <DraggableSection sectionName={section.section_name} sectionId={section.section_id}  key={section.section_id}/>)}
      <AddSectionForm />
    </div>
  );
}
