let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');

let bookData = __dirname + '/database/book.json';
let collectData = __dirname + '/database/collect.json';
let sliders = require('./database/sliders.js'); // 导入轮播图图片的数据（js的导入）

let jdb = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
let app = express();

// 使用中间件

app.use(express.static(__dirname + '/static')); // 静态资源服务
app.use(bodyParser.json()); // 使用 bodyParser 处理 post 请求数据

// 轮播图图片接口
app.get('/api/sliders', (req, res) => {
  res.send(sliders)
});

// 获取热门图书
app.get('/api/hot', (req, res) => {
  let con = jdb(bookData);
  let books = con.slice(-4);
  res.send(books)
});

// 列表图书
app.get('/api/books', (req, res) => {
  let con = jdb(bookData);
  res.send(con)
})

// 删除图书
app.get('/api/delete', (req, res) => {
  let { id } = req.query;
  let con = jdb(bookData);
  con = con.filter(item => item.bookId !== +id);
  fs.writeFileSync(bookData, JSON.stringify(con), 'utf8');
  res.send({
    code: 0,
    data: null,
    msg: 'ok'
  })
})

// 收藏图书
app.post('/api/collect', (req, res) => {
  let data = req.body;
  let con = jdb(collectData);
  con.push(data);
  fs.writeFileSync(collectData, JSON.stringify(con), 'utf8');
  res.send({
    code: 0,
    data: null,
    msg: 'ok'
  })
});

// 根据id获取指定的图书
app.get('/api/getOne', (req, res) => {
  let { id } = req.query;
  let con = jdb(bookData);
  let byId = con.find(item => item.bookId === +id)
  res.send(byId)
})

// 修改图书信息
app.post('/api/update', (req, res) => {
  let data = req.body;
  data.bookId = +data.bookId;
  let con = jdb(bookData);
  let index = con.findIndex(item => +item.bookId === +data.bookId);
  con[index] = data;
  fs.writeFileSync(bookData, JSON.stringify(con), 'utf8');
  res.send({
    code: 0,
    data: null,
    msk: 'ok'
  })
})

// 获取收藏夹图书列表
app.get('/api/collect', (req, res) => {
  let con = jdb(collectData);
  res.send(con)
})

// 从收藏夹中删除指定id的图书
app.get('/api/rmCollect', (req, res) => {
  let { id } = req.query;
  let con = jdb(collectData);
  con = con.filter(item => +item.bookId !== +id);
  fs.writeFileSync(collectData, JSON.stringify(con), 'utf8');
  res.send({
    code: 0,
    data: null,
    msg: 'ok'
  })
})

// 新增图书
app.post('/api/add', (req, res) => {
  let data = req.body;
  let con = jdb(bookData);
  data.bookId = con.length ? +con[con.length - 1].bookId + 1 : 1;
  con.push(data);
  fs.writeFileSync(bookData, JSON.stringify(con), 'utf8');
  res.send({
    code: 0,
    data: null,
    msg: 'ok'
  })
})
app.listen(8005, () => console.log('port 8005 is on'))