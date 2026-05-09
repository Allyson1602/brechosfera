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
      className:
        "-left-3 top-8 h-14 w-14 rotate-12 opacity-10 md:left-24 md:top-14 md:h-20 md:w-20",
    },
    {
      src: vector2,
      className:
        "-right-4 top-24 h-14 w-14 -rotate-6 opacity-10 md:right-36 md:top-12 md:h-20 md:w-20",
    },
    {
      src: vector3,
      className:
        "left-4 top-[17rem] h-14 w-14 -rotate-12 opacity-10 md:left-10 md:top-64 md:h-20 md:w-20",
    },
    {
      src: vector4,
      className:
        "-right-5 top-[23rem] h-14 w-14 rotate-6 opacity-10 md:right-24 md:top-80 md:h-20 md:w-20",
    },
    {
      src: vector5,
      className:
        "-left-4 top-[31rem] h-14 w-14 rotate-12 opacity-10 md:left-auto md:right-14 md:top-28 md:h-20 md:w-20",
    },
    {
      src: vector6,
      className:
        "right-3 top-[39rem] h-14 w-14 -rotate-6 opacity-10 md:left-72 md:right-auto md:top-[25rem] md:h-20 md:w-20",
    },
    {
      icon: "sparkles",
      className:
        "hidden rotate-12 opacity-10 md:block md:right-52 md:top-[29rem] md:h-20 md:w-20",
    },
    {
      icon: "hanger",
      className:
        "hidden rotate-6 opacity-10 md:block md:left-40 md:top-[34rem] md:h-20 md:w-20",
    },
    {
      src: vector9,
      className:
        "hidden -rotate-12 opacity-10 md:block md:right-10 md:top-[38rem] md:h-20 md:w-20",
    },
  ],
  online: [
    {
      src: vector1,
      className:
        "-right-4 top-8 h-14 w-14 -rotate-12 opacity-10 md:right-24 md:top-16 md:h-20 md:w-20",
    },
    {
      src: vector2,
      className:
        "-left-4 top-24 h-14 w-14 rotate-6 opacity-10 md:left-36 md:top-20 md:h-20 md:w-20",
    },
    {
      src: vector3,
      className:
        "right-3 top-[17rem] h-14 w-14 rotate-12 opacity-10 md:right-12 md:top-60 md:h-20 md:w-20",
    },
    {
      src: vector4,
      className:
        "-left-5 top-[23rem] h-14 w-14 -rotate-6 opacity-10 md:left-20 md:top-80 md:h-20 md:w-20",
    },
    {
      src: vector5,
      className:
        "-right-4 top-[31rem] h-14 w-14 -rotate-12 opacity-10 md:right-72 md:top-[23rem] md:h-20 md:w-20",
    },
    {
      src: vector6,
      className:
        "left-3 top-[39rem] h-14 w-14 rotate-12 opacity-10 md:left-56 md:top-[28rem] md:h-20 md:w-20",
    },
    {
      icon: "sparkles",
      className:
        "hidden -rotate-6 opacity-10 md:block md:right-40 md:top-[34rem] md:h-20 md:w-20",
    },
    {
      icon: "hanger",
      className:
        "hidden rotate-6 opacity-10 md:block md:left-12 md:top-[39rem] md:h-20 md:w-20",
    },
    {
      src: vector9,
      className:
        "hidden rotate-12 opacity-10 md:block md:right-16 md:top-[42rem] md:h-20 md:w-20",
    },
  ],
  events: [
    {
      src: vector1,
      className:
        "-left-3 top-10 h-14 w-14 -rotate-6 opacity-10 md:left-16 md:top-24 md:h-20 md:w-20",
    },
    {
      src: vector2,
      className:
        "-right-4 top-28 h-14 w-14 rotate-12 opacity-10 md:right-20 md:top-20 md:h-20 md:w-20",
    },
    {
      src: vector3,
      className:
        "left-3 top-[17rem] h-14 w-14 rotate-6 opacity-10 md:left-44 md:top-52 md:h-20 md:w-20",
    },
    {
      src: vector4,
      className:
        "-right-5 top-[24rem] h-14 w-14 -rotate-12 opacity-10 md:right-44 md:top-72 md:h-20 md:w-20",
    },
    {
      src: vector5,
      className:
        "-left-4 top-[32rem] h-14 w-14 rotate-12 opacity-10 md:left-8 md:top-[24rem] md:h-20 md:w-20",
    },
    {
      src: vector6,
      className:
        "right-3 top-[40rem] h-14 w-14 -rotate-6 opacity-10 md:right-12 md:top-[27rem] md:h-20 md:w-20",
    },
    {
      icon: "sparkles",
      className:
        "hidden -rotate-12 opacity-10 md:block md:left-64 md:top-[32rem] md:h-20 md:w-20",
    },
    {
      icon: "hanger",
      className:
        "hidden rotate-6 opacity-10 md:block md:right-60 md:top-[36rem] md:h-20 md:w-20",
    },
    {
      src: vector9,
      className:
        "hidden rotate-12 opacity-10 md:block md:left-24 md:top-[42rem] md:h-20 md:w-20",
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
      {vectorGroups[variant].map((vector, index) =>
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
        ),
      )}
    </div>
  );
}
