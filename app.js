// Main entry of project

import {Router} from '@ulibs/router';
import {connect} from '@ulibs/db'
import pages from './routes/pages.js';
import data from './routes/data/index.js';
import main from './routes/main.js';


export function CMS({dev = false, filename = ':memory:', client = 'sqlite3'} = {}) {
    const {startServer, addPage, addLayout} = Router({dev, reloadTimeout: 1000})
    const {createTable, removeTable, getModel, updateColumn, addColumn, removeColumn, renameTable} = connect({client, filename})


    const ctx = {
        startServer, 
        addPage, 
        addLayout, 
        getModel, 
        removeTable, 
        createTable,
        updateColumn,
        addColumn, 
        removeColumn, 
        renameTable
    }

    return ctx
}

// if dev mode then create tables
const dev = !!process.env.DEV_MODE   

const ctx = CMS({ dev })

main(ctx)
pages(ctx)
data(ctx)

ctx.startServer(process.env.PORT ?? 3043);
