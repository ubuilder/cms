//all the frontend conponent for this page
import { Page } from "../../../components/Page.js";
import { Filter } from "../../../components/filters/Filter.js";
import { Asset, SelectableAsset } from "./Asset.js";
import { fileUpload } from "./views.js";
import { Icon, Row, View } from "@ulibs/ui";

//actions
export * from './actions.js'



export async function load({ ctx, query , body}) {
  
  console.log("getting assets body", body);
  const option = {
    perPage: 50,
  };
  console.log(query)
  option.where = query.filters ?? {}
 
  console.log(option)
  const assets = await ctx
    .table("assets")
    .query(option)
    .then((res) => res.data);

    console.log(assets)

  // const result = View(
  //   { d: "flex", style: "flex-wrap: wrap" },
  //   assets.map((asset) => {
  //     return Media(
  //       { id: asset.id },
  //       {
  //         image: View({
  //           tag: "img",
  //           style: "width: auto; height: auto; max-height: 100%;",
  //           src: asset.url,
  //           alt: asset.alt,
  //           loading: "lazy",
  //         }),
  //         audio: View(
  //           {
  //             tag: "div",
  //             style:
  //               "display: flex;flex-direction: column;justify-content: space-beetween; width: 100%; height: 100%",
  //           },
  //           [
  //             Icon({ name: "music", size: "xl", p: "md" }),
  //             View(
  //               {
  //                 style: "text-align: center;background: rgba(10,10,10,0.3); ",
  //               },
  //               asset.name
  //             ),
  //           ]
  //         ),
  //         video: [
  //           View({
  //             tag: "video",
  //             style: "width: auto; height: auto; max-height: 100%;",
  //             src: asset.url,
  //           }),
  //           Icon({
  //             name: "video",
  //             size: "xl",
  //             style:
  //               "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -80%)",
  //           }),
  //           View(
  //             {
  //               style:
  //                 "padding-bottom: 3px;background: rgba(10,10,10,0.3);width: 100% ;position: absolute; bottom: 0px ;left: 50%; transform: translate(-50% , 0% ) ",
  //             },
  //             asset.name
  //           ),
  //         ],
  //       }[asset.type]
  //     );
  //   })
  // );

  return {
      assets,
      query
      // view: result.toString(),
  };
}


export default function ({assets, query}) {
  console.log('query: ',query)

  return Page(
    {
      $data: { assets, type: "all" },
      title: "Assets",
      actions: [
        fileUpload(),
      ],
      filters: [
        // typeSelect({ onChange: (selectedType) => `type = '${selectedType}'` })
        Filter({
          type: 'select',
        }),
        Filter({
          type: 'text',
          key: 'name',
          text: 'Name'
        })
      ]
    },
    Row({}, [assets.map((asset) => {
      return query.selectable? 
      SelectableAsset({asset}) : 
      Asset({asset})
      // return Media(
      //   { id: asset.id },
      //   AssetTypes[asset.type]
      // );
    })])
    // assetsSection()
  );
}
