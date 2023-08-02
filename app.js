// Main entry of project

import { Router } from "@ulibs/router";
import { connect } from "@ulibs/db";
import pages from "./routes/pages/index.js";
import data from "./routes/data/index.js";
import main from "./routes/main.js";
import 'dotenv/config'
import {rename, writeFile} from 'fs/promises'
import { settings } from "./routes/settings/index.js";

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
        client: 'mysql',
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
    },
    dev: {
      // client: 'sqlite3',
      filename: './db.json'
    }
  }
  
  const db = connect(configs[dev ? 'dev': 'dev']);

  async function resetDatabase () {
    if(configs['dev']['filename'] === ':memory:') return;

    await rename(configs['dev']['filename'], configs['dev']['filename'] + '.bak');
    await writeFile(configs['dev']['filename'], '{}')
    db.invalidate()
  }

  const ctx = {
    resetDatabase,
    startServer,
    addPage,
    addLayout,
    addStatic,
    getModel(name) {
      console.log(`do not use getModel("${name}"), instead you can use table("${name}")`)
      return db.getModel(name)
    },
    table(name) {
      return db.getModel(name)
    },
    removeTable,
    createTable,
    updateColumn,
    addColumns,
    removeColumns,
    renameTable,
  };

  return ctx;
}

// if dev mode then create tables
const dev = !!process.env.DEV_MODE;

const ctx = CMS({ dev });

await main(ctx);
await pages(ctx);
await settings(ctx);
await data(ctx);

ctx.startServer(process.env.PORT ?? 3043);
