import { Icon, View } from "@ulibs/ui";
import { openAddComponentModal } from "./ComponentModals.js";

export function Placeholder({ id, size = "md", placement, name } = {}) {
  return View(
    {
      class: `placeholder placeholder-${size} placeholder-${placement}`,
      onClick: [
        `$event.stopPropagation()`,
        `id='${id}'`,
        `contextmenuOpen = false`,
        `position='${id}'`,
        `placement='${placement}'`,
        `if(position === '${id}') {${openAddComponentModal()}}`,
      ].join(";"),
    },
    false
      ? [[Icon({ size: "lg", name: "plus" }), "Click to add Component"]]
      : []
  );
}
