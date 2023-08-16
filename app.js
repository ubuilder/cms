// Main entry of project

import { Router } from "@ulibs/router";
import { connect } from "@ulibs/db";
import "dotenv/config";
import { rename, writeFile } from "fs/promises";
import { fileBasedRouting } from "./utils/routing.js";
import { Components, initModels } from "./models.js";

export function CMS({
  dev = false,
  filename = ":memory:",
} = {}) {
  const { startServer, addPage, addLayout, addStatic, build } = Router({
    dev,
    reloadTimeout: 1000,
  });

  const db = connect({
    filename
  });

  async function resetDatabase() {
    if (filename === ":memory:") return;

    await rename(
      filename,
      filename + ".bak"
    );
    await writeFile(filename, "{}");
    db.invalidate();
  }

  const ctx = {
    resetDatabase,
    startServer,
    addPage,
    addLayout,
    addStatic,
    build,
    getModel(name) {
      console.log(
        `do not use getModel("${name}"), instead you can use table("${name}")`
      );
      return db.getModel(name);
    },
    table(name) {
      return db.getModel(name);
    },
  };

  return ctx;
}

const dev = !!process.env.DEV_MODE;

const ctx = CMS({ dev, filename: process.env.DB_FILENAME ?? "./db/app.json" });

ctx.addStatic({ path: "./node_modules/@ulibs/ui/dist", prefix: "/dist" });
ctx.addStatic({ path: "./", prefix: "/assets" });
ctx.addStatic({ path: "./public", prefix: "/res" });

initModels(ctx);

async function initData() {
  const isBaseExists = await Components.get({where: {id: '000'}})
  if(isBaseExists) return;
  
  await Components.insert({
    id: "000",
    name: "Base",
    props: [
      {
        name: "template",
        type: "code",
        default_value: "<div>{{{slot}}}</div>",
      }
    ],
  });
}

await initData();

await fileBasedRouting({
  path: "./routes",
  addPage: ctx.addPage,
  addLayout: ctx.addLayout,
  ctx,
});

ctx.startServer(process.env.PORT ?? 3043);

// ctx.build('./dist')