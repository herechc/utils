 /*计算今年还剩多少天多少小时多少分多少秒*/
 setInterval(function() {
  var now = new Date()
  var year = now.getFullYear()
  var date = now.getDate()
  var month = now.getMonth() + 1
  var hour = now.getHours()
  var minutes = now.getMinutes();
  var seconds = now.getSeconds()
  var Dates = Hours = Minutes = Seconds = 0;
  for(var i = month; i < 13; i++){
    var Ds = (new Date(year,month,0)).getDate();
    Dates += Ds;
  }
  Dates -= date;
  Hours = 24 - hour;
  Minutes = 60 - minutes;
  Seconds = 60 - seconds
  var result = '今年还剩'+Dates+'天'+Hours+'小时'+Minutes+'分'+Seconds+'秒'
}, 1000);
