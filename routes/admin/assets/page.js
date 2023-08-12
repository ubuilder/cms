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
import { copyFileSync, rmSync} from 'fs'
import { basename } from 'path'

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
      return Media({id: `${asset.id}`},{
        image: View({tag: 'img'  ,src: asset.url, alt: asset.alt, width: '50px'}),
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
export async function getAsset({ ctx, body }) {
  console.log('getasset body' , body)
  if (!body?.id) {
    return { body: { success: false, message: "missing asset id" } };
  }
  const asset = await ctx
    .table("assets")
    .query({ where: { id: body.id } })
    .then((res) => res.data[0]);
  console.log('asset=====>: ', asset)
  const result = updateModal(
    asset,
    {
      image: View({
        tag: "img",
        src: asset.url,
        alt: asset.alt,
        width: "500px",
      }),
      audeo: View({ tag: "audeo", width: "500px" }, [
        View({ tag: "source", src: asset.url }),
        View("View"),
      ]),
      vidio: View({ tag: "video", width: "500px" }, [
        View({ tag: "source", src: asset.url }),
        View("View"),
      ]),
    }[asset.type]
  );

  return {
    body: {
      success: true,
      asset,
      view: result.toString(),
    },
  };
}

export  async function upload({ctx, body, files}){
  const supportedTypes = ['image', 'video', 'audeo']
  const file = files.file
  const path = file.path.split('\\').join("/")
  const type = file.mimetype.split('/')[0]
  if(!supportedTypes.includes(type)){
    throw new Error('Unsupported file format, unable to save this file type: type == '+ type)
  }
  console.log('object:>>>+>>', files, typeof file.path)
  
  //from temp folder to project folder
  copyFileSync(path, `./assets/${type}s/${basename(file.path)}`);
  rmSync(path)
  
    const asset = {
      name: file.name,
      type: file.mimetype.split("/")[0],
      url: `/assets/${type}s/${basename(file.path)}`,
      alt: "image",
      description: "this is image",
      cation: "",
      width: "",
      height: "",
    };
    await ctx.table('assets').insert(asset)
    return {
        body: {success: true},
    }
}

export async function remove({ctx, body, files}){
  const data = await ctx.table('assets').query({where: {id : body.id}}).then(res => res.data)
  await ctx.table('assets').remove(data[0].id)

  rmSync(`.${data[0].url}`)
  return{
    body:{success: true}
  }
}

export async function update({ctx, body, files}){
  console.log('update asest action body: ', body)

  ctx.table('assets').update(body.id, body)
  
  return {
    body: {success: true}
  }
}

function updateModal(props, slots){
  return Modal({ name: "update-modal",$data: props }, [
    ModalBody([
      Row([
        // preview
        Col({},slots),
        //properties
        Col([
          View([
            Input({py: 0, mx: 0, label: "name", $model: 'this.name' }),
            Input({py: 0, mx: 0, label: "description", "u-modal": 'description' }),
            Input({py: 0, mx: 0, label: "url", name: "url" }),
            Input({py: 0, mx: 0, label: "caption", name: "caption" }),
            Input({py: 0, mx: 0, label: "width", name: "width" }),
            Input({py: 0, mx: 0, label: "height", name: "height" }),
            Input({py: 0, mx: 0, label: "alt", name: "alt" }),
            Input({py: 0, mx: 0, label: "type", name: "type" }),
          ]),
          Row([
            //control buttons
            Button({ color: "primary", onClick: "$modal.close()" }, "Close"),
            Button(
              {
                color: "error",
                onClick: runAction(
                  "update",
                  `{id, name, description, url, caption, width, height, alt, type}`,
                  "{$modal.close();loader = !loader}"
                ),
              },
              "Update"
            ),
          ]),
        ]),
      ]),
    ]),
  ]);
}

function Media(props, slots){
  return View(
    {
      ...props,
      onClick: `$modal.open('options-${props.id}')`,
      m: "xs",
      style:
        "border: 2px solid var(--color-primary-400); border-radious : var(--size-sm)",
    },[
      slots,
      assetModal(`options-${props.id}`)
    ]
  );
}
function OffCanvas() {
  return Col(
    {
      $data: { assets: [], view: "", loader: true, type: "all" },
      $effect: "loader; " + runAction("getAssets", `{type}`, "view = res.view"),
      style:
        "width: 300px; height: 100%; background-color: var(--color-base-800); color: var(--color-base-200);text-align:center",
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
              "loader = !loader"
            )})`,
          }),
          Tooltip({ placement: "right" }, "Upload A File"),
        ]
      ),
    ]),
  ]);
}

export function assetsSection() {
  return View({$html: 'view'})
  
}

function assetModal(name){
  return Modal({name}, [
    ModalBody([
      Card({title: 'asset options', style: 'color: var(--color-base-800)'}, [
        CardBody([
          Button({color: 'primary', onClick: '$modal.close()'},'Close'),
          Button({color: 'error', onClick: runAction('remove', `{id: '${name.split('options-')[1]}'}`, 'loader = !loader' )},'Delete'),
          Button({color: 'primary', onClick:runAction ('getAsset',  `{id: '${name.split('options-')[1]}'}`,`{$modal.close(); view += res.view ; setTimeout(()=>$modal.open('update-modal'), 10)}`)},'Update'),
        ]),
      ])
    ])
  ])
}

