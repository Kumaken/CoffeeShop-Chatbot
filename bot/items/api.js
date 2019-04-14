const express = require('express');
const mongodb = require('mongodb');
const restify = require('restify');
const uri = "mongodb+srv://test:test123@cluster0-zsbvg.mongodb.net/test?retryWrites=true";

//Debugger:
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//setup router:
const router = express.Router();

//Get Posts
router.get('/', async (req,res)=>{
    console.log("Loading post colleciton...")
    let posts = await loadPostsCollection();
    posts = await posts.find({}).toArray();
    console.log(posts);
    //await sleep(20000);
    res.send(posts);
});

//Add Posts
router.post('/', async(req,res)=> {
    console.log("Loading post collection.");
    const posts = await loadPostsCollection();
    console.log("Adding item...");
    await posts.insertOne({
        title: req.body.title,
        desc: req.body.desc,
        imageURL: req.body.imageURL
    });
    res.status(201).send();
    console.log("Add items succeeded.")
});

//Delete Posts
router.delete('/:id', async(req,res) =>{
    const posts = await loadPostsCollection();
    await posts.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});

//PUT:
router.put('/:id',  async(req,res) =>{
    console.log(req);
    const posts = await loadPostsCollection();
    await posts.updateOne({_id: new mongodb.ObjectID(req.params.id)}, 
        {$set:{'title': req.body.nTitle, 'desc': req.body.nDesc, 'thumbnailImageUrl': req.body.nURL}});
    res.status(200).send();
});

async function loadPostsCollection() {
    const client = await mongodb.MongoClient.connect(uri, {useNewUrlParser: true });
    return client.db('mydb').collection('items');
    }
module.exports = router;