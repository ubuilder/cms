import {
  View,
  Button,
  Dropdown,
  DropdownPanel,
  DropdownItem,
  Col,
  Row,
  Form, 
  Input,
} from "@ulibs/ui";
import { runAction } from "../../../utils/ui.js";
import { copyFileSync, rmSync, cpSync, renameSync, copyFile, cp, } from 'fs'
import { basename, extname, resolve, join } from 'path'
import { pathToFileURL } from "url";


export default function () {
  return OffCanvas(); 
}

export  async function getAssets({ctx, body}){
    const option ={
        perpage: 50,
        where: body?.type !== 'all'? {type : body.type}: undefined
    }    
    const assets = await ctx.table('assets').query(option).then(res => res.data)

    const result  = View({d: 'flex'},assets.map(asset=>{
      return Media({
        image: View({tag: 'img',src: asset.url, alt: asset.alt, width: '50px'}),
        audeo: View({tag: 'audeo', width: '50px' }, [View({tag: 'source', src: asset.url}), View('View')]),
        vidio: View({tag: 'video', width: '50px' }, [View({tag: 'source', src: asset.url}), View('View')]),
      }[asset.type]
    )}))

    return {
      body: {
        success: true,
        assets,
        view: result.toString(),
      },
    };
}

export  async function upload({ctx, body, files}){
  const file = files.file
  console.log('object:>>>+>>', files, typeof file.path)
  
  
  
  
  if(file.mimetype.startsWith('image')){
    copyFileSync(file.path.split('\\').join("/"), `./assets/images/${basename(file.path)}`)
  }else if(file.mimetype.startsWith('video')){
    copyFileSync(file.path.split('\\').join("/"), `./assets/videos/${basename(file.path)}`)
  }else if(file.mimetype.startsWith('audeos')){
    copyFileSync(file.path.split('\\').join("/"), `./assets/audeos/${basename(file.path)}`)
  }else{
    throw new Error('This File type is not supported: ', files.file.mimetype)
  }
  rmSync(file.path.split('\\').join("/"))
  
    const asset = {
        name: file.name,
        type: file.mimetype.split('/')[0],
        url: `/assets/images/${basename(file.path)}`,
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

function Media(slot){
  return View({m: 'xs', style: 'border: 2px solid var(--color-primary-400); border-radious : var(--size-sm)' },slot)
}

function OffCanvas() {
  return Col(
    {
      $data: {assets: [],view: '', type: 'all'},
      $effect: runAction('getAssets', `{type}`,"view = res.view" ),
      style:
        "width: 350px; height: 100%; background-color: var(--color-base-800); color: var(--color-base-200);text-align:center",
      script: function greating(View){return View('hellow')},
    },
    [View("Assets"), headSection(), assetsSection()]
  );
}

export function headSection() {
  return Row([
    Col({col: 8},[
        Dropdown({style: 'flex-grow: 1'},[
            Button({style: 'width: 100%',$text: 'type'}),
            DropdownPanel([
              DropdownItem({onClick: "type = 'all'", }, "All"),
              DropdownItem({onClick: "type = 'image'"}, "Image"),
              DropdownItem({onClick: "type = 'video'"}, "Video"),
              DropdownItem({onClick: "type = 'audeo'"}, "Audeo"),
            ]),
          ]),
    ]),
    Col({col: 4, $data: { file: ''}},[
      Input({type: "file", onChange: "$upload", name: 'file', multiple: true, label: 'choose file'}),
    ]),
  ]);
}


export function assetsSection() {
  return View({$html: 'view'})
  
}
