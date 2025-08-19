import { IconType } from "react-icons";
import { FaBoxOpen, FaPlayCircle, FaExclamationTriangle, FaInfoCircle, FaBuilding } from "react-icons/fa";

export type Block =
  | { title: string; contentType: "video"; videoSrc: string; description: string; icon: IconType; gradient: string; }
  | { title: string; contentType: "text";  textContent: string[];              icon: IconType; gradient: string; };

export const blocks: Block[] = [
  { title: "开箱说明", contentType: "video", videoSrc: "/videos/unbox.mp4", description: "高反急救包里有哪些物品？请观看此影片。", icon: FaBoxOpen, gradient: "from-emerald-400 to-teal-500" },
  { title: "使用说明", contentType: "video", videoSrc: "/videos/howto.mp4", description: "如何正确使用高反急救包？请观看此影片。", icon: FaPlayCircle, gradient: "from-sky-400 to-indigo-500" },
  { title: "注意事项", contentType: "text",  textContent: ["高海拔地区若出现头痛、恶心、心悸，请立即休息并使用急救包。","出现全身无力或意识模糊时，务必尽快就医。","请避免剧烈活动，确保补充足够水分。"], icon: FaExclamationTriangle, gradient: "from-rose-400 to-orange-500" },
  { title: "产品说明", contentType: "text",  textContent: ["高反急救包是一套针对高海拔症状设计的随身应急用品。","内含氧气袋、紧急药物、简易手册，适合旅游、登山及户外活动携带。"], icon: FaInfoCircle, gradient: "from-fuchsia-400 to-purple-500" },
  { title: "服务单位", contentType: "text",  textContent: ["单位名称：高原健康科技有限公司","联系人：王先生","电话：02-1234-5678","Email：service@example.com"], icon: FaBuilding, gradient: "from-amber-400 to-yellow-500" },
];