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
            View({
              tag: 'input',
              m: 0,
              p: 0,
              label: "name",
              "u-model": "name",
            }),
            View({
              tag: 'input',
              m: 0,
              p: 0,
              label: "description",
              "u-model": "description",
            }),
            View({
              tag: 'input',
              m: 0,
              p: 0,
              label: "url",
              "u-model": "url",
            }),
            View({
              tag: 'input',
              m: 0,
              p: 0,
              label: "caption",
              "u-model": "caption",
            }),
            View({
              tag: 'input',
              m: 0,
              p: 0,
              label: "width",
              "u-model": "width",
            }),
            View({
              tag: 'input',
              m: 0,
              p: 0,
              label: "height",
              "u-model": "height",
            }),
            View({
              tag: 'input',
              m: 0,
              p: 0,
              label: "alt",
              "u-model": "alt",
            }),
            View({
              tag: 'input',
              m: 0,
              p: 0,
              label: "type",
              "u-model": "type",
            }),
          ]),
          Row(
            { d: "flex", p: "xxs", style: "justify-content: space-between" },
            [
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
            ]
          ),
        ]),
      ]),
    ]),
  ]);
}

export function Media(props, slots) {
  if (props.mode == 'select'){
    return View(
      {
        ...props,
        onClick: "console.log('selected')",
        style:
          "position: relative;border: 1px solid var(--color-base-400);display: flex; justify-content: center; align-items: centter;cursor: pointer; overflow: hidden;width: 100px; height: 100px",
      },
      [slots]
    );
  }else{
    return View(
      {
        ...props,
        onClick: `$modal.open('options-${props.id}')`,
        m: "xs",
        style: 'position: relative;border: 1px solid var(--color-base-400);display: flex; justify-content: center; align-items: centter;cursor: pointer; overflow: hidden;width: 100px; height: 100px',
      },
      [slots, assetModal(`options-${props.id}`)]
    );
  }
}
export default function() {
  return Col(
    {
      $data: { assets: [], view: "", loader: true, type: "all" },
      $effect: "loader;$post(window.location.origin + '/admin/assets?getAssets' , {type}).then(res=> view = res.view) ",
      // $effect: "loader; " + runAction("getAssets", `{type}`, "view = res.view"),
      style:
        "width: 100%; height: 100%; ;text-align:center",
    },
    [View("Assets"), headSection(), assetsSection()]
  );
}

export function fileUpload(callback){
  return  Button(
    {
      
      style:
        "position: relative;background: var(--color-base-200); color: var(--color-base-800)",
    },
    [
      Icon({ name: "upload" }),
      View('Upload'),
      View({
        tag: "input",
        style:
          "opacity: 0;width: 100%; height: 100%; position:absolute; top:0px;left: 0px",
        name: "file",
        "u-input": true,
        type: "file",
        onChange: `$upload(()=> ${callback()})`,
      }),
      Tooltip({ placement: "right" }, "Upload A File"),
    ]
  )
}

export function typeSelect({
  onChange = (type)=>{console.log('no call back for this type: '+ type)},
  types = ["all", 'image', "video", "audio"]
}) {
  return Dropdown({ style: " display: flex" }, [
      Button({ style: "width: 100%", $text: "type.charAt(0).toUpperCase()+ type.slice(1)" }),
      Tooltip({ placement: "right" }, "Choose A Type"),
      DropdownPanel(
        types.map((type)=>DropdownItem({ onClick: onChange(type) }, type.charAt(0).toUpperCase() + type.slice(1)),)
      ),
    ])
}

export function headSection() {
  return Row({}, [
    Col({ col: 8, px: "sm", pe: 0 }, [
      typeSelect({onChange: (selectedType)=> `type = '${selectedType}'`})
    ]),
    Col({ col: 4, px: "sm",  }, [
      fileUpload(()=>"(loader = !loader)")
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


export function selectionTypeModal(){
  return Modal({name: 'select-file'}, [
    ModalBody([
      Button({onClick: "$modal.open('select-asset')"},'from Assets'),
      fileUpload(()=>'')
    ])
  ])
}


export function selectAssetModal(){
  return Modal({name: 'select-asset', $data: {view: '', type: 'all'} , $effect: "loader;$post(window.location.origin + '/admin/assets?getSelectableAssets' , {type}).then(res=> view = res.view) "},[
    ModalBody([
      headSection(),
      assetsSection()
    ])
  ])
}