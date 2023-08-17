import { View } from "@ulibs/ui"

export default (props, slot) => {
    return View({d: 'contents', htmlHead: [
        View({tag: 'link', rel: 'stylesheet', href: '/dist/styles.css'}),
        View({tag: 'script', src: '/dist/ulibs.js'}),
    ]}, 
    [slot]
    
    )

}