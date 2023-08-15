import { Button, Col, View } from "@ulibs/ui";
import { createModal } from "../../../components/createModal.js";
import {
  closeModal,
  openModal,
  reload,
  runAction,
} from "../../../utils/ui.js";
import { ComponentEditForm, getPropsArray } from "./ItemModals.js";

// export function openAddComponentModal() {
//   return openModal("add-component");
// }

// export function runAddComponentAction(
//   {
//     position = "",
//     parent_id = "",
//     placement = "",
//     component_id = "",
//     props = "",
//   },
//   then = reload
// ) {
//   return runAction(
//     "add_instance",
//     `{\
//       parent_id${parent_id}, \
//       position${position}, \
//       placement${placement}, \
//       component_id${component_id}, \
//       props${props} \
//     }`,
//     then()
//   );
// }

export function ComponentAddModal({ components }) {
  const openSettings = (id = "active") =>
    openModal(`add-component-' + ${id} + '-settings`);

  return [
    components.map((component) => AddComponentSettings({ component })),
    createModal({
      $data: { active: null },
      name: "add-component",
      title: "Add Component in Page",
      actions: [
        Button({ onClick: closeModal() }, "Cancel"),

        Button(
          {
            $if: "clipboard && clipboard.mode === 'cut'",
            color: "primary",
            $disabled: "loading",
            onClick: `onAddInstance({instance_id: clipboard.instance_id}).then(res => onRemoveInstance({instance_id: clipboard.instance_id})).then(res => location.reload())`,
          },
          "Paste"
        ),

        Button(
          {
            $if: "clipboard && clipboard.mode === 'copy'",
            color: 'primary',
            $disabled: 'loading',
            onClick: `onAddInstance({instance_id: clipboard.instance_id}).then(res => location.reload())`,
          },
          "Paste"
        ),
        Button(
          {
            $disabled: "!active",
            onClick: `onComponentItemSelected({ component: active })`,

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
                $class: `active?.id === "${component.id}" ? 'active' : ''`,
                onClick: `active = ${JSON.stringify(component)}`,
                onDblclick: `onComponentItemSelected({component: ${JSON.stringify(component)}})`,
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
    $data: `componentSettings(${JSON.stringify(props)})`,
    name: `add-component-${component.id}-settings`,
    mode: "add",
    title: "Component Settings",
    onAdd: `onAddInstance({ component_id: "${component.id}", props}).then(res => location.reload())`,
    body: ComponentEditForm({ onSubmit: "" }),
  });
}
