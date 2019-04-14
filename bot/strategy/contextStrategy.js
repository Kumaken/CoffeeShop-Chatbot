const ctx = require('../../context')
const hello = require('../templates/hello')
//MONGODB PART:
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://test:test123@cluster0-zsbvg.mongodb.net/test?retryWrites=true";
//END
//API PART:
const PostService = require('./PostService');
//END

const contextStrategy  = async (context, intent, message, user) => {
  let replies = [];
  console.log("Entered Context");
  let strategies = {

    'chooseDelete': async () => {
      if(intent == "cancel" || message == "no"){
        await ctx.clearContext(user)
        replies = {
          type: "text",
          text: `Intent canceled?`
        }
      }
      else{
        try{
          await PostService.deletePost(message);
          replies.push({
            type: "text",
            text: `Item Deleted.`
          })
        }
        catch(err){
          replies.push({
            type: "text",
            text: `Item number chosen not found! Delete Failed!`
          })
        }
        await ctx.setContext(user, "default");
      }
    },

    'chooseUpdate': async () => {
      if(intent == "cancel" || message == "no"){
        await ctx.clearContext(user)
        replies = {
          type: "text",
          text: `Intent canceled?`
        }
      }
      else{
          await ctx.fillData(user, "itemID", message);
          replies.push({
            type: "text",
            text: `Next up, pick new item title!`
          })
        await ctx.setContext(user, "updateItemTitle");
      }
    },

    'updateItemTitle': async () => {
      if(intent == "cancel" || message == "no"){
        await ctx.clearContext(user)
        replies = {
          type: "text",
          text: `Intent canceled?`
        }
      }
      else{
        await ctx.fillData(user, "itemTitle", message);
        replies.push({
          type: "text",
          text: `Alright, now input the new desc. text for your item!`
        })
        await ctx.setContext(user, "updateItemDesc");
      }
    },

    'updateItemDesc': async () => {  
      if(intent == "cancel" || message == "no"){
        await ctx.clearContext(user)
        replies = {
          type: "text",
          text: `Intent canceled?`
        }
      }
      else{
        await ctx.fillData(user, "itemDesc", message);
        replies.push({
          type: "text",
          text: `Lastly, input the new item image URL!`
        })
        await ctx.setContext(user, "updateItemURL");
      }
    },

    'updateItemURL': async () => {  
      if(intent == "cancel" || message == "no"){
        await ctx.clearContext(user)
        replies = {
          type: "text",
          text: `Intent canceled?`
        }
      }
      else{ 
        await ctx.fillData(user, "itemURL", message);
        await PostService.modifyPost(user, ctx);
        replies.push({
          type: "text",
          text: `Item successfuly updated. Grats.`
        })

        await ctx.setContext(user, "default");
      }
    },

    'addItem': async () => {
      if(intent == "cancel" || message == "no"){
        await ctx.clearContext(user)
        replies = {
          type: "text",
          text: `Intent canceled?`
        }
      }
      else{
        replies.push({
          type: "text",
          text: `Ok then, input item title!`
        })
        await ctx.setContext(user, "getItemTitle");
      }
    },

    'getItemTitle': async () => {
      if(intent == "cancel" || message == "no"){
        await ctx.clearContext(user)
        replies = {
          type: "text",
          text: `Intent canceled?`
        }
      }
      else{
        await ctx.fillData(user, "itemTitle", message);
        replies.push({
          type: "text",
          text: `Alright, now input some desc. text for your item!`
        })
        await ctx.setContext(user, "getItemDesc");
      }
    },

    'getItemDesc': async () => {  
      if(intent == "cancel" || message == "no"){
        await ctx.clearContext(user)
        replies = {
          type: "text",
          text: `Intent canceled?`
        }
      }
      else{
        await ctx.fillData(user, "itemDesc", message);
        replies.push({
          type: "text",
          text: `Lastly, input your item image URL!`
        })
        await ctx.setContext(user, "getItemURL");
      }
    },

    'getItemURL': async () => {  
      if(intent == "cancel" || message == "no"){
        await ctx.clearContext(user)
        replies = {
          type: "text",
          text: `Intent canceled?`
        }
      }
      else{ 
        await ctx.fillData(user, "itemURL", message);
        await PostService.insertPost(user, ctx);
        replies.push({
          type: "text",
          text: `Item successfuly added. Grats.`
        })

        await ctx.setContext(user, "default");
      }
    },

    'lihatKatalog': async () => {

    },

    'beli': async () => {
      if(intent == "cancel" || message == "no"){
        await ctx.clearContext(user)
        replies = {
          type: "text",
          text: `Intent canceled?`
        }
      }
      else{
        replies = {
          type: "text",
          text: `Kau akan didata! Say: OK`
        }
        await ctx.setContext(user, "getUserName");
      }
    },

    'getUserName': async () => {
      replies.push({
        type: "text",
        text: `Mohon memberi data`
      })
      replies.push({
        type: "text",
        text: `BILANG NAMA LO`
      })
      await ctx.setContext(user, "getNoHP");
    },

    'getNoHP': async () => {
      await ctx.fillData(user, "nama", message);
      replies = {
        type: "text",
        text: `Ada Nomor HP?`
      }
      await ctx.setContext(user, "TransactionDone");
    },

    'TransactionDone': async () => {
      await ctx.fillData(user, "noHP", message);
      replies.push({
        type: "text",
        text: "Terimakasih! Data sudah masuk ke database."
      })
      let dbtest = await MongoClient.connect(uri, {useNewUrlParser: true });
      var dbo = await dbtest.db("mydb");
      let name = await ctx.getData(user, "nama");
      let nomor = await ctx.getData(user, "noHP");
      let item = await ctx.getData(user, "item")
      console.log(name + " " + nomor);
      var obj = {nama: name, noHP: nomor, produk: item};
      await dbo.collection("userData").insertOne(obj);
      await dbtest.close();
      console.log("USER DATA IS SAVED");
      await ctx.setContext(user, "default");
    },


    'default': async () => {
      switch (intent) {
        case "lihatKatalog":
          replies = {
            type: "text",
            text: "Welcome! Katalog is coming..."
          }
          await ctx.setContext(user, "lihatKatalog")
          break;
        default:
          replies = await hello(user)
          break;
      }
    }

  };
    
    try {
        await (strategies[context] || strategies['default'])();
    }
    catch(e) {
        console.error(e)
    }
  
    
  return replies;
}

module.exports = contextStrategy
