import hbs from "handlebars";
import { Placeholder } from "./Placeholder.js";
import { Item } from "./Item.js";
import { getInstance } from "./helpers.js";

const baseComponent = {
  id: '000',
  name: 'Base',
  props: []
}

async function renderInstance(ctx, instance) {
  console.log("renderInstance", instance)
      
  const instanceProps = {};

  // for (let propName in instance.props) {
  //   const prop = instance.props[propName];

  // }

  const props = {};
  instance.component.props.map((prop) => {
    props[prop.name] = (instanceProps[prop.name] ?? prop.default_value ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  });

  const hasSlot = true;
  // const hasSlot = template.indexOf("{{slot}}" > -1);

 
  if (hasSlot) {
    const slot = []
    console.log(instance)
    for(let slotId of instance.slot_ids ?? []) {

      const instance2 = await getInstance(ctx, slotId);
      
      instance2.parent = instance;


      const renderedInstance = await renderInstance(ctx, instance2); 

      slot.push(renderedInstance)
    
      // slot.push(await renderInstance(await getInstance(ctx, slotId)))
    }
      
    console.log("slot: ", slot)
    if (slot.length === 0) {
      // slot.push(
      //   Placeholder({ id: instance.id, placement: "slot" }),
      // );
    }
    instance.slot = slot
    // instance.props = {}

    async function renderComponent(component, instanceProps, instanceSlot) {
      console.log("renderComponent", {component, instanceProps, instanceSlot})
      if(component.id === '000') {

        async function evaluateProp(value) {
          if(typeof value !== 'object') return value

          if (value.type === "load") {
            const res = await ctx
              .table(value.table)
              .get({ where: value.where, select: { [value.field]: true } });
      
            return res[value.field];
          } else if(value.type === 'static') {
            return value.value
          }
          return 'todo.. (evaluateProp)'
        }
        
        const props = {};

        let slots = []
        for(let slotItem of instanceSlot) {
          const slot = await renderInstance2(slotItem)
          slotItem.content = slot;

          slots.push(Item({item: slotItem}))
        }

        props.slot = slots.join('')

        for(let prop of component.props) {
          props[prop.name] = await evaluateProp(instanceProps[prop.name] ?? prop.default_value ?? '')
        }

        console.log("SSSSSS: ", {template: props.template ?? '{{{slot}}}', props})
        return hbs.compile(props.template ?? '{{{slot}}}')(props)
      }
      else {
        const slot = await ctx.table("instances").get({where: {id: component.slot_id}, with: {
          component: {
            table: 'components',
            field: 'component_id'
          }
        }})
        console.log({slot, component, id: component.slot_id})

        slot.slot = []
        for(let slotId of slot.slot_ids) {
          slot.slot.push(await ctx.table('instances').get({where: {id: slotId}}))
        }

        return renderComponent(slot.component, slot.props, slot.slot)
        
      }
    }

    async function renderInstance2(instance) {
      if(typeof instance == 'string') return instance;

      const component = instance.component ?? await ctx.table('components').get({where: {id: instance.component_id}})
      const props = instance.props;
      let slot = instance.slot ?? []

      if(slot.length === 0) {
        console.log({instance})
        for(let slotId of instance.slot_ids ?? []) {
          slot.push(await ctx.table('instances').get({where: {id: slotId}}));
        }
      }

      console.log("renderInstance", {instance, component, props, slot})
      return renderComponent(component, props, slot)
    }

    instance.content = await renderInstance2(instance)
  }


  return instance;
}

export default async function load({ ctx, params }) {
    const id = params.id;
  
    const instance = await getInstance(ctx, id);
    // Error handling...

    
    const components = await ctx.table("components").query({ perPage: 100 });
  
   
  
    await renderInstance(ctx, instance)

    // await renderInstance(ctx, instance, props)
  
    const result = {
      title: "TITLE",
      instance,
      components: components.data,
    };

    console.log("load: ", result)
    return result
  }

