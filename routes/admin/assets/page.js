import {
  View,
  Button,
  Dropdown,
  DropdownPanel,
  DropdownItem,
  Col,
  Row,
  Icon,
  Tooltip
} from "@ulibs/ui";
import { runAction } from "../../../utils/ui.js";
import { copyFileSync, rmSync, cpSync, renameSync, copyFile, cp, } from 'fs'
import { basename, extname, resolve, join } from 'path'

export default function () {
  return OffCanvas(); 
}

export  async function getAssets({ctx, body}){
    const option ={
        perpage: 50,
        where: body?.type !== 'all'? {type : body.type}: undefined
    }    
    const assets = await ctx.table('assets').query(option).then(res => res.data)

    const result  = View({d: 'flex', style: 'flex-wrap: wrap'},assets.map(asset=>{
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
  const path = file.path.split('\\').join("/")
  console.log('object:>>>+>>', files, typeof file.path)
  
  if(file.mimetype.startsWith('image')){
    copyFileSync(path, `./assets/images/${basename(file.path)}`)
  }else if(file.mimetype.startsWith('video')){
    copyFileSync(path, `./assets/videos/${basename(file.path)}`)
  }else if(file.mimetype.startsWith('audeos')){
    copyFileSync(path, `./assets/audeos/${basename(file.path)}`)
  }else{
    throw new Error('This File type is not supported: ', files.file.mimetype)
  }
  rmSync(path)
  
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
            onChange: `$upload(()=>${runAction(
              "getAssets",
              `{type}`,
              "view = res.view"
            )})`,
          }),
          Tooltip({ placement: "right" }, "Upload A File"),
        ]
      ),
      // Input({type: "file", onChange: `$upload(()=>${runAction('getAssets', `{type}`,'view = res.view')})`,style : 'background: var(--color-base-800)' ,name: 'file', multiple: true, label: 'Upload'}),
    ]),
  ]);
}


export function assetsSection() {
  return View({$html: 'view'})
  
}
