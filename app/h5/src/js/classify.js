require.config({
	paths: {
		"mui": "libe/mui.min",
		"picker": "libe/mui.picker.min"
	},
	shim: {
		"picker": { //picker在mui执行完成之后再执行
			deps: ['mui'], //deps数组，表明该模块的依赖性
		}
	}

})
require(['mui', "picker"], function(mui) {
	var mbody = document.querySelector('.mbody');
	var box = document.querySelector('.box');
	var income = 0;
	var expend = 0;
	var d = new Date();
	var tYear = d.getFullYear();
	console.log(tYear)
	var tmonth = d.getMonth() + 1;
	tmonth = tmonth < 10 ? '0' + tmonth : tmonth;
	var yearHtml = document.querySelector('.year');
	var tTime = tYear + '-' + tmonth;
	yearHtml.innerHTML = tTime;

	var dtPicker;
	var picker;

	function init() {
		a();
		exit();
		reader()
		exit1();
		time();
		yearOrmontg();
		dtPicker = new mui.DtPicker({
			"type": "month"
		});
		picker = new mui.PopPicker();
		picker.setData([{
			value: '月',
			text: '月'
		},{
			value: '年',
			text: '年'
		}]);
	}


	//登录
	function a() {
		var btn = document.querySelector('.btn');
		btn.onclick = function() {
			var name = document.querySelector('.name').value;
			var pwd = document.querySelector('.pwd').value;
			if (name && pwd) {
				mui.ajax('/api/findbill', {
					data: {
						name: name,
						pwd: pwd
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					success: function(data) {
						console.log(data)
						if (data.code == 1) {
							data.data.forEach(item => {
								sessionStorage.setItem('id', item._id);
								exit();
							})
						} else {
							alert('登录错误')
						}
					},
					error: function(xhr, type, errorThrown) {}
				});

			} else {
				alert('用户或密码错误!')

			}
		}
	}
	//登录判断
	function exit() {
		id = sessionStorage.getItem('id');
		if (!id) {
			box.classList.remove('hide');
			mbody.classList.add('hide');
		} else {
			box.classList.add('hide');
			mbody.classList.remove('hide');
			reader();
		}

	}
	//初始渲染
	function reader() {
		id = sessionStorage.getItem('id');
		let time = document.querySelector('.year').innerHTML;
		mui.ajax('/api/getBill', {
			data: {
				id: id,
				time: time
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {

				let str = '';
				var list = document.querySelector('.list');
				if (data.code == 1) {
					data.data.forEach(item => {
						str +=
							`<li class="mui-table-view-cell mui-transitioning" data-id = "${item._id}">
							<div class="mui-slider-right mui-disabled">
								<a class="mui-btn mui-btn-red delete" style="transform: translate(0px, 0px); btn1">删除</a>
							</div>
							<div class="mui-slider-handle" style="transform: translate(0px, 0px); " >
									<div class="style">
									<span class="${item.icon}"></span>
									<p >${item.style}</p>
									</div>
									<p class="${item.style=='支出'?"plus":"minus"}">${item.money}</p>
								</div>
							</li>`;
					});
					list.innerHTML = str;
					document.querySelector('.zhangdan').classList.add('hide');
					list.classList.remove('hide');

					//删除
					remove();
					money(data.data);
				} else {
					document.querySelector('.zhangdan').classList.remove('hide');
					list.classList.add('hide')

				}

			},
			error: function(xhr, type, errorThrown) {

			}
		});
	}
	//时间
	function time() {
		let year = document.querySelector('.year').addEventListener('tap', function() {
			
			dtPicker.show(function(selectItems) {
				console.log(selectItems.y); //{text: "2016",value: 2016} 
				console.log(selectItems.m); //{text: "05",value: "05"} 
				let item = selectItems.y.value + '-' + selectItems.m.value;
				console.log(item)
								yearHtml.innerHTML = item;
								reader();
			})

		})
	}
	//年 月
	function yearOrmontg() {
		document.querySelector('.month').addEventListener('tap', function() {
			let TYear = document.querySelector("[data-id='picker-y']");
			let tMonth = document.querySelector("[data-id='title-y']");
			let dYear = document.querySelector("[data-id='title-m']");
			let dMonth = document.querySelector("[data-id='picker-m']");
			picker.show(function(selectItems) {
				// console.log(selectItems[0].text); //智子
				// console.log(selectItems[0].value); //zz
				document.querySelector('.month').innerHTML = selectItems[0].value;
				if (selectItems[0].value == '年') {
					console.log(tYear)
					document.querySelector('.year').innerHTML = tYear;
					tMonth.style.display = 'none';
					TYear.style.width='100%';
					
					dYear.style.width='100%';
					dMonth.style.display = 'none';
					reader()
					
				} else {
					tMonth.style.display = 'inline-block';
					TYear.style.width='50%';
					
					dYear.style.width='50%';
					dMonth.style.display = 'inline-block';
					
					document.querySelector('.year').innerHTML = tTime;
reader()
				}
			})
		})
	}


	//删除
	function remove() {
		mui('.list').on('tap', '.delete', function() {
			var that = this;
			var li = that.parentNode.parentNode;
			mui.confirm('确定删除吗？', '提示', ['确定', '取消'], function(e) {
				if (e.index == 0) {

					mui.ajax('/api/remove', {
						data: {
							id: li.getAttribute('data-id')
						},
						dataType: 'json', //服务器返回json格式数据
						type: 'post', //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒；
						success: function(data) {
							console.log(data)
							li.remove();
							//收入 支出
							reader()
						},
						error: function(xhr, type, errorThrown) {

						}
					});


				} else {
					setTimeout(function() {
						mui.swipeoutClose(li)
					}, 0)
				}
			}, 'div')
		})

	}
	//支出  收入
	function money(data) {
		expend = 0;
		income = 0;
		data.forEach(item => {
			if (item.style == '支出') {
				expend += (item.money) * 1;
			} else {
				income += (item.money) * 1;

			}
		})
		document.querySelector('.expend span').innerHTML = expend;
		document.querySelector('.income span').innerHTML = income;

	}

	//退出
	function exit1() {
		var exit1 = document.querySelector('.exit1');
		mui('#header').on('tap', '.exit1', function() {
			mui.confirm('确定退出吗？', '提示', ['确定', '取消'], function(e) {
				if (e.index == 0) {
					sessionStorage.removeItem('id');
					exit()
				}
			}, 'div')
		})
	}
	init()
})
