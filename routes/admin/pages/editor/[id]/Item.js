import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Icon,
  Tooltip,
  View,
} from "@ulibs/ui";
import { Placeholder } from "./Placeholder.js";
import { openModal } from "../../../../../utils/ui.js";

function ContextMenu({ item }) {
  function Content(item, mode = "static") {
    if (!item) return;
    const props = [];

    for (let prop of item.component.props) {
      props.push({
        name: prop.name,
        value: item.props[prop.name] ?? {
          type: "static",
          value: prop.default_value,
        },
      });
      console.log({ props });
    }
    return Card([
      CardBody({ p: "xxs" }, [
        mode === "static"
          ? View({ py: "xs", px: "xxs" }, [item.component.name + " Settings"])
          : "",

        ButtonGroup({ align: "center" }, [
          Button(
            {
              onClick: `document.querySelector('#item-${
                item.id
              }').classList.add('cut'); clipboard = ${JSON.stringify({
                item_id: item.id,
                mode: "cut",
                component_id: item.component.id,
                props,
              }).replace(/"/g, "&quot;")}`,
              size: "sm",
            },
            [Tooltip("Cut"), Icon({ style: '--icon-size: var(--size-md)', name: "cut" })]
          ),
          Button(
            {
              onClick: `document.querySelector('#item-${
                item.id
              }').classList.add('copy'); clipboard = ${JSON.stringify({
                mode: "copy",
                component_id: item.component.id,
                props,
              }).replace(/"/g, "&quot;")}`,
              size: "sm",
            },
            [Tooltip("Copy"), Icon({ style: '--icon-size: var(--size-md)', name: "copy" })]
          ),
          Button(
            {
              size: "sm",
              onClick: `$modal.open('component-${item.id}-settings')`,
            },
            [Tooltip("Component Settings"), Icon({ style: '--icon-size: var(--size-md)', name: "settings" })]
          ),
          Button(
            {
              size: "sm",
              onClick: `$modal.open('component-${item.id}-remove')`,
            },
            [Tooltip("Remove Component"), Icon({ style: '--icon-size: var(--size-md)', name: "trash" })]
          ),
          Button(
            {
              size: "sm",
              onClick: `$modal.open('convert-component-${item.id}')`,
            },
            [Icon({ style: '--icon-size: var(--size-md)', name: "star" }), Tooltip("Convert to Component")]
          ),
          Button(
            {
              size: "sm",
              onClick: [
                `position='${item.id}'`,
                `placement='before'`,
                openModal("add-component"),
              ].join(";"),
            },
            [Tooltip("Insert Before"), Icon({ style: '--icon-size: var(--size-md)', name: "column-insert-left" })]
          ),
          Button(
            {
              size: "sm",
              onClick: ` position='${item.id}'; placement='after'; ${openModal(
                "add-component"
              )}`,
            },
            [Tooltip("Insert After"), Icon({ style: '--icon-size: var(--size-md)', name: "column-insert-right" })]
          ),
        ]),
      ]),
      item.parent ? Content(item.parent) : "",
    ]);
  }

  return View(
    {
      class: "context-menu",
      "u-cloak": true,
      "onClick.outside": "contextmenuOpen = false",
      onClick: "contextmenuOpen = false",
      $style: `(contextmenuOpen && id==='${item.id}') ? ('z-index: 2; min-height: auto; position: fixed; display: block; top: ' + y + 'px;' + 'left: ' + x + 'px') : 'display: none'`,
    },
    [Content(item, "dynamic")]
  );
}

export function Item({ item }) {
  if (!item) return "";
  return View(
    {
      class: "item",
      id: "item-" + item.id,
      "onClick.outside": "id = ''; contextmenuOpen = false",
      $class: `id === '${item.id}' ? 'active' : ''`,
      onContextmenu: [
        "$event.preventDefault()",
        "$event.stopPropagation()",
        "contextmenuOpen = false",
        `id = '${item.id}'`,
        `if(id ==='${item.id}') { \
            contextmenuOpen = true; \
            x = $event.clientX; \
            y = $event.clientY;\
        } else {\
            id = '${item.id}'\
        }`,
      ].join(";"),
      style: "cursor: default",
    },
    [
      Placeholder({
        id: item.id,
        placement: "before",
        size: "sm",
      }),
      item.content,
      ContextMenu({ item }),
    ]
  );
}
