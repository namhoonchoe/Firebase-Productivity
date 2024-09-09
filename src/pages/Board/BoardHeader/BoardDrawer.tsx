import SeeArchiveIcon from "@/components/svgIcons/SeeArchiveIcon";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/shadcn/sheet";

import * as SheetPrimitive from "@radix-ui/react-dialog";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shadcn/tabs";
import { CloseIcon, DeleteIcon, RestoreIcon } from "@/components/svgIcons";
import { useKanbanStore } from "@/store/KanbanStore";

export default function BoardDrawer() {
  const {
    taskList,
    sections,
    deleteTask,
    updateTask,
    updateSection,
    deleteSection,
   
  } = useKanbanStore();
  const archivedList = taskList.filter((task) => task.archived);
  const archivedSections = sections.filter((section) => section.archived);

  /** delete section handler */
  const dsHandler = (targetId: string) => {
     

    /* delete tasks in section */
    taskList.map((task) => {
      if (task.section_id === targetId) {
        deleteTask(task.task_id);
      }
    });

    
    deleteSection(targetId);
  };

  /** delete task handler */
 

  return (
    <Sheet>
      <SheetTrigger>
        <li className="popover-item">
          <SeeArchiveIcon />
          <p className="popover-text">see archived items</p>
        </li>
      </SheetTrigger>
      <SheetContent className="border-0 bg-zinc-900">
        <SheetHeader className="relative mb-3 flex w-full flex-row items-center justify-center border-0 border-b border-zinc-500 pb-3">
          <SheetTitle className="text-xl font-medium capitalize text-white">
            Archived
          </SheetTitle>
          <SheetPrimitive.Close className="absolute right-0">
            <CloseIcon />
          </SheetPrimitive.Close>
        </SheetHeader>
        <Tabs defaultValue="cards">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-600 font-medium capitalize text-white shadow-lg">
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
          </TabsList>
          <TabsContent value="cards">
            <ul className="flex w-full flex-col items-center justify-start gap-4 py-4">
              {/* archived cards */}
              {archivedList.map((card) => {
                const [section] = sections.filter(
                  (section) => section.section_id === card.section_id,
                );
                const { task_id: targetId, ...payload } = card;
                return (
                  <section className="flex w-full flex-col items-start justify-start gap-3">
                    <div className="w-full rounded-xl bg-zinc-800 px-6 py-4">
                      <p className="max-w-full break-all text-lg font-semibold text-white">
                        {`${card.task_title} in ${section.section_name}`}
                      </p>
                    </div>
                    <div className="flex flex-row items-center justify-start gap-3 pl-2 text-white">
                      <div>
                        {/* restore task */}
                        <p
                          className="text-md flex items-center gap-3 rounded-xl px-3 py-2 capitalize hover:bg-zinc-900"
                          onClick={() =>
                            updateTask(
                              {
                                ...payload,
                                archived: false,
                              },
                              targetId,
                            )
                          }
                        >
                          <RestoreIcon /> restore
                        </p>
                      </div>
                      <div>
                        {/* delete task */}
                        <p
                          className="text-md flex items-center gap-3 rounded-xl px-3 py-2 capitalize hover:bg-zinc-900"
                          onClick={() => deleteTask(card.task_id)}
                        >
                          <DeleteIcon />
                          delete
                        </p>
                      </div>
                    </div>
                  </section>
                );
              })}
            </ul>
          </TabsContent>
          <TabsContent value="sections">
            <ul className="flex w-full flex-col items-center justify-start gap-4 py-4">
              {archivedSections.map((section) => {
                return (
                  <section className="flex w-full flex-col items-start justify-start gap-3">
                    <div className="w-full rounded-xl bg-zinc-800 px-6 py-4">
                      <p className="max-w-full break-all text-lg font-semibold text-white">
                        {section.section_name}
                      </p>
                    </div>
                    <div className="flex flex-row items-center justify-start gap-3 pl-2 text-white">
                      {/* restore task */}
                      <p
                        className="text-md flex items-center gap-3 rounded-xl px-3 py-2 capitalize hover:bg-zinc-900"
                        onClick={() => {
                          const { section_id, ...payload } = section;
                          updateSection(section_id, {
                            ...payload,
                            archived: false,
                          });
                        }}
                      >
                        <RestoreIcon /> restore
                      </p>

                      {/* delete task */}
                      <p
                        className="text-md flex items-center gap-3 rounded-xl px-3 py-2 capitalize hover:bg-zinc-900"
                        onClick={() => dsHandler(section.section_id)}
                      >
                        <DeleteIcon />
                        delete
                      </p>
                    </div>
                  </section>
                );
              })}
            </ul>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
