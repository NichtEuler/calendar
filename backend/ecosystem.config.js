module.exports = {
    apps: [{
        name: "express",
        script: "server.js",
        watch: true,
        exec_mode: "cluster",
        env: {
            "MONGO_ATLAS_PW": "QMjnzKYXb856f7B",
            "JWT_KEY": "fjlkaafsjdjfskjfasdsaflkjafdsdsaf",
            "USER": "calendarAdmin",
            "NODE_ENV": "production",
            "PORT": "3000"
        }
    }]
}
