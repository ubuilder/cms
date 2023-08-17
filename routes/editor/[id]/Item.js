import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Icon,
  Tooltip,
  View,
} from "@ulibs/ui";

/**
 * 
 * @param {Object} param0 
 * @param {Instance} param0.instance
 * 
 * @returns {string}
 */
function ContextMenu({ instance }) {

  function ContextMenuButton({ if: if_, onClick, tooltip, icon }) {
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

  function Content(instance, mode = "static") {
    if (!instance) return;
    console.log('here: ', instance)

    return Card([
      CardBody({ p: "xxs" }, [
        mode === "static"
          ? View({ py: "xs", px: "xxs" }, [instance.component.name + " Settings"])
          : "",

        ButtonGroup({ align: "center" }, [
          ContextMenuButton({
            onClick: `onCutInstance("${instance.id}", "${instance.component.id}")`,
            if: instance.parent,
            icon: "cut",
            tooltip: "Cut",
          }),
          ContextMenuButton({
            onClick: `onCopyInstance("${instance.id}", "${instance.component.id}")`,
            icon: 'copy',
            tooltip: 'Copy',
            if: instance.parent
          }),
          ContextMenuButton({
            onClick: `$modal.open('component-${instance.id}-settings')`,
            icon: 'settings',
            tooltip: 'Component Settings',
            if: true,
          }),
          ContextMenuButton({
            onClick: `$modal.open('component-${instance.id}-remove')`,
            icon: 'trash',
            tooltip: 'Remove Component',
            if: instance.parent
          }),
          ContextMenuButton({
            onClick: `openCreateComponentModal("${instance.id}", "${instance.parent?.id ?? ''}")`,
            icon: 'star',
            tooltip: 'Create Component',
            if: instance.parent
          }),
          ContextMenuButton({
            onClick: `openInsertModal("${instance.id}", "${instance.parent?.id ?? ''}", "before")`,
            icon: 'column-insert-left',
            tooltip: 'Insert Before',
            if: instance.parent
          }),
          ContextMenuButton({
            onClick: `openInsertModal("${instance.id}", "${instance.parent?.id ?? ''}", "after")`,
            icon: 'column-insert-right',
            tooltip: 'Insert After',
            if: instance.parent
          }),
        ]),
      ]),
      instance.parent ? Content(instance.parent) : "",
    ]);
  }

  return View(
    {
      class: "context-menu",
      "u-cloak": true,
      "onClick.outside": "contextmenuOpen = false",
      onClick: "contextmenuOpen = false",
      $class: `(contextmenuOpen && id==='${instance.id}') ? 'open' : ''`,
      $style: `(contextmenuOpen && id==='${instance.id}') ? ('top: ' + y + 'px;' + 'left: ' + x + 'px') : ''`,
    },
    [Content(instance, "dynamic")]
  );
}


/**
 * Wrapper elementt which enables in-page Editing
 * @param {Object} param0 
 * @param {Instance} param0.instance
 * @param {string} param0.html
 * @param {Instance | undefined} param0.parent
 * 
 * @returns {string}
 */
export function InstanceWrapper({ instance, html }) {
  
  return View(
    {
      class: "item" + (instance.component_id !== '000' ? " component-instance" : ""),
      id: "item-" + instance.id,
      "onClick.outside": "clearSelection",
      $class: `id === '${instance.id}' ? 'active' : ''`,
      onContextmenu: `openContextMenu($event, "${instance.id}")`,
    },
    [html, ContextMenu({ instance })]
  );
}
