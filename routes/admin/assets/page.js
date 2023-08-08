import { View,Row, Dropdown,Icon , Button , DropdownPanel, DropdownItem, Col} from "@ulibs/ui"
import { IconPicker } from "../../../components/IconPicker.js";
import { runAction } from "../../../utils/ui.js";



 export async function load({ctx, body}){
  console.log('loading')
  const assets = await ctx.table('assets')
  .query({perpage: 50})
  .then(res => res.data)
  return{
    assets
  }
}

export async function getAssets({body, ctx}){
  const option = {perPage: 50}
  body?.type !=='all'? option['where'] = {type : body.type}: ''
  const assets = await ctx.table('assets')
  .query({}) 
  .then(res => res.data)
  return{
    body: {
      success: true,
      assets,
    },
  };
}

export async function upload({ctx, body}){
  console.log('handleing uploaded file body: =>>>', body)
  const asset = await ctx.table('assets')
  .insert({name: '5.jpg', type: 'image', url: 'assets/images/5.jpg', })
  return{
    body: {
      success: true
    }
  }
}



export default function({assets}){
  
  return offCanvas({ $data: {assets: []}, }, [
    headSection(),
    View({$text: 'assets'}),
    Col({for: 'assete in assets'},[
      Row({tag: 'img', src:'asset.url', atl: 'asset.name'})
    ])
  ]);
}
function assetBuilder(assets){
  return 'hellow world'
  // return assets.reduce((p, c, i)=>p+c.url,'')

}




function offCanvas(props, slots){
    return View(
      {
        style:"position: relative;top: 0;left: 0;width: 300px;height: 100%;background-color: var(--color-base-900); color: var(--color-base-200)",
        ...props,
      },
      [
        View({style: "text-align:center; "},'assets')
        ,slots]
    );
}

function headSection(){
  return Row({$data : { type: "all"}, $effect: runAction('getAssets', `{type}`, "assets = res.assets")}, [
    Dropdown([
      Button({$text: 'type'}),
      DropdownPanel([
        DropdownItem({onClick:"type = 'all'"},'All'),
        DropdownItem({onClick:"type = 'image'" },'Images'),
        DropdownItem({onClick:"type = 'video'" },'Video'),
        DropdownItem({onClick:"type = 'audeo'", },'Audeo'),
      ]),
    ]),
    Button({onClick: runAction('upload', "{body: 'body'}",  console.log('load run')) },[Icon('upload'), 'Upload'])
  ])
}
