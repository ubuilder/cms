import { Icon, View } from "@ulibs/ui";

export function Placeholder({ id = '', size = "md", parent_id = "", placement, name } = {}) {
  return View(
    {
      class: `placeholder placeholder-${size} placeholder-${placement}`,
      onClick: [
        `$event.stopPropagation()`,
        `id='${id}'`,
        `contextmenuOpen = false`,
        `parent_id = '${parent_id}'`,
        `position='${id}'`,
        `placement='${placement}'`,
        `if(position === '${id}') $modal.open('add-component')`,
      ].join(";"),
    },
    false
      ? [[Icon({ size: "lg", name: "plus" }), "Click to add Component"]]
      : []
  );
}
