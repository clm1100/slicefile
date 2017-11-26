var express = require('express');
var router = express.Router();
var path = require('path')
var multer = require('multer');
var fs = require('fs');
const formidable = require('formidable')
const concat = require('concat-files')
const opn = require('opn')

let uploadDir = './public/uploads'


/*此处的地址相对于app.js,可应用path模块控制路径或者直接用 ./public/m */
var upload = multer({
  dest: path.join(__dirname, '..', '/public/m')
});


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});


router.post('/upload1', upload.single('abc'), function (req, res, next) {
  // res.send(req.body.abc)
  res.send(req.file);
})





router.post('/upload2', function (req, res, next) {
  var form = new formidable.IncomingForm({
    uploadDir: uploadDir
  });

  form.parse(req, function (err, fields, file) {
    console.log(fields);
    console.log(file);
    let imgname = fields.imgname;
    let imgorder = fields.imgorder;
    let imgpath = path.join(__dirname,'..','public/uploads',imgname);
    if (fs.existsSync(imgpath)) {
      fs.readFile(file.img.path, function (err, data) {
        fs.writeFile(path.join(imgpath, imgorder), data, (err) => {
          if (!err) {
            res.send("写入后面的文件")
          }
        })
      })
    } else {
      fs.mkdirSync(imgpath);
      fs.readFile(file.img.path, function (err, data) {
        fs.writeFile(path.join(imgpath, imgorder), data, (err) => {
          if (!err) {
            res.send("第一次写入并新建文件夹")
          }
        })
      })
    }

    // res.send("ok")
  })
})




router.post('/upload', upload.single('abc'), function (req, res, next) {
  var guid = req.body.guid;
  var imgpath = path.join(__dirname, '..', 'public/m', guid);
  var imgName = guid + req.body.chunk;
  console.log(imgpath, imgName)
  if (fs.existsSync(imgpath)) {
    fs.readFile(req.file.path, function (err, data) {
      fs.writeFile(path.join(imgpath, imgName), data, (err) => {
        if (!err) {
          res.send("写入后面的文件")
        }
      })
    })
  } else {
    fs.mkdirSync(imgpath);
    fs.readFile(req.file.path, function (err, data) {
      console.log("---------------------------")
      console.log(err, 9999999999999);
      console.log(imgpath);
      console.log("-----------------------------------")
      console.log(imgName);
      console.log(path.join(imgpath, imgName));
      fs.writeFile(path.join(imgpath, imgName), data, (err) => {
        if (!err) {
          res.send("建立完文件夹并写入第一个文件")
        }
      })
    })
  }

})
module.exports = router;