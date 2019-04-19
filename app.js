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

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/public/main.html")
});

app.post("/ajax_send_form", function (req, res) {
  const yourName = req.body.yourName;
  const partnerName = req.body.partnerName;

  unirest.get("https://love-calculator.p.rapidapi.com/getPercentage?fname="+yourName+"&sname="+partnerName)
  .header("X-RapidAPI-Host", "love-calculator.p.rapidapi.com")
  .header("X-RapidAPI-Key", "832f7e1b70msh3824ed4b1a4d2c1p1a506bjsn25e5cbaccf8c")
  .end(function (result) {
    // console.log(result);
    let resultData = {
       'yourName' : result.body.fname,
       'partnerName' : result.body.sname,
       'percentage' : result.body.percentage,
       'resultNum' : result.body.result  
    }
    res.json(resultData);
    // res.send("post reqspone");
    // res.render('love.ejs', {
    //   'yourName' : yourName,
    //   'partnerName' : partnerName,
    //   'percentage' : result.body.percentage,
    //   'resultNum' : result.body.result
    // })
  });


  // res.json(responseData);
})

/*
app.post('/love_post', function(req, res) {
  // get일 경우 : req.param('email') 이런식으로 받을 수 있다고 함
  // console.log(req.body); // post

  const yourName = req.body.yourName;
  const partnerName = req.body.partnerName;

  unirest.get("https://love-calculator.p.rapidapi.com/getPercentage?fname="+yourName+"&sname="+partnerName)
  .header("X-RapidAPI-Host", "love-calculator.p.rapidapi.com")
  .header("X-RapidAPI-Key", "832f7e1b70msh3824ed4b1a4d2c1p1a506bjsn25e5cbaccf8c")
  .end(function (result) {
    // console.log(result.body);
    // res.send("post reqspone");
    res.render('love.ejs', {
      'yourName' : yourName,
      'partnerName' : partnerName,
      'percentage' : result.body.percentage,
      'resultNum' : result.body.result
    })
  });
})
*/


