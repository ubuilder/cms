import {
  Button,
  Card,
  Icon,
  View,
} from "@ulibs/ui";
import { Page } from "../../../components/Page.js";
import { openModal, reload, runAction } from "../../../utils/ui.js";
import { ComponentModal } from "./ComponentModal.js";
import { ComponentItem } from "./ComponentItem.js";
import { EditComponentModal } from "../../../components/ComponentEditor.js";

export * from './actions.js'
export {load} from './load.js'

function runAddAction({name = '', props = ''}) {
  return runAction("add", `{name${name},props${props}}`, reload())
}

export function runUpdateAction({id = '', name = '', props = ''}) {
  return runAction("update", `{id${id},name${name},props${props}}`, reload())
}

export default ({ components }) => {
  let script = `const data = {};`;

  script = [script + components.map(x => `data['${x.id}'] = ${JSON.stringify(x)}; `).join('\n')]
  
  return Page(
    {
      title: "Components",
      $data: 'page',
      script,
      actions: [
        Button({ href: "/admin/pages" }, [
          Icon({ name: "chevron-left" }),
          "Back",
        ]),
        Button({ color: "primary", onClick: openModal("add-component") }, [
          Icon({ name: "plus" }),
          "Add Component",
        ]),
      ],
    },
    [
      View({ d: "flex", wrap: true, gap: "sm" }, [
        components.map((component) =>
        ComponentItem({
            name: component.name,
            props: component.props,
            id: component.id,
            slot_id: component.slot_id
          })
        ),
      ]),
      ComponentModal({
        onAdd: runAddAction({}),
      }),
      EditComponentModal()
    ]
  );
};
