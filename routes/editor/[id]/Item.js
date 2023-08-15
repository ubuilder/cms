import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Icon,
  Tooltip,
  View,
} from "@ulibs/ui";

function ContextMenu({ item, rootId }) {
  console.log(item.id,item.parent?.id)
  function ContextMenuButton({ if: if_ = true, onClick, tooltip, icon }) {
    if (!if_) return "";
    return Button(
      {
        onClick,
        size: "sm",
      },
      [
        Tooltip(tooltip),
        Icon({ style: "--icon-size: var(--size-md)", name: icon }),
      ]
    );
  }

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
    }
    return Card([
      CardBody({ p: "xxs" }, [
        mode === "static"
          ? View({ py: "xs", px: "xxs" }, [item.component.name + " Settings"])
          : "",

        ButtonGroup({ align: "center" }, [
          ContextMenuButton({
            onClick: `onCutInstance("${item.id}", "${item.component.id}")`,
            if: item.parent,
            icon: "cut",
            tooltip: "Cut",
          }),
          ContextMenuButton({
            onClick: `onCopyInstance("${item.id}"), "${item.component.id}"`,
            icon: 'copy',
            tooltip: 'Copy',
            if: item.parent
          }),
          ContextMenuButton({
            onClick: `$modal.open('component-${item.id}-settings')`,
            icon: 'settings',
            tooltip: 'Component Settings',
          }),
          ContextMenuButton({
            onClick: `$modal.open('component-${item.id}-remove')`,
            icon: 'trash',
            tooltip: 'Remove Component',
            if: item.parent
          }),
          ContextMenuButton({
            onClick: `openCreateComponentModal("${item.id}", "${item.parent?.id ?? ''}")`,
            icon: 'star',
            tooltip: 'Create Component',
            if: item.parent
          }),
          ContextMenuButton({
            onClick: `openInsertModal("${item.id}", "${item.parent?.id ?? ''}", "before")`,
            icon: 'column-insert-left',
            tooltip: 'Insert Before',
            if: item.parent
          }),
          ContextMenuButton({
            onClick: `openInsertModal("${item.id}", "${item.parent?.id ?? ''}", "after")`,
            icon: 'column-insert-right',
            tooltip: 'Insert After',
            if: item.parent
          }),
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
      $class: `(contextmenuOpen && id==='${item.id}') ? 'open' : ''`,
      $style: `(contextmenuOpen && id==='${item.id}') ? ('top: ' + y + 'px;' + 'left: ' + x + 'px') : ''`,
    },
    [Content(item, "dynamic")]
  );
}

export function Item({ item, rootId }) {
  if (!item) return "";
  return View(
    {
      class: "item" + (item.component.id !== '000' ? " component-instance" : ""),
      id: "item-" + item.id,
      "onClick.outside": "clearSelection",
      $class: `id === '${item.id}' ? 'active' : ''`,
      onContextmenu: `openContextMenu($event, "${item.id}")`,
    },
    [item.content, ContextMenu({ item, rootId })]
  );
}
