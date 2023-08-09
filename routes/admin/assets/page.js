import {
  View,
  Button,
  Dropdown,
  DropdownPanel,
  DropdownItem,
  Col,
  Row,
} from "@ulibs/ui";
import { runAction } from "../../../utils/ui.js";


export  async function getAssets({ctx, body}){
    const option ={
        perpage: 50,
        where: body?.type? {type : body.type}: undefined
    }
    const assets = await ctx.table('assets').query(option).then(res => res)
    console.log('assets', assets)
    return {
        body: {success: true},
        assets,
    }
}
export  async function upload({ctx, body}){
    const asset = {
        name: '2.jpg',
        type: 'image',
        url: 'assets/images/2.jpg',
        alt: 'image',
        description: 'this is image',
        cation: '',
        width: '',
        height: '',
    }
    await ctx.table('assets').insert(asset)
    return {
        body: {success: true},
    }
}

export default function () {
  return offCanvas(); 
}

function offCanvas() {
  return Col(
    {
      $data: {assets: [], type: 'all'},
      $effect: runAction('getAssets', `{type}`, (res)=>console.log('res', res)),
      style:
        "width: 350px; height: 100%; background-color: var(--color-base-800)",
    },
    [View("Assets"), assetsHeadSection(), assetsSection()]
  );
}
export function assetsHeadSection() {
  return Row([
    Col({col: 8},[
        Dropdown({style: 'flex: 100%'},[
            Button({style: 'width: 100%',$text: 'type'}),
            DropdownPanel([
              DropdownItem({onClick: "type = 'all'", }, "All"),
              DropdownItem({onClick: "type = 'image'"}, "Image"),
              DropdownItem({onClick: "type = 'video'"}, "Video"),
              DropdownItem({onClick: "type = 'audeo'"}, "Audeo"),
            ]),
          ]),
    ]),
    Col({col: 4},[Button({style: 'width: 100%',onClick: runAction('upload', `{}`, ()=>console.log('upload done'))},"upload"),]),
  ]);
}
export function assetsSection() {
  return View([
    View({ tag: "img", widht: "40px", height: "auto", alt: "photo" }),
    View({ tag: "img", widht: "40px", height: "auto", alt: "photo" }),
    View({ tag: "img", widht: "40px", height: "auto", alt: "photo" }),
  ]);
}
