module.exports = {
  apps : [{
      name        : "bogdashka-server",
      script      : "./build/src/io.js",
      env_production : {
         "NODE_ENV": "production"
      }
    }]
}