const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
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

exports.editUser = (req, res, next) => {
    let fetchedUser;
    User.findById({ _id: req.body.userId })
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
            let password;
            if (req.body.newpassword) {
                password = bcrypt.hashSync(req.body.newpassword, 10);

            } else {
                password = fetchedUser.password;
            }
            let editedUser = new User({
                _id: req.body.userId,
                email: req.body.email,
                password: password
            });
            if (req.body.username) {
                editedUser.username = req.body.username;

            }

            User.updateOne({ _id: req.body.userId }, editedUser).then(result => {
                if (result.matchedCount > 0) {
                    res.status(200).json({ message: "User sucessfully edited!" });
                }
                else {
                    res.status(401).json({ message: "You are not Authorized!" });
                }
            }).catch(error => {
                res.status(500).json(
                    { message: "Editing user failed!" }
                )
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: err.message
            });
        });
};


//https://stackoverflow.com/questions/31309759/what-is-secret-key-for-jwt-based-authentication-and-how-to-generate-it

exports.userLogin = (req, res, next) => {
    let fetchedUser;
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

exports.findUserName = (req, res, next) => {
    let username;
    User.findById({ _id: req.params.creatorId })
        .then(user => {
            if (!user) {
                throw new Error('User not found!');
            }
            username = user.username;
            (username);
            return res.status(200).json({
                username: username
            })
        }).catch(err => {
            return res.status(401).json({
                message: err.message
            });
        });
};
