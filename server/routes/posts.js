const router = require("express").Router();
const Posts = require("../models/posts");
const postsJson = require("../config/posts.json")


/**
 * Router       /apis/posts?limit=5&sort=year,desc&tags=happy,fun,cute
 * Des          get all the posts/ filter,sort, pagination through the api
 * Query        sort={parameter},desc [for descending order. default is ascending] ,
 *              limit={no. of items to show at once},
                {fieldName to filter on}={values(single or multiple - comma separated)}
 * Access       public
 * Method       GET
 **/

router.get("/posts", async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    let sort = req.query.sort || "year";
    let tags = req.query.tags || "All";

    const tagsOptions = [
      "happy",
      "cool",
      "goodDay",
      "chilling",
      "partyMode",
      "travelling",
      "blog",
      "fun",
      "animals",
      "cute",
      "summers",
      "winters",
      "monsoon",
      "friends",
      "vacation"
    ];

    tags === "All"
      ? (tags = [...tagsOptions])
      : (tags = req.query.tags.split(","));
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }

    const posts = await Posts.find({ title: { $regex: search, $options: "i" }})
      .where("tags")
      .in([...tags])
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);
    
    const total = await Posts.countDocuments({
        tags:{$in:[...tags]},
        title:{$regex:search,$options:"i"},
    })

    const response = {
        error:false,
        total,
        page:page+1,
        limit,
        tags:tagsOptions,
        posts,
    }

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

/**
 * Router       /search/{keyword}
 * Des          Search the keyword in title or description
 * Params       keyword
 * Access       public
 * Method       GET
 **/
router.get("/search/:key", async(req,res)=>{

    let data = await Posts.find(
        {
            "$or":[
                {title:{$regex:req.params.key}},
                {description:{$regex:req.params.key}},
            ]
        }
    )
    res.send(data)
    

})

router.post("/",async(req,res)=>{
    try{

        const newPost = await Posts(req.body).save();
        res.status(201).send({data:newPost, message:"post created successfully"})
    }catch(error){
        res.status(500).send({message:"Internal server error"})
    }
})


// api to insert post with image (multiple)

const insertPosts = async() =>{
    try{

        const docs = await Posts.insertMany(postsJson);
        return Promise.resolve(docs);

    }catch(err){

        return Promise.reject(err);

    }
}


// insertPosts().then((docs)=> console.log(docs)).catch((err)=>console.log(err))

module.exports = router;
