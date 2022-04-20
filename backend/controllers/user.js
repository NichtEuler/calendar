const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
    console.log(req.body.password);
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                username: req.body.username,
                password: hash
            });
            user
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "User created",
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: "User already exists!"
                    });
                });
        });
};
//https://stackoverflow.com/questions/31309759/what-is-secret-key-for-jwt-based-authentication-and-how-to-generate-it

exports.userLogin = (req, res, next) => {
    let fetchedUser;
    console.log(req.body.password);
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                throw new Error('User not found!');
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Invalid Authentication credentials'
                });
            }
            console.log(fetchedUser);
            const token = jwt.sign(
                { email: fetchedUser.email, username: fetchedUser.username, userId: fetchedUser._id },
                process.env.JWT_KEY,
                { expiresIn: "1h" }
            );
            res.status(200).json({
                message: "Logged in sucessfully!",
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id,
                username: fetchedUser.username
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: err.message
            });
        });
};

exports.userName = (req, res, next) => {
    let username;
    console.log("req.params.creatorId" + req.params.creatorId);
    User.findById({ _id: req.params.creatorId })
        .then(user => {
            console.log("test");
            if (!user) {
                throw new Error('User not found!');
            }
            username = user.username;
            console.log(username);
            return res.status(200).json({
                username: username
            })
        }).catch(err => {
            return res.status(401).json({
                message: err.message
            });
        });
};
