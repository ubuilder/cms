import { Button, Col, View } from "@ulibs/ui";
import { createModal } from "../../../../../components/createModal.js";
import {
  closeModal,
  openModal,
  reload,
  runAction,
} from "../../../../../utils/ui.js";
import { ComponentEditForm, getPropsArray } from "./ItemModals.js";

export function ComponentAddModal({ components }) {
  const openSettings = (id = "active") =>
    openModal(`add-component-' + ${id} + '-settings`);
  const addComponent = (id = "active", props = [], then = reload) =>
    runAction(
      "add_component",
      `{position, placement, component_id: ${id}, props: ${props}}`,
      then()
    );

  return [
    components.map((component) => AddComponentSettings({ component })),
    createModal({
      $data: { active: "" },
      name: "add-component",
      title: "Add Component in Page",
      actions: [
        Button({ onClick: "$modal.close()" }, "Cancel"),

        Button(
          {
            $if: "clipboard && clipboard.mode === 'cut'",
            color: "primary",
            $disabled: "loading",
            onClick:
              "loading = true;" +
              addComponent("clipboard.component_id", "clipboard.props", () =>
                runAction(
                  "remove_component",
                  `{id: clipboard.item_id}`,
                  reload()
                )
              ),
          },
          "Paste"
        ),

        Button(
          {
            $if: "clipboard && clipboard.mode === 'copy'",
            onClick: addComponent("clipboard.component_id", "clipboard.props"),
          },
          "Paste"
        ),
        Button(
          {
            $disabled: "!active",
            onClick: closeModal() + ";" + openSettings("active"),

            color: "primary",
          },
          "Add"
        ),
      ],
      body: [
        components.map((component) =>
          Col({ col: 3 }, [
            View(
              {
                class: "component-item",
                style: "cursor: default",
                $class: `active === '${component.id}' ? 'active' : ''`,
                onClick: `active = '${component.id}'`,
                onDblclick: [
                  closeModal(),
                  openSettings(`'${component.id}'`),
                ].join(";"),
                border: true,
                borderColor: "base-400",
                p: "md",
                d: "flex",
                flexDirection: "column",
                align: "center",
                justify: "center",
              },
              [component.name]
            ),
          ])
        ),
      ],
    }),
  ];
}

export function AddComponentSettings({ component }) {
  const props = getPropsArray({ component, props: {} });

  return createModal({
    $data: { props },
    name: `add-component-${component.id}-settings`,
    mode: "add",
    title: "Component Settings",
    onAdd: runAction(
      "add_component",
      `{position, placement, component_id: '${component.id}', props}`,
      reload()
    ),
    body: ComponentEditForm({ onSubmit: "" }),
  });
}
