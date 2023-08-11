import { Card, View } from "@ulibs/ui";
import { openModal } from "../../../utils/ui.js";
import { ComponentModal } from "./ComponentModal.js";
import { runUpdateAction } from "./page.js";

export function ComponentItem({ id, name, props, slot_id }) {
    return [
      Card(
        {
          onClick: openModal("edit-component-" + id),
          border: true,
          p: "md",
          w: "100",
          d: "flex",
          align: "center",
          borderColor: "base-400",
          borderRadius: "xs",
        },
        [View({style: 'font-size: var(--size-md)'}, name), slot_id]
      ),
      ComponentModal({
        mode: "edit",
        onEdit: runUpdateAction({}),
        name: `edit-component-${id}`,
        // value: `data['${id}']`,
        value: { id, name, props, new_name: "", slot_id },
        size: "xs",
      }),
    ];
  }