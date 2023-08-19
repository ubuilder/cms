// Main entry of project

import { Router } from "@ulibs/router";
import { connect } from "@ulibs/db";
import "dotenv/config";
import { rename, writeFile } from "fs/promises";
import { fileBasedRouting } from "./utils/routing.js";

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

await fileBasedRouting({
  path: "./routes",
  addPage: ctx.addPage,
  addLayout: ctx.addLayout,
  ctx,
});

ctx.startServer(process.env.PORT ?? 3043);

// ctx.build('./dist')