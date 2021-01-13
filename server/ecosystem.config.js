module.exports = {
  apps : [{
      name        : "bogdashka-server",
      script      : "./build/src/main.js",
      instances   : 2,
      exec_mode  : "cluster",
      watch       : true,
      env_production : {
         "NODE_ENV": "production"
      }
    },{
      name       : "cron",
      script     : "./build/src/cron.js",
    }]
    
}