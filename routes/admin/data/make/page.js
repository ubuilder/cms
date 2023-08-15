import { Page } from "../../../../components/Page.js";
import { TableEditor } from "../TableEditor.js";
import { createTable } from "./actions.js";

export function load() {
  return {
    title: "Create Table",
  };
}

export async function create({ ctx, body }) {
  await createTable(ctx, body);

  return {
    status: 201,
    body: {
      message: {
        type: "success",
        content: "Table Successfully created!",
      },
      result: true,
    },
  };
}

export default (props) => {
  return Page({ title: props.title }, [TableEditor({ action: "create" })]);
};
