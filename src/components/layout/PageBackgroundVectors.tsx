import vector1 from "@/lib/assets/images/background-vectors/1.svg";
import vector2 from "@/lib/assets/images/background-vectors/2.svg";
import vector3 from "@/lib/assets/images/background-vectors/3.svg";
import vector4 from "@/lib/assets/images/background-vectors/4.svg";
import vector5 from "@/lib/assets/images/background-vectors/5.svg";
import vector6 from "@/lib/assets/images/background-vectors/6.svg";
import vector9 from "@/lib/assets/images/background-vectors/9.svg";

type PageBackgroundVectorsProps = {
  variant: "events" | "home" | "online";
};

const vectorGroups: Record<
  PageBackgroundVectorsProps["variant"],
  Array<
    | { src: string; className: string; icon?: never }
    | { icon: "sparkles" | "hanger"; className: string; src?: never }
  >
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
      icon: "sparkles",
      className: "right-52 top-[29rem] rotate-12 opacity-10 h-20 w-20",
    },
    {
      icon: "hanger",
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
      icon: "sparkles",
      className: "right-40 top-[34rem] -rotate-6 opacity-10 h-20 w-20",
    },
    {
      icon: "hanger",
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
      icon: "sparkles",
      className: "left-64 top-[32rem] -rotate-12 opacity-10 h-20 w-20",
    },
    {
      icon: "hanger",
      className: "right-60 top-[36rem] rotate-6 opacity-10 h-20 w-20",
    },
    {
      src: vector9,
      className: "left-24 top-[42rem] rotate-12 opacity-10 h-20 w-20",
    },
  ],
};

function DecorativeIcon({
  icon,
  className,
}: {
  icon: "sparkles" | "hanger";
  className: string;
}) {
  if (icon === "sparkles") {
    return (
      <svg
        aria-hidden="true"
        className={`absolute select-none text-primary blur-[0.2px] ${className}`}
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M47 6c2 24 7 29 31 31-24 2-29 7-31 31-2-24-7-29-31-31 24-2 29-7 31-31Z" />
        <path d="M78 58c1 12 4 15 16 16-12 1-15 4-16 16-1-12-4-15-16-16 12-1 15-4 16-16Z" />
        <path d="M22 62c1 8 3 10 11 11-8 1-10 3-11 11-1-8-3-10-11-11 8-1 10-3 11-11Z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={`absolute select-none text-primary blur-[0.2px] ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="7"
    >
      <path d="M50 38v-5c0-9 7-16 16-16 7 0 13 5 13 12 0 8-6 12-13 15L50 52" />
      <path d="M50 52 15 74c-5 3-3 10 3 10h64c6 0 8-7 3-10L50 52Z" />
    </svg>
  );
}

export function PageBackgroundVectors({ variant }: PageBackgroundVectorsProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {vectorGroups[variant].map((vector, index) => (
        vector.icon ? (
          <DecorativeIcon
            key={`${variant}-${index}`}
            icon={vector.icon}
            className={vector.className}
          />
        ) : (
          <img
            key={`${variant}-${index}`}
            src={vector.src}
            alt=""
            draggable={false}
            className={`absolute select-none object-contain blur-[0.2px] [filter:brightness(0)_saturate(100%)_invert(27%)_sepia(86%)_saturate(2218%)_hue-rotate(313deg)_brightness(91%)_contrast(90%)] ${vector.className}`}
          />
        )
      ))}
    </div>
  );
}
