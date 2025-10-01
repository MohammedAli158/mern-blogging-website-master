import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from "../server/Schema/User.js";
// import Blog from "../server/Schema/Blog.js"
import cors from "cors";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth"
import fs, { access } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js"
import multer from "multer";
import { nanoid } from "nanoid";
import Notification from "../server/Schema/Notification.js"
import Comment from "../server/Schema/Comment.js"
import CommentInterface from "./CommentClass.js";
import Blog from "../server/Schema/Blog.js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AdminSecret = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, process.env.FIREBASE_ADMIN_CRED),
        "utf-8"
    )
);

const server = express();
const PORT = 3000
server.use(express.json());
server.use(cors());
server.listen(PORT, () => {
    console.log("server listening on port->" + PORT);
    console.log(process.env.DB_CONNECTION_STRING);
})

mongoose.connect(process.env.DB_CONNECTION_STRING, {
    autoIndex: true
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/temp");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
    }

});

const upload = multer({ storage });

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

const VerifyJWt = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        return res.status(401).json({ "error": "user does not exist" })
    }
    if (token) {
        const access_token = token
        try {
            const authorized = jwt.verify(access_token, process.env.JWT_ACCESS_TOKEN_SECRET)
            req.user = authorized.id
            next();
        } catch (error) {
            console.log(error.message)
            return res.status(401).json({ "error": "user is not authorized to access this type of request" })
        }

    }
    
}

const generateUsername = async (email) => {
    let username = email.split("@")[0];
    const doesUsernameExist = await User.exists({ "personal_info.username": username })
    doesUsernameExist ? username += `${Math.floor(Math.random() * 5656)}` : username
    const doesUsernameExist5 = await User.exists({ "personal_info.username": username })
    doesUsernameExist ? username += `${Math.floor(Math.random() * 5656)}` : username
    return username;
}
const SendFrontEnd = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRY });


    return {
        access_token,
        username: user.personal_info.username,
        profile_img: user.personal_info.profile_img,
        email: user.personal_info.email
    }
}
server.post('/sign-up', async (req, res) => {
    let { fullname, email, password } = req.body;
    if (!fullname.length > 3) {
        return res.status(403).json({ "error": "full name is too short" })
    }

    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "email is not valid" })
    }
    if (!passwordRegex.test(password)) {
        return res.status(403).json({ "error": "password must contain 6-20 characters, one lowercase one uppercase and " })
    }
    const hashed_password = await bcrypt.hash(password, 11);

    let username = await generateUsername(email);
    const user = new User({
        personal_info: {
            username, fullname, password: hashed_password, email
        }
    })

    user.save().then(u => {

        return res.json(SendFrontEnd(u))

    }).catch(err => {
        if (err.code == 11000) {
            return res.status(500).json({
                "error": "provided email already exist in the database"
            })
        }
        return res.json({ "error": err.message })
    });


    // return res.status(200).json({"status":"okay"});

})
server.post('/sign-in', async (req, res) => {
    let { email, password } = req.body;
    const user = await User.findOne({ "personal_info.email": email }).catch(err => {
        return res.json({ "error": err.message }).status(err.code);
    })
    if (!user) {
        return res.json({ "Error": "provided email is not registered in datbase" })
    }
    if (!user.google_auth) {

        bcrypt.compare(password, user.personal_info.password, (err, result) => {
            if (err) {
                return res.json({
                    "error": "error occured while attempting login"
                })
            }
            if (result) {
                return res.json(SendFrontEnd(user));
            }
            if (!result) {
                return res.json({
                    "error": "password is incorrect"
                })
            }
        })
    }
    // return res.status(200).json({"status":"okay"})
})

const Admin = admin.initializeApp({
    credential: admin.credential.cert(AdminSecret)
}
);

