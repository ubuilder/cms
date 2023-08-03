import { Button, FormField } from "@ulibs/ui";
import {Page} from '../../../components/Page.js'

export async function reset_db({ ctx }) {
  await ctx.resetDatabase();
  return {
    body: {
      message: "Database successfully resetted!",
    },
  };
}

export default () => {
  return Page({ title: "General Settings" }, [
    FormField(
      {
        label: "Reset Database",
        description: "You should restart server to take effect",
      },
      [Button({ color: "error", onClick: `$post('?reset-db')` }, "Reset")]
    ),
  ]);
};
