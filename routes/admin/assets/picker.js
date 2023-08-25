import { Modal, Button, View, Col, ModalBody } from "@ulibs/ui";

export function Picker(){
  return View([
    Button({ onClick: "console.log('hellow assets')" }, "Assets"),
    Button({ onClick: "console.log('hellow upload')" }, "upload"),
    Button({ onClick: "console.log('hellow url')" }, "url"),
  ]);
}

export function assetPickerModal() {
  return Modal({
      name: "asset-picker",
      $data: { view: "" },
      // $effect:
      //   "$post(window.location.origin + '/admin/assets?partial' , {}).then(res=> view = res.view) ",
    },
    ModalBody([
      Col([
        View({$html: 'view'}),
        View({$if: '!view'}, [
          Button({onClick: "$post(window.location.origin + '/admin/assets?partial', {selectable: 'true'}).then(res =>{console.log(res);view = res.html})"}, 'request'),
        ]),
        Button({onClick: '$modal.close()'},'close'),
        Button({onClick: '$modal.close()'},'add')
    ]
    )
    ])
  )
}
