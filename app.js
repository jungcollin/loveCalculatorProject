const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const unirest = require('unirest');

app.listen(3000, function () {
  console.log("start !!! express server on port 3000~");
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('vie engine', 'ejs');

// router
app.get('/', function(req, res) {
  res.sendFile(__dirname + "/public/main.html")
});

// AJAX 요청받았을때 처리
app.post("/ajax_send_form", function (req, res) {
  const yourName = req.body.yourName;
  const partnerName = req.body.partnerName;

  unirest.get("https://love-calculator.p.rapidapi.com/getPercentage?fname="+yourName+"&sname="+partnerName)
  .header("X-RapidAPI-Host", "love-calculator.p.rapidapi.com")
  .header("X-RapidAPI-Key", "832f7e1b70msh3824ed4b1a4d2c1p1a506bjsn25e5cbaccf8c")
  .end(function (result) {
    
    // API로 응답받은 데이터 가공하기
    let resultData = {
       'yourName' : result.body.fname,
       'partnerName' : result.body.sname,
       'percentage' : result.body.percentage,
       'resultNum' : result.body.result  
    }

    // AJAX 응답하기
    res.json(resultData);
  });
});
