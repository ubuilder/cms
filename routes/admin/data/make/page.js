import { Page } from "../../../../components/Page.js";
import { TableEditor } from "../TableEditor.js";
import { createTable } from "./actions.js";

export function load() {
  return {
    title: "Create Table",
  };
}


export default (props) => {
  return Page({ title: props.title }, [TableEditor({ action: "create" })]);
};
