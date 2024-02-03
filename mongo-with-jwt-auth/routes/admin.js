const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    const isUserEsixt = await Admin.exists({username : username});
    if(isUserEsixt){
        res.status(404).json({
            msg : " User Already Exists"
        });
    }else{
        await Admin.create({
            username,
            password
        })
        res.json({
        msg : " New Admin created sucessfully"
        });
    }

});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    const isUserExist = await Admin.exists({username, password});
    if(isUserExist){
        const token = jwt.sign({username}, JWT_SECRET);
        res.json({
            token : token
        });
    } else{
        res.status(411).json({
            msg : "Incorrect Email and Pass"
        });
    }

});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;
    
    const course = await Course.create({
        title,
        description,
        imageLink,
        price
    })

    res.send("Course Added Successfully");
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const response = await Course.find({});
    res.json({
        courses : response
    });
});

module.exports = router;