import pages from "@/content/official/pages.json";
import branches from "@/content/official/branches.json";
import documents from "@/content/official/documents.json";
import board from "@/content/official/board.json";
import about from "@/content/official/about.json";
import chairman from "@/content/official/chairman.json";
import site from "@/content/official/site.json";

export type CmsBlock =
  | { type: "p" | "heading"; text: string; links?: { text: string; href: string }[] }
  | { type: "table"; rows: string[][] }
  | { type: "image"; src: string; width?: number; height?: number }
  | { type: "list"; items: string[] };

export interface CmsPage {
  id: number;
  title: string;
  blocks: CmsBlock[];
}

export const getCmsPage = (id: number) => (pages as unknown as Record<string, CmsPage>)[String(id)];

export { branches, documents, board, about, chairman, site };
export type Branch = (typeof branches)[number];
