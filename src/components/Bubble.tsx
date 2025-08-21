import { IconType } from "react-icons";

type Props = {
  title: string;
  icon: IconType;
  gradient: string;
  isVideo?: boolean;
  onClick?: () => void;
};

export default function Bubble({ title, icon: Icon, gradient, isVideo, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={title}
      className="group relative w-full aspect-square rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-transform duration-200 ease-out active:scale-95"
    >
      <span className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-0 group-active:opacity-100 group-hover:opacity-100 transition-opacity" />
      <span className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} shadow-[inset_0_-18px_40px_rgba(0,0,0,0.15)]`} />

      <span className="relative z-10 h-full w-full rounded-full flex flex-col items-center justify-center text-center text-white px-3">
        {/* 改用 w/h 控制圖示比例，搭配固定欄寬更穩定 */}
        <Icon className="mb-2 opacity-95 drop-shadow-lg w-10 h-10 md:w-11 md:h-11" />
        <span className="font-bold leading-tight drop-shadow-md text-[15px] sm:text-base md:text-lg">
          {title}
        </span>
        {isVideo && (
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/90 text-gray-900 px-2 py-0.5 shadow text-[12px] sm:text-xs font-semibold">
            视频
          </span>
        )}
      </span>

      <span className="absolute inset-0 rounded-full ring-1 ring-white/40 bg-white/10 backdrop-blur-[1px] mix-blend-luminosity" />
    </button>
  );
}
