import { Button, Col, View } from "@ulibs/ui";
import { createModal } from "../../../../components/createModal.js";
import {
  closeModal,
  openModal,
  reload,
  runAction,
} from "../../../../utils/ui.js";
import { ComponentEditForm, getPropsArray } from "./ItemModals.js";

export function openAddComponentModal() {
  return openModal("add-component");
}

export function runAddComponentAction(
  { position = "", parent_id = "", placement = "", component_id = "", props = "" },
  then = reload
) {
  return runAction(
    "add_instance",
    `{\
      parent_id${parent_id}, \
      position${position}, \
      placement${placement}, \
      component_id${component_id}, \
      props${props} \
    }`,
    then()
  );
}

export function ComponentAddModal({ components }) {
  const openSettings = (id = "active") =>
    openModal(`add-component-' + ${id} + '-settings`);

  return [
    components.map((component) => AddComponentSettings({ component })),
    createModal({
      $data: { active: "" },
      name: "add-component",
      title: "Add Component in Page",
      actions: [
        Button({ onClick: closeModal() }, "Cancel"),

        Button(
          {
            $if: "clipboard && clipboard.mode === 'cut'",
            color: "primary",
            $disabled: "loading",
            onClick:
              "loading = true;" +
              runAddComponentAction({component_id: ": clipboard.component_id", props: ": clipboard.props"}, () =>
                runAction(
                  "remove_instance",
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
            onClick: runAddComponentAction({
              component_id: ": clipboard.component_id",
              props: ": clipboard.props",
            }),
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
    onAdd: runAddComponentAction({ component_id: `: '${component.id}'` }),
    body: ComponentEditForm({ onSubmit: "" }),
  });
}
