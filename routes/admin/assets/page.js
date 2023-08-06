import { View, Dropdown } from "@ulibs/ui"
import { IconPicker } from "../../../components/IconPicker.js";


export function load(){

}

export default function(){
  return offCanvas({}, [
    Dropdown()
  ]);
}


function offCanvas(props, slots){
    return View(
      {
        style:"position: relative;top: 0;left: 0;width: 300px;height: 100%;background-color: var(--color-base-900); color: var(--color-base-200)",
        ...props
      },
      [
        View({style: "text-align:center; "},'assets')
        ,slots]
    );
}