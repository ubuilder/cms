import { View, Icon } from "@ulibs/ui";
import { copyFileSync, rmSync } from "fs";
import { basename } from "path";

export async function upload({ ctx, body, files }) {
  console.log("something uploaded", files);
  const supportedTypes = ["image", "video", "audio"];
  const file = files.file;
  const path = file.path.split("\\").join("/");
  const type = file.mimetype.split("/")[0];
  if (!supportedTypes.includes(type)) {
    throw new Error(
      "Unsupported file format, unable to save this file type: type == " + type
    );
  }

  const asset = {
    name: file.name,
    type,

    alt: "this is a " + type,
    description: "this is image",
    caption: "",
    width: "",
    height: "",
  };

  const [id] = await ctx.table("assets").insert(asset);

  //from temp folder to project folder
  copyFileSync(path, `./assets/${id}`);
  rmSync(path);

  await ctx.table("assets").update(id, {
    url: "/assets/" + id,
  });

  return {
    body: { success: true },
  };
}

export async function remove({ ctx, body }) {
  await ctx.table("assets").remove(body.id);

  rmSync(`./assets/${body.id}`);

  return {
    body: { success: true },
  };
}

export async function update({ ctx, body }) {
  const { id, url, ...rest } = body;
  await ctx.table("assets").update(id, rest);

  return {
    body: { success: true },
  };
}
