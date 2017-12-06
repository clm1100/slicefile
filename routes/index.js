var express = require('express');
var router = express.Router();
var path = require('path')
var multer = require('multer');
var fs = require('fs');
const formidable = require('formidable')
const concat = require('concat-files')
const opn = require('opn')
const md5 = require('md5');
const SparkMD5 = require("spark-md5");

var crypto = require('crypto');


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


// 接收切片信息接口
router.post('/upload3', upload.single('file'), function (req, res, next) {
  console.log(req.body)
  // 接受图片唯一标识符号
    let imgname = req.body.uuidfolder;
    // 接受切片索引
    let imgorder = req.body.imgorder;
    // 建立图片存储目录
    let imgpath = path.join(__dirname,'..','public/mult',imgname);
    // 判断目录是否存在，存在的话直接使用并存储切片，不存在的话就新建。
    if (fs.existsSync(imgpath)) {
      fs.readFile(req.file.path, function (err, data) {
        fs.writeFile(path.join(imgpath, imgorder), data, (err) => {
          if (!err) {
            res.send("写入后面的文件")
          }
        })
      })
    } else {
      fs.mkdirSync(imgpath);
      fs.readFile(req.file.path, function (err, data) {
        fs.writeFile(path.join(imgpath, imgorder), data, (err) => {
          if (!err) {
            res.send("第一次写入并新建文件夹")
          }
        })
      })
    }
})


// 合并图片接口：
router.post('/merge',function(req,res){
  let id = req.body.id;
  let folderpath = path.join(__dirname,"..",'public/mult',id);
  let destinpath = path.join(__dirname,"..",'public/img',id+'.jpg');
  let dist = '/img/'+id+'.jpg'
  fs.readdir(folderpath,function(err,arr){
    let arr2 = arr.map(e=>path.join(folderpath,e));
    concat(arr2, destinpath, function(err) {
      if (err) throw err
      res.send(dist);
    });
  })
})




router.post('/upload2', function (req, res, next) {
  var form = new formidable.IncomingForm({
    uploadDir: uploadDir
  });

  form.parse(req, function (err, fields, file) {
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

// 合并图片接口,配合uploader2：
router.post('/merge2',function(req,res){
  let id = req.body.id;
  let spark = req.body.spark;
  let folderpath = path.join(__dirname,"..",'public/uploads',id);
  let destinpath = path.join(__dirname,"..",'public/img',id+'.jpg');
  let dist = '/img/'+id+'.jpg'
  fs.readdir(folderpath,function(err,arr){
    let arr2 = arr.map(e=>path.join(folderpath,e));
    concat(arr2, destinpath, function(err) {
      // fs.readFile(destinpath,function(err,data){
      //     if (err) throw err
      //     res.send(dist);
      // })
      // 1、此处使用了两个库来读取文件的MD5值
      // 分别是md5和spark-md5(和前端用的同样的库)
       
      var md5sum = crypto.createHash('md5');
      var frontspark = new SparkMD5.ArrayBuffer();
      // 2、由于读取文件的MD5值非常耗时，
      // 所以这里应用了文件的流模式读取文件的MD5值
      var stream = fs.createReadStream(destinpath);
      stream.on('data', function(chunk) {
          md5sum.update(chunk);
          frontspark.append(chunk)
      });
      stream.on('end', function() {
          str = md5sum.digest('hex');
          str2 = frontspark.end()
          if (err) throw err
          console.log(str,spark,str2);
          if(str = spark){
            res.send(dist);
          }    
      });    
    });
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