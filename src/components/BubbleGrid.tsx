import Bubble from "./Bubble";
import type { Block } from "@/data/blocks";

export default function BubbleGrid({ blocks, onSelect }: { blocks: Block[]; onSelect: (i: number) => void }) {
  return (
    <section className="mx-auto px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] max-w-[720px]">
      {/* 用 auto-fill + 固定 minmax(寬, 寬) 鎖定每顆泡泡的寬度，避免 1fr 把它撐大 */}
      <div
        className="
          grid justify-center gap-5
          [grid-template-columns:repeat(auto-fill,minmax(136px,136px))]
          sm:[grid-template-columns:repeat(auto-fill,minmax(148px,148px))]
          md:[grid-template-columns:repeat(auto-fill,minmax(164px,164px))]
        "
      >
        {blocks.map((b, i) => (
          <Bubble
            key={b.title}
            title={b.title}
            icon={b.icon}
            gradient={b.gradient}
            isVideo={b.contentType === "video"}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </section>
  );
}
