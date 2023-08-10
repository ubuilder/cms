import { Button, ButtonGroup, Card, CardBody, CardFooter, Icon, Modal, Row } from "@ulibs/ui";
import { closeModal } from "../utils/ui.js";

export function createModal({
    name,
    size = "xs",
    $data = {},
    title = "Modal Title",
    actions = [],
    body = [],
    onAdd = "",
    onEdit = "",
    mode = "default",
  }) {
    let actionButtons = actions;

    
    if (mode === "add") {
      actionButtons = [
        Button({ onClick: closeModal() }, "Cancel"),
        
        Button(
          {
            $disabled: 'loading',
            onClick: 'loading = true;' + onAdd + ";loading = false;" + closeModal(),
            color: "primary",
          },
          [Icon({ name: "plus" }), "Add"]
        ),
      ];
    } else if (mode === "edit") {
      actionButtons = [
        Button({ onClick: closeModal() }, "Cancel"),

        Button(
          {
            onClick: 'loading = true;' + onEdit + ";loading = false;" + closeModal(),
            color: "primary",
          },
          [Icon({ name: "pencil" }), "Update"]
        ),
      ];
    }
    return Modal({$data: {...$data, loading: false}, name, size }, [
      Card({ title }, [
        CardBody({ style: "overflow: auto; max-height: 80%" }, [Row([body])]),
        CardFooter([ButtonGroup({ ms: "auto" }, actionButtons)]),
      ]),
    ]);
  }
