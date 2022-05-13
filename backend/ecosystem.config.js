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
            "PORT": "3000",
            "MONGO_URL": "127.0.0.1",
            "MONGO_DB_NAME": "calendarDatabase",
            "MONGO_PORT": ":27017",
            "MONGO_SRV": ""
        }
    }]
}
