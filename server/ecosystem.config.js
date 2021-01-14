module.exports = {
  apps : [{
      name        : "bogdashka-server",
      script      : "./build/src/main.js",
      env_production : {
         "NODE_ENV": "production"
      }
    }]
}