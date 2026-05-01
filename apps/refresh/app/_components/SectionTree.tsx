import type { Section, TreeSection } from "../_lib/types";

type SectionTreeProps = {
  nodes: TreeSection[];
  onEdit: (section: Section) => void;
  onOpenContents: () => void;
  onDelete: (section: Section) => void;
};

export function SectionTree({
  nodes,
  onEdit,
  onOpenContents,
  onDelete
}: SectionTreeProps) {
  return (
    <ul className="space-y-2 text-[14px] text-[#0f58d8]">
      {nodes.map((node) => (
        <li key={node.id}>
          <div className="flex flex-wrap items-center gap-2 rounded-[8px] border border-[#d7e3f1] bg-white px-3 py-2 shadow-[0_8px_18px_rgba(15,33,57,0.04)]">
            <span className="font-semibold text-[#10233d]">{node.name}</span>
            <span className="text-[#58708a]">({node._count?.contents ?? 0})</span>
            <button className="admin-link text-[12px]" onClick={() => onEdit(node)} type="button">
              Editar conteúdo
            </button>
            <button className="admin-link text-[12px]" onClick={onOpenContents} type="button">
              Listar conteúdos
            </button>
            <button className="admin-link-danger text-[12px]" onClick={() => onDelete(node)} type="button">
              Excluir
            </button>
          </div>
          {node.childrenNodes.length > 0 ? (
            <div className="ml-6 mt-1">
              <SectionTree
                nodes={node.childrenNodes}
                onDelete={onDelete}
                onEdit={onEdit}
                onOpenContents={onOpenContents}
              />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
