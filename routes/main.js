export default function main(ctx) {

    ctx.addLayout('/', {
        component: (props, slots) => {
            return ['<html><head><link rel="stylesheet" href="https://unpkg.com/@ulibs/ui@next/dist/styles.css" /><script src="https://unpkg.com/@ulibs/ui@next/dist/ulibs.js"></script></head><body>LAYOUT <a href="/data">Data</a> | <a href="/pages">Pages</a> | <a href="/">Main</a><br/>', slots, '</body></html>'].join('')
        }
    })

    ctx.addPage('/', {
        page: 'Dashboard'
    })
    

}