import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/shadcn/hover-card";
import { db } from "@/services/firebase";

import { colors } from "@/utils/constants";
import { doc, updateDoc } from "firebase/firestore";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/shadcn/input";

type ColorForm = {
    bgColor: string  ;
}

export default function ColorPalette() {
    const { boardId } = useParams();
    const { register, handleSubmit } = useForm<ColorForm>();

    
  const updatebgColor = async (bgColor: string ) => {
    /** 타입 맟추기용 꼼수 template literal */
    await updateDoc(doc(db, "boards", `${boardId}`), {
      board_bg_color: bgColor,
    });
  };

  const submitColor: SubmitHandler<ColorForm> = ({ bgColor }) => {
    updatebgColor(bgColor);
  };

  return (
    <HoverCard>
      <HoverCardTrigger>
        <li className="popover-item">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.83885 5.85764C6.77986 1.94203 12.8685 0.802643 17.2028 3.49752C21.4826 6.15853 23.0566 11.2746 21.3037 16.0749C19.6485 20.6075 15.2873 22.4033 12.144 20.1233C10.9666 19.2692 10.5101 18.1985 10.2895 16.4595L10.1841 15.4715L10.1387 15.0741C10.016 14.14 9.82762 13.7216 9.43435 13.5024C8.89876 13.2038 8.54213 13.1969 7.83887 13.4694L7.48775 13.615L7.30902 13.693C6.29524 14.1332 5.62085 14.2879 4.76786 14.1092L4.56761 14.062L4.40407 14.0154C1.61511 13.1512 1.20202 9.36827 3.83885 5.85764ZM4.82307 12.5741L4.94598 12.6105L5.07993 12.6414C5.519 12.7283 5.89425 12.6558 6.51695 12.3995L7.11912 12.1423C8.32126 11.6494 9.10436 11.6012 10.1646 12.1921C11.0822 12.7036 11.4399 13.4897 11.6223 14.8518L11.6755 15.3109L11.7297 15.8427L11.7768 16.2651C11.9489 17.6263 12.2617 18.3556 13.0248 18.9091C15.3001 20.5595 18.5592 19.2175 19.8947 15.5604C21.411 11.4082 20.0688 7.04581 16.4107 4.77137C12.7365 2.4869 7.5123 3.46453 5.03822 6.75848C2.96343 9.52082 3.21791 12.038 4.82307 12.5741ZM16.0476 10.5797C15.8689 9.91288 16.2646 9.22746 16.9314 9.04878C17.5983 8.87011 18.2837 9.26583 18.4624 9.93267C18.6411 10.5995 18.2453 11.2849 17.5785 11.4636C16.9117 11.6423 16.2262 11.2465 16.0476 10.5797ZM16.5421 14.0684C16.3635 13.4015 16.7592 12.7161 17.426 12.5374C18.0929 12.3588 18.7783 12.7545 18.957 13.4213C19.1356 14.0882 18.7399 14.7736 18.0731 14.9523C17.4062 15.1309 16.7208 14.7352 16.5421 14.0684ZM14.0691 7.57703C13.8904 6.9102 14.2861 6.22478 14.9529 6.0461C15.6198 5.86742 16.3052 6.26315 16.4839 6.92998C16.6625 7.59681 16.2668 8.28224 15.6 8.46091C14.9331 8.63959 14.2477 8.24386 14.0691 7.57703ZM14.0406 16.5754C13.8619 15.9086 14.2576 15.2232 14.9245 15.0445C15.5913 14.8658 16.2767 15.2615 16.4554 15.9284C16.6341 16.5952 16.2383 17.2806 15.5715 17.4593C14.9047 17.638 14.2192 17.2422 14.0406 16.5754ZM10.5436 6.60544C10.365 5.9386 10.7607 5.25318 11.4275 5.07451C12.0944 4.89583 12.7798 5.29156 12.9585 5.95839C13.1371 6.62522 12.7414 7.31064 12.0746 7.48932C11.4077 7.668 10.7223 7.27227 10.5436 6.60544Z"
              fill="white"
            />
          </svg>
          <p className="popover-text">change background color</p>
        </li>
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        sideOffset={20}
        className="relative flex w-60 flex-col items-center justify-center gap-4 overflow-hidden rounded-md border-0 bg-zinc-700 p-4"
      >
        <label htmlFor="color" className="mt-1 text-base text-slate-200">
          Choose a color
        </label>
        <form
          className="flex w-full flex-col justify-start gap-2"
          onSubmit={handleSubmit(submitColor)}
        >
          <section className="flex flex-wrap justify-between gap-2">
            {colors.map((color) => (
              <div key={color} className="flex items-center">
                <label
                  htmlFor={color}
                  className={`h-10 w-10 rounded-md ${color} flex cursor-pointer items-center justify-center`}
                >
                  <Input
                    type="radio"
                    id={color}
                    {...register("bgColor", {
                      required: true,
                    })}
                    value={color}
                    className="z-20 h-4 w-4 cursor-pointer focus:ring-sky-500"
                  />
                </label>
              </div>
            ))}
          </section>
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-md bg-zinc-900 p-2 text-white"
          >
            <p>change color</p>
          </button>
        </form>
      </HoverCardContent>
    </HoverCard>
  );
}
