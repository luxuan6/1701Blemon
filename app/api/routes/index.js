var express = require('express');
var router = express.Router();
const mongedb = require('mongodb-curd');
const db = "1701Blemon";
const bill = "bill";
const user = "user";
const classify = "classify";
const icon = "icon";
/* GET home page. */
router.post('/api/findbill', function(req, res, next) {
    let obj = req.body;
    let pwd = obj.pwd;
	let name = obj.name;

    mongedb.find(db, user, {name:name,pwd:pwd}, function(data) {
		
        if (!data) {
            res.json({
                code: 2,
                msg: "查询错误"
            })
        } else {
			if(data.length==0){
				res.json({
				    code: 0,
				    msg: "查询失败"
				})
			}else{
				res.json({
				    code: 1,
				    msg: '查询成功',
				    data: data
				})
			}
            
        }
    })
});

router.post('/api/getBill', function(req, res, next) {
    let id = req.body.id;
	let time =new RegExp(req.body.time);
	console.log(id);
	console.log(time)
    mongedb.find(db, bill, { 'id':id,time:time}, function(data) {
        if (!data) {
            res.json({
                code: 2,
                smg: "查询失败"
            })
        } else {
           if(data.length==0){
			    res.json({
			       code: 0,
			       smg: '查询失败'
			   })
		   }else{
			    res.json({
			       code: 1,
			       smg: '查询成功',
			       data: data
			   })
		   }
        }
    })
});

router.post('/api/remove', function(req, res, next) {
    let id = req.body.id;
    console.log(id)
    mongedb.remove(db, bill, { _id: id }, function(data) {
        if (!data) {
            res.json({
                code: 0,
                smg: "删除失败"
            })
        } else {
            res.json({
                code: 1,
                smg: '删除成功',
                data: data
            })
        }
    })
});

router.post('/api/classify', function(req, res, next) {
    let uid = req.body.uid;
    mongedb.find(db, classify, { uid: uid }, function(data) {
        if (!data) {
            res.json({
                code: 0,
                smg: "查询失败"
            })
        } else {
            res.json({
                code: 1,
                smg: '查询成功',
                data: data
            })
        }
    })
});


module.exports = router;