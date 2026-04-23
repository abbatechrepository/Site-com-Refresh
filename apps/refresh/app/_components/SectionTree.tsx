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
    <ul className="space-y-1 text-[15px] text-[#0c67ad]">
      {nodes.map((node) => (
        <li key={node.id}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#333]">{node.name}</span>
            <span className="text-[#555]">({node._count?.contents ?? 0})</span>
            <button className="text-[12px] text-[#0c67ad] hover:underline" onClick={() => onEdit(node)} type="button">
              Editar conteúdo
            </button>
            <button className="text-[12px] text-[#0c67ad] hover:underline" onClick={onOpenContents} type="button">
              Listar conteúdos
            </button>
            <button className="text-[12px] text-[#c4473c] hover:underline" onClick={() => onDelete(node)} type="button">
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
