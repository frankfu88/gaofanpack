// /src/data/blocks.ts
import { IconType } from "react-icons";
import { FaBoxOpen, FaPlayCircle, FaExclamationTriangle, FaInfoCircle, FaBuilding } from "react-icons/fa";

export type VideoSource = { src: string; type?: string };

export type Block =
  | {
      title: string;
      contentType: "video";
      sources: VideoSource[];   // 改成多來源
      poster?: string;
      description: string;
      icon: IconType;
      gradient: string;
    }
  | {
      title: string;
      contentType: "text";
      textContent: string[];
      icon: IconType;
      gradient: string;
    };

export const blocks: Block[] = [
  {
    title: "开箱说明",
    contentType: "video",
    sources: [
      { src: "/videos/unbox-720.mp4", type: "video/mp4" },
      { src: "/videos/unbox.mp4",     type: "video/mp4" },
    ],
    poster: "/images/posters/unbox.jpg",
    description: "高反急救包里有哪些物品？请观看此影片。",
    icon: FaBoxOpen,
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    title: "使用说明",
    contentType: "video",
    sources: [
      { src: "/videos/howto-720.mp4", type: "video/mp4" },
      { src: "/videos/howto.mp4",     type: "video/mp4" },
    ],
    poster: "/images/posters/howto.jpg",
    description: "如何正确使用高反急救包？请观看此影片。",
    icon: FaPlayCircle,
    gradient: "from-sky-400 to-indigo-500",
  },
  {
    title: "注意事项",
    contentType: "text",
    textContent: [
      "依症状对应用法：如头痛/头晕、乏力/意识模糊、恶心呕吐、失眠或嗜睡、气喘或呼吸困难、心悸心跳加快等，可搭配“高反灵＋氧气瓶／高压氧舱＋红景天（或葡萄糖水）”使用。",
      "需要快速缓解时，请依说明先使用止痛药（标示5分钟内见效），并雾化吸入多肽灵芝高反灵，以帮助扩张呼吸道并提升氧气摄取。",
      "若症状持续或影响活动，请评估改采50分钟的根本处理方案（红景天＋微高压氧舱），并遵循专业指引。",
    ],
    icon: FaExclamationTriangle,
    gradient: "from-rose-400 to-orange-500",
  },
  {
    title: "产品说明",
    contentType: "text",
    textContent: [
      "多肽灵芝高反灵（雾化吸入）：与浙江科技大学、台湾科技大学团队合作开发；低温多肽萃取，不含激素与人工化学添加。雾化吸收后可扩张气管与肺泡、加速氧气摄取并提升血氧，用于缓解胸闷、气喘、头痛等高反症状。",
      "多肽红景天精华液：采用低温多肽萃取成小分子，易于吸收；可提升红细胞摄氧能力，缓解脑部缺氧。配合微高压氧舱的富氧加压环境，能够更快速高效地提升体内含氧量。",
      "工具定位：微高压氧舱（加压促进氧气溶入）、灵芝（提升肺部摄氧能力）、红景天（提升气血量与红细胞摄氧）。登山或前往高海拔时，可根据情况选择快速缓解或根本处理方案。",
    ],
    icon: FaInfoCircle,
    gradient: "from-fuchsia-400 to-purple-500",
  },
  {
    title: "服务单位",
    contentType: "text",
    textContent: ["（相关单位资讯待补充）"],
    icon: FaBuilding,
    gradient: "from-amber-400 to-yellow-500",
  },
];
