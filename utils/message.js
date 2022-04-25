const moment = require("moment")

function message(user,message){
  return {
      user,
      message,
      time:moment().format('h :mm a')
    }
}

module.exports= message