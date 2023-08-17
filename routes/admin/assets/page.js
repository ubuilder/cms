//all the frontend conponent for this page
import { Page } from "../../../components/Page.js";
import { typeSelect, fileUpload, assetsSection } from "./views.js";

//actions
export * from './actions.js'

export default function () {

  return Page({ 
    $data: { assets: [], view: "", loader: true, type: "all" },
    $effect: "loader;$post(window.location.origin + '/admin/assets?getAssets' , {type}).then(res=> view = res.view) ",
    title: 'Assets', 
    actions: [
      typeSelect({onChange: (selectedType)=> `type = '${selectedType}'`}),
      fileUpload(()=>"(loader = !loader)")
    ]},
    assetsSection()
  );
}
