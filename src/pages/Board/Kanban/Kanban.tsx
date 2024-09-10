import { Task } from "@/Types/FireStoreModels";
import AddSectionForm from "./AddSectionForm";
import DraggableSection from "./DraggableSection";
import { useKanbanStore } from "@/store/KanbanStore";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";

export default function Kanban() {
  const {
    getAliveSections,
    sections,
    swapSection,
    taskList,
    updateTask,
    setTaskList,
  } = useKanbanStore();

  const reOrderTask = (currentIndex: number, targetIndex: number) => {
    const result = [...taskList];
    const [removed] = result.splice(currentIndex, 1);
    result.splice(targetIndex, 0, removed);

    return setTaskList(result);
  };

  const onDragTask = (result: DropResult) => {
    const { source, destination } = result;

    if (destination === null) {
      return;
    }

    /**inter section movement */
    if (source.droppableId !== destination?.droppableId) {
      const currentTask = taskList[source.index];

      const { task_id, ...payload } = currentTask;

      updateTask(
        { ...payload, section_id: `${destination.droppableId}` },
        task_id,
      );
    } else {
      /**same section movement */

      const currentIndex = source.index;
      const targetIndex = destination.index;
      reOrderTask(currentIndex, targetIndex);
    }
  };

  const onDragSection = (result: DropResult) => {
    const { destination, source } = result;
    console.log(source?.index);
    console.log(destination?.index);

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
    if (type !== "drop-task") {
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
          type="drop-task"
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
