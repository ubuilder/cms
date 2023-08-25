document.addEventListener('alpine:init', (e)=>{
    Alpine.directive('asset', (el)=>{
        Window._imageInstance = el.parentElement.getAttribute('id').split('-')[1]
        el.innerHTML = `
        <button u-on:click = "$modal.open('asset-picker')">From Assets</button>
        <button u-on:click = "console.log('url')">from url</button>
        `
    })
})