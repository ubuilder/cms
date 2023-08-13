import {
    View,
    Button,
    Dropdown,
    DropdownPanel,
    DropdownItem,
    Col,
    Row,
    Icon,
    Tooltip,
    CardBody,
    Modal,
    Card,
    ModalBody,
    Input,
  } from "@ulibs/ui";
  import { runAction } from "../../../utils/ui.js";

export function updateModal(props, slots) {
  return Modal({ name: "update-modal" }, [
    ModalBody([
      Row([
        // preview
        Col({}, slots),
        //properties
        Col({ $data: props }, [
          View([
            Input({ py: 0, mx: 0, "u-model": "name" }),
            Input({
              py: 0,
              mx: 0,
              label: "description",
              "u-model": "description",
            }),
            Input({ py: 0, mx: 0, label: "url", "u-model": "url" }),
            Input({ py: 0, mx: 0, label: "caption", "u-model": "caption" }),
            Input({ py: 0, mx: 0, label: "width", "u-model": "width" }),
            Input({ py: 0, mx: 0, label: "height", "u-model": "height" }),
            Input({ py: 0, mx: 0, label: "alt", "u-model": "alt" }),
            Input({ py: 0, mx: 0, label: "type", "u-model": "type" }),
          ]),
          Row([
            //control buttons
            Button({ color: "primary", onClick: "$modal.close()" }, "Close"),
            Button(
              {
                color: "error",
                onClick: `$post(window.location.origin + '/admin/assets?update', {id, name, description, url, caption, width, height, alt, type}).then(res => {$modal.close();loader = !loader})`,
                // onClick: runAction(
                //   "update",
                //   `{id, name, description, url, caption, width, height, alt, type}`,
                //   "{$modal.close();loader = !loader}"
                // ),
              },
              "Update"
            ),
          ]),
        ]),
      ]),
    ]),
  ]);
}

export function Media(props, slots) {
  return View(
    {
      ...props,
      onClick: `$modal.open('options-${props.id}')`,
      m: "xs",
      style:
        "border: 2px solid var(--color-primary-400); border-radious : var(--size-sm)",
    },
    [slots, assetModal(`options-${props.id}`)]
  );
}
export function OffCanvas() {
  return Col(
    {
      $data: { assets: [], view: "", loader: true, type: "all" },
      $effect: "loader;$post(window.location.origin + '/admin/assets?getAssets' , {type}).then(res=> view = res.view) ",
      // $effect: "loader; " + runAction("getAssets", `{type}`, "view = res.view"),
      style:
        "width: 300px; height: 85vh;overflow-y:auto; background-color: var(--color-base-800); color: var(--color-base-200);text-align:center",
    },
    [View("Assets"), headSection(), assetsSection()]
  );
}

export function headSection() {
  return Row({}, [
    Col({ col: 8, px: "sm", pe: 0 }, [
      Tooltip({ placement: "right" }, "Choose A Type"),
      Dropdown({ style: "width: 100%; display: flex" }, [
        Button({ style: "width: 100%", $text: "type" }),
        DropdownPanel([
          DropdownItem({ onClick: "type = 'all'" }, "All"),
          DropdownItem({ onClick: "type = 'image'" }, "Image"),
          DropdownItem({ onClick: "type = 'video'" }, "Video"),
          DropdownItem({ onClick: "type = 'audeo'" }, "Audeo"),
        ]),
      ]),
    ]),
    Col({ col: 4, px: "sm", $data: { file: "" } }, [
      View(
        {
          p: "xs",
          style:
            "position: relative;background: var(--color-base-200); color: var(--color-base-800)",
        },
        [
          Icon({ name: "upload" }),
          View({
            tag: "input",
            style:
              "opacity: 0;width: 100%; height: 100%; position:absolute; top:0px;left: 0px",
            name: "file",
            "u-input": true,
            type: "file",
            onChange: `$upload(()=> loader = !loader)`,
          }),
          Tooltip({ placement: "right" }, "Upload A File"),
        ]
      ),
    ]),
  ]);
}

export function assetsSection() {
  return View({ $html: "view", style: "height: 100px" });
}

export function assetModal(name) {
  return Modal({ name }, [
    ModalBody([
      Card({ title: "asset options", style: "color: var(--color-base-800)" }, [
        CardBody([
          Button({ color: "primary", onClick: "$modal.close()" }, "Close"),
          Button(
            {
              color: "error",
              onClick: `$post(window.location.origin+ '/admin/assets?remove', {id: '${
                name.split("options-")[1]
              }'}).then(res => loader = !loader)`,
              // onClick: runAction(
              //   "remove",
              //   `{id: '${name.split("options-")[1]}'}`,
              //   "loader = !loader"
              // ),
            },
            "Delete"
          ),
          Button(
            {
              color: "primary",
              // onClick: runAction(
              //   "getAsset",
              //   `{id: '${name.split("options-")[1]}'}`,
              //   `{$modal.close(); view += res.view ; setTimeout(()=>$modal.open('update-modal'), 10)}`
              // ),
              onClick: `$post(window.location.origin+ '/admin/assets?getAsset', {id: '${
                name.split("options-")[1]
              }'}).then(res => {$modal.close(); view += res.view ; setTimeout(()=>$modal.open('update-modal'), 10)})`,
            },
            "Update"
          ),
        ]),
      ]),
    ]),
  ]);
}
