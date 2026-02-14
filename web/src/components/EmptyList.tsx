import {  LinkSimpleIcon } from "@phosphor-icons/react/LinkSimple";

export const EmptyList = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <LinkSimpleIcon size={48} className="text-gray-400" />
      <span className="text-gray-400 text-sm font-medium uppercase">
        ainda não existem links cadastrados
      </span>
    </div>
  )
}