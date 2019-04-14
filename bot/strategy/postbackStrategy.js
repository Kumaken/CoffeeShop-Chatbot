const ctx = require('../../context')

const postbackStrategy  = async (postback, data, user) => {
  let reply = [];
  let strategies = {
    'buy': async () => {
      let item = data.itemName;
      await ctx.fillData(user, "item", item);
      reply.push({
        type: "text",
        text: `Apakah anda yakin ingin membeli ${item} ?`
      })
    },
    'display': async () => {
      reply = {}
    },
    'default': () => {
      reply = {
        type: "text",
        text: "Maaf, ada kesalahan"
      }
    }
  };
    
  // invoke it
  await (strategies[postback] || strategies['default'])();
    
  // return a String with chosen drink
  return reply;
}

module.exports = postbackStrategy