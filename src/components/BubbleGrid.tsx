import Bubble from "./Bubble";
import type { Block } from "@/data/blocks";

export default function BubbleGrid({ blocks, onSelect }: { blocks: Block[]; onSelect: (i: number) => void }) {
  return (
    <section className="mx-auto px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] max-w-[680px]">
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))] gap-5">
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