server.post("/google-auth", async (req, res) => {
    const { access_token } = req.body;
    try {
        const decodedUser = await getAuth().verifyIdToken(access_token);
        let { email, name, picture } = decodedUser;
        picture = picture.replace("s-96c", "s-384");

        let user = await User.findOne({ "personal_info.email": email }).select("personal_info.username personal_info.fullname personal_info.email personal_info.profile_img google_auth");

        if (user) {
            if (!user.google_auth) {
                return res.status(403).json({ error: "Email already registered, use password login." });
            }
        } else {
            const username = await generateUsername(email);
            user = new User({
                personal_info: { fullname: name, username, email, profile_img },
                google_auth: true
            });
            await user.save();
        }


        const customToken = jwt.sign(
            { id: user._id },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.JWT_EXPIRY }
        );
        return res.json(SendFrontEnd(user))
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Authentication failed, try another Google account." });
    }
});
server.post('/editor', upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "image", maxCount: 1 },
])
    , async (req, res) => {


        const path = req.files.banner?.[0].path || req.files.image?.[0].path
        const fileBuffer = fs.readFileSync(path);
        const { data, error } = await supabase.storage
            .from('BLOG-EDITOR')
            .upload(req.files.banner?.[0].filename || req.files.image?.[0].filename, fileBuffer, {
                contentType: req.files.banner?.[0].mimetype || req.files.image?.[0].mimetype,
                upsert: false
            });
        if (error) {
            return res.json({ "error": error.message })
        }


        const { data: publicUrlData } = supabase.storage
            .from('BLOG-EDITOR')
            .getPublicUrl(req.files.banner?.[0].filename || req.files.image?.[0].filename);
        return res.json(publicUrlData);

    })

server.post("/create-blog",VerifyJWt , async (req, res) => {
    const authorId = req.user
    const id = req.body?.id
    var { title, des, tags, content, banner, draft } = req.body
    if (id) {
        const blogg = await Blog.findOneAndUpdate({ blog_id: id }, {
            title, des, tags, content, banner, draft: Boolean(draft)
        })
        if (blogg) {
           
            return res.json(blogg
            )
        } else {
            return res.json(blogg)
        }

    } else {
        tags = tags.map(t =>
            t.toLowerCase()
        )

        let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();
        let blog = new Blog({
            title, des, tags, banner, content, author: authorId, blog_id, draft: Boolean(draft)
        })
        var incVal = draft ? 0 : 1

        try {
            const bl = await blog.save();
            const user = await User.findOneAndUpdate({ _id: authorId }, { $inc: { "account_info.total_posts": incVal }, $push: { "blogs": bl._id } })

            return res.json(req.body)
        } catch (error) {
            console.log(error.message)
        }
    }

})
server.post("/get-blogs", async (req, res) => {
    const pageCurrent = req.body?.pageCurrent

    const maxLimit = 5;
    let count;
    try {
        count = await Blog.countDocuments()
        let pageCount = Math.ceil(count / maxLimit)
        const blogs = await Blog.find({ draft: false }).populate("author", "personal_info.fullname personal_info.profile_img personal_info.username -_id").sort({ "publishedAt": -1 }).select("blog_id title des banner activity tags publishedAt -_id").skip((pageCurrent - 1) * maxLimit).limit(maxLimit)
   

        if (blogs) {
            return res.status(200).json({ blogs, pageCount })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error })
    }
})
server.get("/trending-blogs", async (req, res) => {

    try {
        const blogs = await Blog.find({ draft: false }).populate("author", "personal_info.profile_img personal_info.username personal_info.fullname").sort({ "activity.total_likes": -1, "activity.total_reads ": -1, "publishedAt": -1 }).select("blog_id title publishedAt -_id").limit(5)
        if (blogs) {

            return res.status(200).json({ blogs })
        }
        return console.log("Getting failed")
    } catch (error) {
        return res.status(500).json({ error })
    }
})
const escapeRegex = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

server.post("/search-blogs", async (req, res) => {
    const { tag, _id, query, eliminate_blog } = req.body || {};
    const pageCurrent = Math.max(1, parseInt(req.body?.pageCurrent, 10) || 1);
    const maxLimit = 5;

    try {
        const filters = { draft: false };
        const or = [];

        if (query && String(query).trim()) {
            const q = new RegExp(escapeRegex(String(query).trim()), "i");
            or.push({ tags: q });         // matches any element in tags array
            or.push({ title: q });        // optional: search title
            or.push({ des: q });          // optional: search description
        }

        if (tag && String(tag).trim()) {
            or.push({ tags: new RegExp(escapeRegex(String(tag).trim()), "i") });
        }


        if (_id && mongoose.Types.ObjectId.isValid(_id)) {
            or.push({ author: new mongoose.Types.ObjectId(_id) });
        }
        if (eliminate_blog) {
            filters.blog_id = { $ne: eliminate_blog }
        }
        if (or.length) filters.$or = or;



        const count = await Blog.countDocuments(filters);
        const pageCount = Math.ceil(count / maxLimit);

        const blogs = await Blog.find(filters)
            .populate("author", "personal_info.fullname personal_info.profile_img personal_info.username -_id")
            .sort({ publishedAt: -1 })
            .select("blog_id title des banner activity tags publishedAt -_id")
            .skip((pageCurrent - 1) * maxLimit)
            .limit(maxLimit);

        return res.status(200).json({ blogs, pageCount });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || error });
    }
});

