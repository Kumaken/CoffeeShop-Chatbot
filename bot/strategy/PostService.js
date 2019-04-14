//API PART:
  //dont use import becoz this module is exported as func.
  const axios = require('axios');
  const url = '/api/';
  const mongodb = require('mongodb');
  const uri = "mongodb+srv://test:test123@cluster0-zsbvg.mongodb.net/test?retryWrites=true";


  class PostService {
    // Get Posts
    static getPosts() {
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(url);
                const data = res.data;
                resolve(
                    data.map(post => ({
                        ...post
                    }))
                );
            } catch(err) {
                reject(err); 
            }
        })
    }
    // Create Posts
    static async insertPost(user, ctx){
        let _title = await ctx.getData(user, "itemTitle");
        let _desc = await ctx.getData(user, "itemDesc");
        let _URL = await ctx.getData(user, "itemURL");
        //console.log(_URL);
        console.log("Components added to be saved.");
        await axios.post(url, {
          title: _title, 
          desc: _desc,
          imageURL: _URL
        });
        console.log("DONE AXIOS");
    }
    // Delete Posts
    static async deletePost(index) {
        const client = await mongodb.MongoClient.connect(uri, {useNewUrlParser: true });
        let arr = await client.db('mydb').collection('items').find({}).toArray();
        console.log(arr[index-1]);
        let id = arr[index-1]._id;
        return axios.delete(`${url}${id}`);
    }

    //Update Posts
    static async modifyPost(user,ctx) {
        let index = await ctx.getData(user, "itemID");
        let _nTitle = await ctx.getData(user, "itemTitle");
        let _nDesc = await ctx.getData(user, "itemDesc");
        let _nURL = await ctx.getData(user, "itemURL");

        const client = await mongodb.MongoClient.connect(uri, {useNewUrlParser: true });
        let arr = await client.db('mydb').collection('items').find({}).toArray();
        console.log(arr[index-1]);
        let id = arr[index-1]._id;
        return axios.put(`${url}${id}`, {
            nTitle : _nTitle,
            nDesc : _nDesc,
            nURL : _nURL
        });
    }
  }

module.exports = PostService
//END