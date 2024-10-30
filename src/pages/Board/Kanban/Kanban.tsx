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

    /**inter section movement => 수정 필요함!!! */
    if (source.droppableId !== destination?.droppableId) {
      const currentIndex = source.index;
      const targetIndex = destination.index;

      const sectionIds = sections.map((section) => section.section_id);

      const currentList = taskList.filter(
        (item) => item.section_id === source.droppableId,
      );

      const targetList = taskList.filter(
        (item) => item.section_id === destination.droppableId,
      );

      const draggingTask = currentList[currentIndex];
      const { task_id, ...payload } = draggingTask;

      updateTask(
        { ...payload, section_id: `${destination.droppableId}` },
        task_id,
      );

      //현재 리스트에서 삭제
      currentList.splice(currentIndex, 1);
      //타겟 리스트에 추가
      targetList.splice(targetIndex, 0, draggingTask);

      // 전체 리스트 업데이트

      const groupBysectionId = taskList.reduce(
        (acc: { [key: string]: Task[] }, curr) => {
          const { section_id } = curr;
          if (acc[section_id]) {
            acc[section_id].push(curr);
          } else {
            acc[section_id] = [curr];
          }
          return acc;
        },
        {},
      );

      console.log(Object.values(groupBysectionId));
    } else {
      /**same section movement */

      const currentIndex = source.index;
      const targetIndex = destination.index;

      reOrderTask(currentIndex, targetIndex);
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
