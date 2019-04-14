const ctx = require('../../context')
const util = require('util')
//MONGODB PART:
  const MongoClient = require('mongodb').MongoClient;
  const uri = "mongodb+srv://test:test123@cluster0-zsbvg.mongodb.net/test?retryWrites=true";
//END
//API PART:
const PostService = require('./PostService');
//END

const strictStrategy  = async (message, user, intent) => {
    let replies = [];
    console.log("ENTERED STRICT")
    if (intent == "lihatKatalog"){
      try{
        await ctx.setContext(user, "beli");
        itemData = await PostService.getPosts();
        console.log("DATA GOTTEN------------------------");
        console.log(itemData);
        console.log("END----------------------------");
        let obj =  {
          "type": "template", 
          "altText": "this is a carousel template",
          "template": {
            "type": "carousel",
            "actions": [],
            "columns": []
          }
        }

        //parse JSON into obj to modify JSON:
        //let obj = JSON.parse(str);

        //Loop for every items in columns JSON attr. :
        console.log("itemData Length: "+ itemData.length);
        let tempJSON;
        for (i=0; i < itemData.length; i++){
          tempJSON = {
            "thumbnailImageUrl": itemData[i].imageURL,
            "title": itemData[i].title,
            "text": itemData[i].desc,
            "actions": [
              {
                "type": "postback",
                "label": "Beli",
                "data": "action=buy&itemName="+itemData[i].title
              }
            ]
          }

          //tempJSON = JSON.stringify(tempJSON);
          //console.log("<<<<<<<<<<<<TEMP JSON >>>>>>>>>>>>>");
          //console.log(tempJSON);
          obj.template.columns.push(tempJSON);
        }

        // NO NEED : str = JSON.stringify(obj);
        replies = obj;
        console.log("REPLIES------------------------");
        console.log(replies);
        console.log("END----------------------------");
        }
      catch{
        replies = {
          type: "text",
          text: "No items to be shown. Add some first!"
        }
      }
    }
    else if (intent == "help"){
        replies.push({
          type: "text",
          text: "You want menu? \nTYPE: Apa saja produk yang dijual?\n\nYou want to add product? \nTYPE: add item\n\nYou want to update item? \nTYPE: update item\n\nYou want to delete item? \nTYPE: delete item"
        });
        replies.push({
          type: "text",
          text: "You want to show user database? \nTYPE: showdatabase\n\n You want to clear item database?\nTYPE: resetitems"
        });
    }
    else if (intent == "cancel"){
        console.log("Reseted")
        await ctx.setContext(user, "lihatKatalog");
        replies = {
            type: "text",
            text: "Intent Reseted."
          }
    }
    else if (intent == "showdatabase"){
        //show database
        //MONGODB PART:
        const MongoClient = require('mongodb').MongoClient;
        const uri = "mongodb+srv://test:test123@cluster0-zsbvg.mongodb.net/test?retryWrites=true";
        //END
        let dbtest = await MongoClient.connect(uri, {useNewUrlParser: true });
        var dbo = await dbtest.db("mydb");
        let thing = await dbo.collection("userData").find({}).toArray();
        console.log(thing);
        await dbtest.close();
        let temp = "";
        for(let i = 0; i<thing.length; i++){
            temp += thing[i].nama+"\n" +thing[i].noHP +"\n"+ thing[i].produk+"\n\n";
        }
        replies= {
            type: "text",
            text: temp
        };
    }
    else if (intent == "addItem"){
      replies = {
        type: "text",
        text: "Kau akan menambah item. Yakin kau?"
      }
      await ctx.setContext(user, "addItem");
    }
    else if (intent == "deleteItem"){
      replies = {
        type: "text",
        text: "Kau akan menghapus item. Pilih nomor item ke berapa!"
      }
      await ctx.setContext(user, "chooseDelete");
    }
    else if (intent == "updateItem"){
      replies = {
        type: "text",
        text: "Kau akan update item. Pilih nomor item ke berapa!"
      }
      await ctx.setContext(user, "chooseUpdate");
    }
    else if(intent == "resetItems"){
      replies = {
        type: "text",
        text: "item database reseted"
      }
      //delete all
      MongoClient.connect(uri, {useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myquery = {};
        dbo.collection("items").deleteMany(myquery, function(err, obj) {
          if (err) throw err;
          console.log("All items deleted");
          db.close();
        });
      });
    }
    console.log("EXITED STRICT")
    return replies;
}

module.exports = strictStrategy