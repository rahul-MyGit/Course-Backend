const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../../03-mongo/db");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    const isExist = await User.exists({username, password});
    if(isExist){
        res.status(403).json({
            msg : "User already exists"
        });
    } else{
        await User.create({
            username,
            password
        })

        res.json({
            msg : "User SignUp successfully"
        });
    }

});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.bodu.username;
    const password = req.body.password;
    
    const isExist = await User.exists({username, password});
    if(isExist){
        const token = jwt.sign({username: username} , JWT_SECRET);
        res.json({
            token : token
        });
    }else{
        res.status(404).json({
            msg : " User not Exists"
        });
    }
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const response = await Course.find({});
    res.json({
        courses : response
    });
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const username = req.username;
    const courseId = req.params.courseId;
    
    await User.updateOne({
        username : username
    },{
        "$push" :  {
            purchasedCourse : courseId
        }       
    });

    res.json({
        msg : "Course Added SuccessFully",
        course : courseId
    });
});

router.get('/purchasedCourses', userMiddleware,async (req, res) => {
    // Implement fetching purchased courses logic

    const user = await User.find({
        username : req.username
    });

    const courses = await Course.find({
        _id : {
             "$in" : user.purchasedCourse
        }
    });

    res.json({
        courses : courses
    });
});

module.exports = router