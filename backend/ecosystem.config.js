module.exports = {
    apps: [{
        name: "express",
        script: "server.js",
        watch: true,
        exec_mode: "cluster",
        env: {
            "MONGO_ATLAS_PW": "test",
            "USER": "test",
            "NODE_ENV": "production",
            "PORT": "3000",
            "MONGO_URL": "richi-server",
            "MONGO_DB_NAME": "calendarDatabase",
            "MONGO_PORT": ":27017",
            "MONGO_SRV": ""
        }
    }]
}