server.post("/search-users", async (req, res) => {
    const { query } = req.body;
    try {
        const userArray = await User.find({ "personal_info.username": new RegExp(query + "s?", "i") }).select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
        if (userArray) {
            return res.json({ userArray }).status(200)
        }
    } catch (error) {
        return res.status(500).json({ error })
    }


})
server.post("/get-profile", (req, res, next) => {

    next();
}, async (req, res) => {
    const { Username } = req.body
    try {
        const profile = await User.findOne({ "personal_info.username": Username.trim() }).select("-personal_info.password ").populate({
            path: "blogs",
            match: { "draft": false },
            select: "title des banner",
            options: { sort: { publishedAt: -1 } }
        })

        if (profile) {
            return res.json({ profile })
        }
        return res.status(404).json({ error: "User not found" })
    } catch (error) {
        return res.json(error)
    }



})
server.post("/get-blog-info", async (req, res) => {
    const { blog_id } = req.body;
    const draft = req.body?.draft
    const mode = req.body?.mode || "read"
    const incVal = mode == "edit" ? 0 : 1
    
   
    
    try {
        const bloginfo = await Blog.findOneAndUpdate({ blog_id:blog_id }, {
            $inc: { "activity.total_reads": incVal }
        }).populate("author", "personal_info.fullname personal_info.username personal_info.profile_img").select("title des banner content blog_id tags publishedAt activity _id")
        
        
        if (bloginfo) {
            await User.findOneAndUpdate({ "personal_info.username": bloginfo.author.personal_info.username }, {
                $inc: {
                    "account_info.total_reads": incVal
                }
            })
            
            
            if (bloginfo.draft && !draft) {
                return res.json({ "error": `The requested blog is not a draft blog` })
            }
     
            console.log(bloginfo)

            return res.json(bloginfo)
    }
         else {
           
           

            let bloginfo =  {
                title: 'No title ',
                des: 'No description ',
                content: [],
                tags: [],
                author: { personal_info: { fullname: 'noname ', username: 'noface ', profile_img: ' ' } },
                banner: ' https://www.shutterstock.com/image-illustration/horror-creepy-ward-room-hospital-260nw-1573755883.jpg',
                publishedAt: '2006-03-01T00:00:00.000Z',
                activity: {
                    total_likes: 0,
                    total_reads: 0,
                    total_comments: 0,
                    total_parent_comments: 0
                }
            }
            return res.json(bloginfo)
        }
    } catch (error) {
        return res.json(error)
    }
})
server.post("/like-info",VerifyJWt ,async (req, res) => {
    const user_id = req.user
    const _id = req.body?._id
    const dec = req.body?.dec
    console.log(user_id,"user id",_id,"Blog id")
    
    const notification = await Notification.findOne({blog : _id,user:user_id})
    let like=true,likes;
   
    if (notification) {
       
       
        like = false
        //click->unclick
        if (dec) {
           const a = await Notification.deleteOne({_id:notification._id}) 
      
           const bl= await Blog.findOneAndUpdate({_id : _id},{
             $inc:{
                "activity.total_likes": -1
             }
        },{new:true})
           
            
            likes = bl.activity.total_likes
            return res.json({like:true,likes:bl.activity.total_likes})
        }
       const bl= await Blog.findOneAndUpdate({_id : _id},{
             $inc:{
                "activity.total_likes": 0
             }
        },{new:true})
           
            
            likes = bl.activity.total_likes
            return res.json({like:false,likes:bl.activity.total_likes})

    } 
    
    else{
        //unclick->click
        if (dec=="false") {
          
            
            const updatedLikes = await Blog.findOneAndUpdate({_id : _id},{
                $inc:{
                    "activity.total_likes": 1
                }
            },{new:true})
           
            if (updatedLikes) {
                const notif = new Notification({
                    blog: _id,
                    notification_for : updatedLikes.author,
                    user:user_id,
                    type:"like"
                })
                await notif.save()
               
                return res.json({likes: updatedLikes.activity.total_likes,like:false})
            }
        }

        
        
    }

    likes = await Blog.findOne({_id:_id}).select("activity.total_likes")
        if (likes) {
            
            return res.json({"like":like,"likes":likes.activity.total_likes})
        }
     
})
server.post("/add-comment",VerifyJWt,async(req,res)=>{
    let user_id = req.user
    let {_id,blog_author,comment} = req.body
    let commentObj = new Comment({
        blog_id:_id,blog_author,comment,commented_by:user_id
    })
    const savedComment = await commentObj.save()
    if (savedComment) {
        let Bloga = await Blog.findOneAndUpdate({_id},{$push:{"comments":savedComment._id},$inc:{
            "activity.total_comments":1,"activity.total_parent_comments":1
        }})
            if (Bloga) {
                
                let notification = new Notification({
                    type:"comment",
                    blog:_id,
                    notification_for:blog_author,
                    user:user_id,
                    comment:savedComment._id
                })
                const savedNotification = await notification.save()
                
            }

    }
    return res.json({comment,commentedAt:savedComment.commentedAt,_id:savedComment._id,user_id,children:savedComment.children})
})
server.post("/add-reply",VerifyJWt,async(req,res)=>{
    const user_id = req.user
    const {parent_comment_id , blog_id , blog_author , comment} = req.body
    let replyingTo = parent_comment_id
    //finding parent comment 
    console.log(parent_comment_id,"parent coment id") 
    const temp = await Comment.findOne({_id:parent_comment_id})
   
    const for_user = temp.commented_by
    const reply = new Comment({
        blog_id,blog_author,comment,commented_by:user_id,isReply:true,parent:parent_comment_id
    })
    if (replyingTo) {
        reply.parent = replyingTo
    }
    const savedreply = await reply.save()
    const ParentComment = await Comment.findOneAndUpdate({_id:parent_comment_id},{
        $push:{children:savedreply._id}
    })
    if (ParentComment) {
        const notif = new Notification({
            type:"reply",blog:blog_id,notification_for:for_user,user:user_id,comment:savedreply._id,replied_on_comment:replyingTo
        })
        const notifsaved = await notif.save()
        if (notifsaved) {
            const BlogUpdation = await Blog.findOneAndUpdate({_id:blog_id},{
                $inc:{
                    "activity.total_comments" : 1
                }
            })
        }
    }
    return res.json(savedreply)
})
server.post("/fetch-comments", async(req,res)=>{
   let {blog_id,skip} = req.body;
   
   let maxLimit = 5
   try {
    const resp = await Comment.find({blog_id,isReply:false}).populate("commented_by","personal_info.profile_img personal_info.username personal_info.fullname").skip(skip).limit(maxLimit).sort({
        'commentedAt' : -1
    })
    if (resp) {
        return res.json(resp)
    }
   } catch (error) {
    console.log(error.message)
    return res.json(error)
   }
})
server.post("/fetch-replies",async(req,res)=>{
    let {_id,skip} = req.body
    let maxLimit = 5
   try {
     let comment = await Comment.findOne({_id}).populate({
         path:'children',
         options:{
             limit:maxLimit,
             skip:skip,
             sort:{commentedAt : -1}
         },
        populate:{
         path:'commented_by',
         select:"personal_info.fullname personal_info.username personal_info.profile_img"
        },
        select:"-blog_id -updatedAt"
     })
     if (comment) {
         return res.json(comment.children)
     }
   } catch (error) {
    return res.json(error)
   }
})
const deleteComment = async(commentto)=>{
    const {_id} = commentto
    const late_comment = await Comment.findOneAndDelete({_id})
    if (late_comment) {
        if (commentto.parent) {
            const parent = await Comment.findOneAndUpdate({_id:commentto.parent},{
                $pull:{children:{_id}}
            })
            const notif = await Notification.findOneAndDelete({reply:_id})
        }else{
            const not = await Notification.findOneAndDelete({comment:_id})
        }
        const bblog = await Blog.findOneAndUpdate({_id:late_comment.blog_id},{
            $inc :{
                "activity.total_comments" : -1,"activity.total_parent_comments" : commentto.parent ? 0: -1 
            },$pull:{
                "comments" : commentto._id
            }
        })
        if (late_comment.children.length) {
            for (let index = 0; index < late_comment.children.length; index++) {
               
                deleteComment(late_comment.children[index])
                
            }
        }

    }
}
server.post("/delete-comment",VerifyJWt,async(req,res)=>{
    let user_id = req.user
    let {_id} = req.body
    let commentto = await Comment.findOne({_id})
    if (user_id == commentto?.commented_by || user_id == commentto?.blog_author ) {
        await deleteComment(commentto)
        return res.status(200).json({"status":"okay"})
    }else{
        return res.status(403).json({'error':"you are not allowed to perform this action"})
    }
})