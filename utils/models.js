export async function initData(ctx) {
    const isBaseExists = await ctx.table('components').get({where: {id: '000'}})
    if(isBaseExists) return;
    
    await ctx.table('components').insert({
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
  