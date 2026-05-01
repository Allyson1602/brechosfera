import vector1 from "@/lib/assets/images/background-vectors/1.svg";
import vector2 from "@/lib/assets/images/background-vectors/2.svg";
import vector3 from "@/lib/assets/images/background-vectors/3.svg";
import vector4 from "@/lib/assets/images/background-vectors/4.svg";
import vector5 from "@/lib/assets/images/background-vectors/5.svg";
import vector6 from "@/lib/assets/images/background-vectors/6.svg";
import vector7 from "@/lib/assets/images/background-vectors/7.svg";
import vector8 from "@/lib/assets/images/background-vectors/8.svg";
import vector9 from "@/lib/assets/images/background-vectors/9.svg";

type PageBackgroundVectorsProps = {
  variant: "events" | "home" | "online";
};

const vectorGroups: Record<
  PageBackgroundVectorsProps["variant"],
  Array<{ src: string; className: string }>
> = {
  home: [
    {
      src: vector1,
      className: "left-24 top-14 rotate-12 opacity-10 h-20 w-20",
    },
    {
      src: vector2,
      className: "right-36 top-12 -rotate-6 opacity-10 h-20 w-20",
    },
    {
      src: vector3,
      className: "left-10 top-64 -rotate-12 opacity-10 h-20 w-20",
    },
    {
      src: vector4,
      className: "right-24 top-80 rotate-6 opacity-10 h-20 w-20",
    },
    {
      src: vector5,
      className: "top-28 h-20 w-20 rotate-12 opacity-10 right-14",
    },
    {
      src: vector6,
      className: "left-72 top-[25rem] -rotate-6 opacity-10 h-20 w-20",
    },
    {
      src: vector7,
      className: "right-52 top-[29rem] rotate-12 opacity-10 h-20 w-20",
    },
    {
      src: vector8,
      className: "left-40 top-[34rem] h-20 w-20 rotate-6 opacity-10",
    },
    {
      src: vector9,
      className: "right-10 top-[38rem] -rotate-12 opacity-10 h-20 w-20",
    },
  ],
  online: [
    {
      src: vector1,
      className: "right-24 top-16 -rotate-12 opacity-10 h-20 w-20",
    },
    {
      src: vector2,
      className: "left-36 top-20 rotate-6 opacity-10 h-20 w-20",
    },
    {
      src: vector3,
      className: "right-12 top-60 rotate-12 opacity-10 h-20 w-20",
    },
    {
      src: vector4,
      className: "left-20 top-80 -rotate-6 opacity-10 h-20 w-20",
    },
    {
      src: vector5,
      className: "right-72 top-[23rem] -rotate-12 opacity-10 h-20 w-20",
    },
    {
      src: vector6,
      className: "left-56 top-[28rem] rotate-12 opacity-10 h-20 w-20",
    },
    {
      src: vector7,
      className: "right-40 top-[34rem] -rotate-6 opacity-10 h-20 w-20",
    },
    {
      src: vector8,
      className: "left-12 top-[39rem] rotate-6 opacity-10 h-20 w-20",
    },
    {
      src: vector9,
      className: "right-16 top-[42rem] rotate-12 opacity-10 h-20 w-20",
    },
  ],
  events: [
    {
      src: vector1,
      className: "left-16 top-24 -rotate-6 opacity-10 h-20 w-20",
    },
    {
      src: vector2,
      className: "right-20 top-20 rotate-12 opacity-10 h-20 w-20",
    },
    {
      src: vector3,
      className: "left-44 top-52 rotate-6 opacity-10 h-20 w-20",
    },
    {
      src: vector4,
      className: "right-44 top-72 -rotate-12 opacity-10 h-20 w-20",
    },
    {
      src: vector5,
      className: "left-8 top-[24rem] rotate-12 opacity-10 h-20 w-20",
    },
    {
      src: vector6,
      className: "right-12 top-[27rem] -rotate-6 opacity-10 h-20 w-20",
    },
    {
      src: vector7,
      className: "left-64 top-[32rem] -rotate-12 opacity-10 h-20 w-20",
    },
    {
      src: vector8,
      className: "right-60 top-[36rem] rotate-6 opacity-10 h-20 w-20",
    },
    {
      src: vector9,
      className: "left-24 top-[42rem] rotate-12 opacity-10 h-20 w-20",
    },
  ],
};

export function PageBackgroundVectors({ variant }: PageBackgroundVectorsProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {vectorGroups[variant].map((vector, index) => (
        <span
          key={`${variant}-${index}`}
          className={`absolute select-none bg-primary blur-[0.2px] ${vector.className}`}
          style={{
            WebkitMask: `url(${vector.src}) center / contain no-repeat`,
            mask: `url(${vector.src}) center / contain no-repeat`,
          }}
        />
      ))}
    </div>
  );
}
