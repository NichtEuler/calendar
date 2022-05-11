module.exports = {
    apps: [
        {
            name: "express",
            script: "./server.js",
            watch: true,
            env_production: {
                "MONGO_ATLAS_PW": "QMjnzKYXb856f7B",
                "JWT_KEY": "fjlkaafsjdjfskjfasdsaflkjafdsdsaf",
                "USER": "calendarAdmin",
                "NODE_ENV": "production"
            }
        }
    ]
}
