import AddSectionForm from "./AddSectionForm";
import DraggableSection from "./DraggableSection";
import { useKanbanStore } from "@/store/KanbanStore";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";

export default function Kanban() {
  const {
    getAliveSections,
    sections,
    swapSection,
    getTaskList,
    updateTask,
    setTaskList,
  } = useKanbanStore();

  const reOrderTask = (currentIndex: number, targetIndex: number) => {
    const result = [...getTaskList()];
    const [removed] = result.splice(currentIndex, 1);
    result.splice(targetIndex, 0, removed);

    return setTaskList(result);
  };

  const onDragTask = (result: DropResult) => {
    const { source, destination } = result;

    if (destination === null) {
      return;
    }

    /**inter section movement => 수정 필요함!!! */
    if (source.droppableId !== destination?.droppableId) {
      const currentIndex = source.index;
      const targetIndex = destination.index;

      const currentTask = getTaskList()[currentIndex];
      const { task_id, ...payload } = currentTask;

      updateTask(
        { ...payload, section_id: `${destination.droppableId}` },
        task_id,
      );
      reOrderTask(currentIndex, targetIndex);
   
    } else {
      /**same section movement */

      const currentIndex = source.index;
      const targetIndex = destination.index;

      reOrderTask(currentIndex, targetIndex);
      console.log(currentIndex);
      console.log(targetIndex);
    }
  };

  const onDragSection = (result: DropResult) => {
    const { destination, source } = result;

    /*cancel drag */
    if (destination === null) {
      return;
    }
    if (destination !== null) {
      const currentIndex = source.index;
      const targetIndex = destination.index;

      swapSection(currentIndex, targetIndex);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { type } = result;
    if (type !== "drop-section") {
      onDragTask(result);
    } else {
      onDragSection(result);
    }
  };

  if (getAliveSections())
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="drop-section"
        >
          {(provided) => (
            <div
              className="flex h-full w-full items-start justify-start gap-20 overflow-auto bg-transparent px-5 py-6"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {getAliveSections().map((section) => (
                <DraggableSection
                  sectionName={section.section_name}
                  sectionId={section.section_id}
                  sectionIndex={sections.indexOf(section)}
                  /**swap은 원본을 바꿔야 한다!!!! */
                  key={section.section_id}
                />
              ))}
              {provided.placeholder}
              <AddSectionForm />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
}
