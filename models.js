export let Components;
export let Pages;
export let Instances;

export {id} from '@ulibs/db'

export function initModels(ctx) {
    Components = ctx.table('components');
    Pages = ctx.table('pages');
    Instances = ctx.table('instances');
}