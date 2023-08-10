// Main entry of project

import { Router } from "@ulibs/router";
import { connect } from "@ulibs/db";
import "dotenv/config";
import { rename, writeFile } from "fs/promises";
import { fileBasedRouting } from "./utils/routing.js";

export function CMS({
  dev = false,

  filename = ":memory:",
  client = "sqlite3",
} = {}) {
  const { startServer, addPage, addLayout, addStatic } = Router({
    dev,
    reloadTimeout: 1000,
  });

  const configs = {
    production: {
      client: "mysql",
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
    },
    dev: {
      // client: 'sqlite3',
      filename: "./db.json",
    },
  };

  const db = connect(configs[dev ? "dev" : "dev"]);

  async function resetDatabase() {
    if (configs["dev"]["filename"] === ":memory:") return;

    await rename(
      configs["dev"]["filename"],
      configs["dev"]["filename"] + ".bak"
    );
    await writeFile(configs["dev"]["filename"], "{}");
    db.invalidate();
  }

  const ctx = {
    resetDatabase,
    startServer,
    addPage,
    addLayout,
    addStatic,
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

const ctx = CMS({ dev });

ctx.addStatic({ path: "./node_modules/@ulibs/ui/dist", prefix: "/dist" });
ctx.addStatic({ path: "./public", prefix: "/assets" });

await fileBasedRouting({
  path: "./routes",
  addPage: ctx.addPage,
  addLayout: ctx.addLayout,
  ctx,
});

ctx.startServer(process.env.PORT ?? 3043);
