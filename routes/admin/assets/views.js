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
  Popover,
  Select,
} from "@ulibs/ui";
import { runAction } from "../../../utils/ui.js";

export function assetView(props, slots) {
  return Card([
    // CardBody([
    Row([
      // preview
      Col({}, slots),
      //properties
      Col({ $data: props }, [
        Object.entries(props).map((prop) => {
          if (prop[0] == "id") return "";
          return View([
            View(prop[0].slice(0, 1).toUpperCase() + prop[0].slice(1)),
            View({
              tag: "input",
              "u-model": `${prop[0]}`,
            }),
          ]);
        }),
        Row({ d: "flex", p: "xxs", style: "justify-content: space-between" }, [
          //control buttons
          Button({ color: "primary", onClick: "$modal.close()" }, "Close"),
          Button(
            {
              color: "error",
              onClick: `$post('?remove', {id: '${props.id}'}).then(res=>loader = !loader);$modal.close()`,
            },
            "Delete"
          ),
          Button(
            {
              color: "primary",
              onClick: `$post('?update', {${Object.entries(props).map(
                (p) => p[0]
              )}}).then(res => {$modal.close();loader = !loader})`,
            },
            "Update"
          ),
        ]),
      ]),
    ]),
  ]);
  // ])
}

export function Media(props, slots) {
  if (props.mode == "select") {
    return wrapper(
      View(
        {
          ...props,
          onClick: "console.log('selected')",
          style:
            "position: relative;border: 1px solid var(--color-base-400);display: flex; justify-content: center; align-items: centter;cursor: pointer; overflow: hidden;width: 100px; height: 100px",
        },
        [slots]
      )
    );
  } else {
    return wrapper(
      View(
        {
          $data: { openModal: false },
          ...props,
          onClick: `openModal= true; $modal.open('asset-${props.id}')`,
          style:
            ";position: relative;border: 1px solid var(--color-base-400);display: flex; justify-content: center; align-items: centter;cursor: pointer; overflow: hidden;width: 100px; height: 100px",
        },
        [slots, assetModal(props.id)]
      )
    );
  }
}
export default function () {
  return Col(
    {
      $data: { assets: [], view: "", loader: true, type: "all" },
      $effect: "loader; " + runAction("getAssets", `{type}`, "view = res.view"),
      style: "width: 100%; height: 100%; ;text-align:center",
    },
    [View("Assets"), headSection(), assetsSection()]
  );
}

export function fileUpload(callback) {
  return Button(
    {
      color: "primary",
      style: "position: relative;",
    },
    [
      Icon({ name: "upload" }),
      View("Upload"),
      View({
        tag: "input",
        style:
          "opacity: 0;width: 100%; height: 100%; position:absolute; top:0px;left: 0px",
        name: "file",
        "u-input": true,
        type: "file",
        onChange: `$upload(()=> reload())`,
      }),
    ]
  );
}


export function selectAssetModal() {
  return Modal(
    {
      name: "select-asset",
      $data: { view: "", type: "all" },
      $effect:
        "loader;$post(window.location.origin + '/admin/assets?getSelectableAssets' , {type}).then(res=> view = res.view) ",
    },
    [ModalBody([headSection(), assetsSection()])]
  );
}
