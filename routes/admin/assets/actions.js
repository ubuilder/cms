import {
    View,
  } from "@ulibs/ui";
import { copyFileSync, rmSync} from 'fs'
import { basename } from 'path'
import {Media, updateModal } from './views.js'

export async function getAssets({ctx, body}){
    console.log('getting assets')
    const option ={
        perpage: 50,
        where: body?.type !== 'all'? {type : body.type}: undefined
    }    
    const assets = await ctx.table('assets').query(option).then(res => res.data)

    const result  = View({d: 'flex', style: 'flex-wrap: wrap'},assets.map(asset=>{
      return Media({id: `${asset.id}`},{
        image: View({tag: 'img'  ,src: asset.url, alt: asset.alt, width: '50px', loading: 'lazy'}),
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
  console.log('get asset, body:' , body)
  if (!body?.id) {
    return { body: { success: false, message: "missing asset id" } };
  }
  const asset = await ctx
    .table("assets")
    .query({ where: { id: body.id } })
    .then((res) => res.data[0]);
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
    console.log('something uploaded')
  const supportedTypes = ['image', 'video', 'audeo']
  const file = files.file
  const path = file.path.split('\\').join("/")
  const type = file.mimetype.split('/')[0]
  if(!supportedTypes.includes(type)){
    throw new Error('Unsupported file format, unable to save this file type: type == '+ type)
  }
  
  //from temp folder to project folder
  copyFileSync(path, `./assets/${type}s/${basename(file.path)}`);
  rmSync(path)
  
    const asset = {
      name: file.name,
      type: file.mimetype.split("/")[0],
      url: `/assets/${type}s/${basename(file.path)}`,
      alt: "image",
      description: "this is image",
      caption: "",
      width: "",
      height: "",
    };
    await ctx.table('assets').insert(asset)
    return {
        body: {success: true},
    }
}

export async function remove({ctx, body, files}){
    console.log('something remove')
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