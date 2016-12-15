//屏幕雪花
var c = document.getElementById('canvas');

var cxt = c.getContext('2d');

var arr = [];
c.width = window.innerWidth;
c.height = window.innerHeight;

var W = window.innerWidth;
var H = window.innerHeight;

//随机函数的封装
function rad(n,m) {
	return Math.floor(Math.random()*(m-n) + n);
}
function d(n) {
	return n*Math.PI/180;
}

var anima;
~function (){
	drawSnow();
	anima = window.requestAnimationFrame(arguments.callee);
}();
//window.cancelAnimationFrame(anima);

//页面生成雪花
function drawSnow() {
	
	cxt.clearRect(0,0,c.width,c.height);
	cxt.save();
	
	for ( var i = 0; i < arr.length; i++ ) {
		var h = 0.5*arr[i].scale;//雪花下落的速度
		arr[i].left = arr[i].left + Math.tan(d(arr[i].deg))*h;
		arr[i].top = arr[i].top + h;
		
		//如果雪花在页面之外  则删除雪花  提高性能
		if ( arr[i].left < 0 || arr[i].left > W || arr[i].top > H  ) {
			arr.splice(i--,1);
			continue;
		}
		
		//雪花颜色渐变
		var width_i = arr[i].scale;
		var ra = cxt.createRadialGradient(arr[i].left,arr[i].top,width_i/4,arr[i].left,arr[i].top,width_i);
		ra.addColorStop(0,"rgba(255,255,255,1)");
		ra.addColorStop(1,"rgba(255,255,255,0.1)");
		cxt.fillStyle = ra;
		
		
		cxt.beginPath();
		cxt.arc(arr[i].left,arr[i].top,width_i,0,2*Math.PI);
		cxt.fill();	
	}
	cxt.restore();
}

function next() {
	setTimeout(function () {
		if ( arr.length < 150 ) {
			for ( var i = 0; i < 20; i++ ) {
				arr.push({
					'left': rad(0,W),
					'top': 0,
					'deg': rad(-10,10),
					'scale': rad(2,10)
				});
			}
		}
		next();
	},Math.random()*200 + 500);
}
next();




(function () {
	function pos() {
		this.wrap = document.querySelector('.wrap');
		this.desktop = document.querySelector('.desktop');
		this.divs = this.desktop.children;
		this.ps = this.desktop.getElementsByTagName('span');
		this.inputs = this.desktop.getElementsByTagName('input');
		this.imgs = this.desktop.getElementsByTagName('img');
		this.ul = document.querySelector('.wrap>ul');
		this.lis = this.ul.children;
		this.popup = document.querySelector('.popup');
		this.uls = this.popup.getElementsByTagName('ul');
		this.Plis = this.popup.getElementsByTagName('li');
		
		this.onOff = false;
		this.arr = [];//储存所有的文件夹名字
		this.arrPos = [];//记录所有文件夹的位置
		
		this.disX = 0;
		this.disY = 0;
		this.posIndex = -1;//用来记录当前拖拽距离最小的index
	}
	pos.prototype.init = function () {
		this.ergodic();//定位文件夹位置
		this.allName();//储存所有文件夹名字
		this.clearC();//点击document清空所有文件夹的class
		this.keyd();//键盘事件
		this.blur();//input失焦事件
		this.divEvent();//文件夹的移入 移出 点击 
		this.clickRight();//右击事件
		this.createMent();//生成popup页面的内容
		this.ulsC();//list里的点击事件
		this.drag();//拖拽
	}
	//存储所有文件夹的名字 以及文件夹的位置
	pos.prototype.allName = function () {
		for ( var i = 0; i < this.divs.length; i++ ) {
			this.divs[i].index = i;
			this.arr.push(this.ps[i].innerHTML);
			this.arrPos.push([this.divs[i].offsetLeft,this.divs[i].offsetTop]);
		}
		console.log(this.arrPos);
	};
	
	
	//点击document清空所有div上面的class
	pos.prototype.clearC = function () {
		var _this = this;
		this.wrap.addEventListener('click',function () {
			for ( var i = 0; i < _this.divs.length; i++ ) {
				_this.divs[i].className = '';
			}
		});
	}
	//键盘ctrl键按下的时候  让开关变成ture 支持多选  抬起变false
	pos.prototype.keyd = function () {
		var _this = this;
		window.addEventListener('keydown',function (ev,obj) {
			ev = ev || window.event;
			if ( ev.ctrlKey ) {
				_this.onOff = true;
			}
		});
		window.addEventListener('keyup',function (ev,obj) {
			_this.onOff = false;
		});
	}
	//给div添加定位位置  
	pos.prototype.ergodic = function () {
		for ( var i = 0; i < this.divs.length; i++ ) {
			this.divs[i].style.top = 20 + i%4*160 + 'px';
			this.divs[i].style.left = 20 + parseInt(i/4)*130 + 'px';	
		}
	};
	//时间委托的方式 添加移入 移出 点击事件  鼠标右击事件
	pos.prototype.divEvent = function () {
		var _this = this;
		this.desktop.addEventListener('mouseover',function (ev) {
			if ( ev.target.tagName == 'IMG' ) {
				var obj = ev.target.parentNode;
				_this.enter(obj);
			}
		});
		this.desktop.addEventListener('mouseout',function (ev) {
			if ( ev.target.tagName == 'IMG' ) {
				var obj = ev.target.parentNode;
				_this.leave(obj);
			}
		});
		this.desktop.addEventListener('click',function (ev) {
			ev = ev || window.event;
			if ( ev.target.tagName == 'IMG' ) {
				var obj = ev.target.parentNode;
				_this.click(ev,obj);
			}
		});
		this.desktop.addEventListener('dblclick',function (ev) {
			ev.cancelBubble = true;
			if ( ev.target.tagName == 'SPAN' ) {
				_this.changeName(ev,ev.target);
			}
		});
	};
	//移入事件
	pos.prototype.enter = function (obj) {
		if ( obj.className == 'active' ) {
			obj.className = 'active';
		} else {
			obj.className = 'hover';	
		}
	};
	//移出事件
	pos.prototype.leave = function (obj) {
		if ( obj.className == 'active' ) {
			obj.className = 'active';
		} else {
			obj.className = '';
		}
	};
	//点击事件
	pos.prototype.click = function (ev,obj) {
		var _this = this;
		ev.cancelBubble = true;
		if ( this.onOff ) {
			obj.className = 'active';
		} else {
			for ( var i = 0; i < this.divs.length; i++ ) {
				this.divs[i].className = '';
			}
			obj.className = 'active';
		}
	};
	
	
	//鼠标右击事件
	pos.prototype.clickRight = function () {
		var _this = this;
		this.desktop.addEventListener('contextmenu',function (ev) {
			ev.cancelBubble = true;
			ev.preventDefault();
			if ( ev.target.tagName == 'IMG' ) {
				_this.popup.style.display = 'none';
				var obj = ev.target.parentNode;
				_this.menu(ev,obj);
			} else {
				_this.ul.style.display = 'none';
				_this.rightClick(ev);
				_this.liHover();
			}
		});
	};
	//在文件上的鼠标右击时间
	pos.prototype.menu = function (ev,obj) {
		this.ul.style.display = 'block';
		this.ul.style.left = ev.pageX + 'px';
		this.ul.style.top = ev.pageY + 'px';
		this.lisHover(obj);
	};
	pos.prototype.lisHover = function (obj) {
		var _this = this;
		for ( var i = 0;i < this.lis.length; i++ ) {
			this.lis[i].addEventListener('mouseenter',function () {
				this.className = 'active';
			});
			this.lis[i].addEventListener('mouseleave',function () {
				this.className = '';
			});
		}
		this.lis[0].onclick = function () {
			_this.change(obj);
		};
		this.lis[1].onclick = function () {
			//删除事件
			_this.desktop.removeChild(obj);
			_this.arrPos.splice(obj.index,i); 
			for ( var i = 0; i < _this.divs.length; i++ ) {
				_this.divs[i].index = i;
			}
			_this.ergodic();
		};
		this.wrap.addEventListener('click',function () {
			_this.ul.style.display = 'none';
		});
	};

	//双击p标签  支持修改命名
	pos.prototype.changeName = function (ev,ele) {
		var obj = ele.parentNode;
		ev.cancelBubble = true;
		this.change(obj);
	};
	
	pos.prototype.change = function (obj) {
		var span = obj.getElementsByTagName('span')[0];
		var inputs = obj.getElementsByTagName('input')[0];
		span.style.display = 'none';
		inputs.style.display = 'block';
		inputs.focus();
	};
	
	//input失焦的时候  修改名字
	pos.prototype.blur = function () {
		var _this = this;
		for ( var i = 0;i < this.inputs.length; i++ ) {
			this.inputs[i].index = i;
			this.inputs[i].addEventListener('blur',function () {
				_this.deleteName(this,_this.ps[this.index]);
			});
		}
	};
	
	pos.prototype.deleteName = function (obj1,obj2) {
		if ( obj1.value != '' ) {
			for ( var i = 0; i < this.arr.length; i++ ) {
				if ( this.arr[i] == obj1.value ) {
					alert('文件名已存在');
					return;
				}
			}
			obj2.innerHTML = obj1.value;
		}
		obj1.value = '';
		obj2.style.display = 'block';
		obj1.style.display = 'none';
	};
	
	//页面生成
	pos.prototype.createMent = function () {
		this.popup.appendChild( this.createF(rightList) );
		this.uls[0].className = 'list';
	};
	//页面生成DOM函数
	pos.prototype.createF = function ( data ) {
		var ul = document.createElement('ul');
		for ( var i = 0; i < data.length; i++ ) {
			var li = document.createElement('li');
			var h2 = document.createElement('h2');
			if ( data[i].name) {
				li.className = data[i].name;
			}
			h2.innerHTML = data[i].title;
			li.appendChild(h2);
			if ( data[i].child ) {
				li.style.background = 'url(deskImg/icon.jpg) no-repeat 170px 8px';
				li.appendChild( this.createF(data[i].child) );
			}
			ul.appendChild(li);
		}
		return ul;
	}
	//鼠标右击事件  和  隐藏
	pos.prototype.rightClick = function (ev) {
		var _this = this;
		this.popup.style.display = 'block';
		this.popup.style.left = ev.pageX + 'px';
		this.popup.style.top = ev.pageY + 'px';
		ev.preventDefault();
		//点击document让popup隐藏
		this.wrap.addEventListener('click',function () {
			_this.popup.style.display = 'none';
		});
	}
	//li移入事件
	pos.prototype.liHover = function () {
		for ( var i = 0; i < this.Plis.length; i++ ) {
			this.Plis[i].addEventListener('mouseenter',function () {
				addClass(this,'active');
			})
			this.Plis[i].addEventListener('mouseleave',function () {
				removeClass(this,'active');
			})
		}
		
	};
	//利用时间委托实现各个list上面的功能
	
	pos.prototype.ulsC = function () {
		var _this = this;
		this.uls[0].addEventListener('click',function (ev) {
			var tar = ev.target;
			console.log(tar.innerHTML)
			if ( tar.innerHTML === '新建文件夹' ) {
				_this.createFile();
			}
			if ( tar.innerHTML === '刷新' ) {
				_this.ergodic();
			}
		});
	};
	
	//点击创建文件夹
	pos.prototype.createFile = function () {
		var _this = this;
		var divL = this.desktop.children.length;
		var div = document.createElement('div');
		var img = new Image();
		var span = document.createElement('span');
		var inputs = document.createElement('input');
		
		div.style.top = 20 + divL%4*160 + 'px';
		div.style.left = 20 + parseInt(divL/4)*130 + 'px';
		div.index = divL;
		
		
		inputs.addEventListener('blur',function () {
			_this.deleteName(this,span);
		})
		
		img.addEventListener('mousedown',function (ev) {
			ev.cancelBubble = true;
			_this.divDown(ev,div);
		})
		
		
		
		img.addEventListener('mousedown',function (ev) {
			_this.fnMove(ev,div);
		})
		
		img.src = 'deskImg/folder.png';
		span.innerHTML = this.newName();
		
		this.arr.push(this.newName());
		this.arrPos.push([parseInt(div.style.left),parseInt(div.style.top)]);
		
		
		div.appendChild(img);
		div.appendChild(span);
		div.appendChild(inputs);
		
		this.desktop.appendChild(div);
			
	};
	
	
	
	
	//新建文件夹  数组查重
	pos.prototype.newName = function () {
		var arr = []
		for(var i = 0; i < this.ps.length; i++){
			var name = this.ps[i].innerHTML;
			if((name.substring(0,5) == "新建文件夹"
			&& !isNaN(name.substring(5)))
			|| name == "新建文件夹"
			){
				var nub = parseInt(name.substring(5)) - 1; 
				nub = isNaN(nub)?0:nub;
				arr[nub] = name;
			}
		}
		if(!arr[0]){
			return "新建文件夹";
		}
		for(var i = 1; i <arr.length; i++){
			if(!arr[i]){
				return "新建文件夹" + (i+1);
			}
		}
		return "新建文件夹" + (arr.length+1);
	};
	
	
	//拖拽
	pos.prototype.drag = function () {
		var _this = this;
		for ( var i = 0; i < this.divs.length; i++ ) {
			
			this.imgs[i].addEventListener('mousedown',function (ev) {
				var that = this.parentNode;
				_this.divDown(ev,that);
			});
		}
	};
	
	pos.prototype.divDown = function (ev,that) {
		var _this = this;
		this.disX = ev.pageX - that.offsetLeft;
		this.disY = ev.pageY - that.offsetTop;
		document.addEventListener('mousemove',move);
		function move(ev) {
		    _this.fnMove(ev,that);
		}
		document.addEventListener('mouseup',up);
		function up(ev) {
			_this.fnUp(that,move,up);
		}
		ev.preventDefault();
	}
	pos.prototype.fnMove = function (ev,that) {
		var _this = this;
		that.style.left = ev.pageX - this.disX + 'px';
		that.style.top = ev.pageY - this.disY + 'px';
		
		minFn(that);
		that.style.zIndex = 999;
		
		//检测哪个是离他最近的
		
		function minFn(that){
			var max = Infinity;
			for(var i=0;i<_this.divs.length;i++){
				if(duang(that,_this.divs[i])){
					var a = _this.arrPos[_this.divs[i].index][0] - that.offsetLeft;
					var b =  _this.arrPos[_this.divs[i].index][1] - that.offsetTop;
					var sqrt = Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
					if(max > sqrt){
						max = sqrt;
						_this.posIndex = i;
					}
				}
			}
			for ( var i = 0; i < _this.divs.length; i++ ) {
				if ( i != _this.posIndex ) {
					removeClass(_this.divs[i],'active');
				}
			}
			if(_this.posIndex == -1){
				return null;
			}else{
				addClass(_this.divs[_this.posIndex],'active');
				return _this.posIndex;
			}
		}
			
		
		
		
		
		//判断是否碰撞的函数
		function duang(obj,obj2){
			
			var l1 = obj.offsetLeft;
			var t1 = obj.offsetTop;
			var r1 = l1 + obj.offsetWidth;
			var b1 = t1 + obj.offsetHeight;
			
			var l2 = obj2.offsetLeft;
			var t2 = obj2.offsetTop;
			var r2 = l2 + obj2.offsetWidth;
			var b2 = t2 + obj2.offsetHeight;
			
			if(r1 < l2 || t1 > b2 || l1 > r2 || b1 < t2){
				return false;
			}else{
				return true;
			}
		}
		
		
	}
	pos.prototype.fnUp = function (that,move,up) {
		
		if ( this.posIndex != -1 ) {
			[this.arrPos[this.posIndex],this.arrPos[that.index]] = [this.arrPos[that.index],this.arrPos[this.posIndex]];
		}
		for ( var i = 0; i < this.divs.length; i++ ) {
			
			this.divs[i].style.zIndex = 1;
			removeClass(this.divs[i],'active');
			this.divs[i].style.left = this.arrPos[i][0] + 'px';
			this.divs[i].style.top = this.arrPos[i][1] + 'px';
		}
		this.posIndex = -1;
		document.removeEventListener('mousemove',move);
		document.removeEventListener('mouseup',up);
	}
	
	
	
	
	
	
	
	
	
	
	
	var p = new pos();
	p.init();
	
	
	
	
	
	
	
	
	
	
	//页面每个工具功能的打开
	function tool() {
		this.pictureWall = document.querySelector('.pictureWall');
		this.picture = document.getElementById('picture');
		this.game = document.getElementById('game');
		this.snake = document.getElementById('snake');
		this.recycle = document.getElementById('recycle');
	}
	tool.prototype.init = function () {
		this.show();
		this.snakeshow();
	};
	//点击图片  显示页面
	tool.prototype.show = function () {
		var _this = this;
		var img = this.picture.getElementsByTagName('img')[0];
		img.addEventListener('dblclick',function () {
			window.cancelAnimationFrame(anima);
			if ( _this.pictureWall.style.display == 'block' ) {
				return;
			}
			_this.pictureWall.style.display = 'block';
			mTween(_this.pictureWall,{opacity: 100},600,'linear',function () {
				picChange();
			});
		});
	};
	//点击game 让贪吃蛇显示出来
	tool.prototype.snakeshow = function () {
		var _this = this;
		var img = this.game.getElementsByTagName('img')[0];
		img.addEventListener('dblclick',function () {
			if (_this.snake.style.display == 'block') {
				return;
			}
			_this.snake.style.display = 'block';
			mTween(_this.snake,{top: 30},2000,'bounceOut');
		});
	};
	//拖拽文件夹到回收站时 删除该文件夹
	
	var t = new tool();
	t.init();
	
	
})();



//照片墙
function picChange() {
//---------------------------------------------------------
//声明变量
var picWall = document.querySelector('.pictureWall');
var imgList = document.getElementById('imgList');
var lis = imgList.children;

var div = imgList.getElementsByTagName('div');

var h1 = document.getElementsByTagName('h1')[0];
var Hspan = h1.getElementsByTagName('span')[0];

var picSort = document.querySelector('.picSort');


var prev = document.querySelector('.prev');
var next = document.querySelector('.next');

var cubeWrap = document.querySelector('.cubeWrap'); 
var cube = document.querySelector('.cube')
var divs = cube.getElementsByTagName('div');

var onOff = false;
var n = 0;//记录当前是第几张图片

var neat3d = false;
var keyOff = false;//判断键盘事件的触发
var timer = null;


var winW = picWall.offsetWidth;
var winH = picWall.offsetHeight;
console.log(winH,winW);
var liW = 160;
var liH = 100;


//---------------------------------------------------------

set3D();
rand3D();
strong3d();
enterLi();
dblLi();
next3d();
prev3d();
keyDown();
moveLi();

//---------------------------------------------------------
//h2点击的时候隐藏页面
Hspan.onclick = function () {
	mTween(picWall,{opacity: 0},600,'linear',function () {
		~function (){
			drawSnow();
			anima = window.requestAnimationFrame(arguments.callee);
		}();
		picWall.style.display = 'none';
		imgList.innerHTML = '';
	})
};

//封装随机位置的函数
function randPos() {
	var arr = [];
	var W = picWall.offsetWidth;
	var H = picWall.offsetHeight - 60;
	var w = 160;
	var h = 100;
	for ( i = 0; i < lis.length; i++ ) {
		var left = Math.random()*(W-w);
		var top = Math.random()*(H-h);
		var rotateZ = 30 - Math.random()*60;
		var rotateX = 30 - Math.random()*60;
		var rotateY = 30 - Math.random()*60;
		arr.push([left,top,rotateZ,rotateX,rotateY]);
	}
	return arr;
}
//封装平铺排序位置的函数
function tilePos() {
	var arr = [];
	var W = picWall.offsetWidth;
	var H = picWall.offsetHeight - 80;
	var w = 950;
	var h = 500;
	for ( i = 0; i < lis.length; i++ ) {
		var left = (W-w)/2+i%5*195;
		var top = (H-h)+parseInt(i/5)*100;
		var rotateZ = 30 - Math.random()*60;
		var rotateX = 30 - Math.random()*60;
		var rotateY = 30 - Math.random()*60;
		arr.push([left,top,rotateZ,rotateX,rotateY]);
	}
	return arr;
}



//------------------------------------------------------------------------------------
//										3D转换
//创建3D的结构
function set3D() {
	for ( var i = 0; i < 25; i++ ) {
		var li = document.createElement('li');
		li.style.left = (winW - liW)/2 + 'px';
		li.style.top = (winH - liH)/2 - 60 + 'px';
		var arr2 = [];
 		for ( var j = 0; j < 6; j++ ) {
			var div = document.createElement('div');
			div.style.backgroundImage = 'url(img/'+ (i+1) +'.jpg)';
			if ( j == 0 ) {
				div.style.backgroundSize = '160px 100px';
			}
			li.appendChild(div);
		};
		imgList.appendChild(li);
	}
}

//3D下随机排序 随机旋转一定角度
function rand3D() {
	var arrPos = randPos();
	for ( var i = 0; i < lis.length; i++ ) {
		mTween(lis[i],{left: arrPos[i][0],top: arrPos[i][1],rotateZ: arrPos[i][2],rotateY: arrPos[i][3],rotateX: arrPos[i][4]},1000,'easeBoth');
	};
}
//3D下平铺排序
function tile3D() {
	var arrPos = tilePos();
	for ( var i = 0; i < lis.length; i++ ) {
		mTween(lis[i],{left: arrPos[i][0],top: arrPos[i][1],rotateZ: arrPos[i][2],rotateY: arrPos[i][3],rotateX: arrPos[i][4]},1000,'easeBoth');
	}
}
//鼠标移入li 层级提升 X旋转为0deg
//鼠标移出li 层级还原 旋转随机
function enterLi() {
	for ( var i = 0; i < lis.length; i++ ) {
		lis[i].onmouseover = function () {
			this.style.zIndex = 30;
			mTween(this,{rotateX: 0,scale: 120},800,'easeBoth');
		}
		lis[i].onmouseout = function () {
			this.style.zIndex = 1;
			mTween(this,{rotateX: 30 - Math.random()*6,scale: 100},800,'easeBoth');
		}
	}
}

//点击平铺排序和随机排序
function strong3d() {
	picSort.onclick = function () {
		if ( !onOff ) {
			this.innerHTML = '随机排序';
			tile3D();
		} else {
			this.innerHTML = '平铺排序';
			rand3D();
		}
		onOff = !onOff;
	}
}
//双击li 拼装成大图
function dblLi() {
	var div1 = document.querySelectorAll('li div:nth-of-type(1)');
	for ( var i = 0; i < lis.length; i++ ) {
		lis[i].index = i;
		lis[i].ondblclick = function () {
			n = this.index + 1;
			if ( !neat3d ) {
				fn1();
			} else {
				fn2();
			}
			neat3d = !neat3d;
		};
		//在分散图的时候的点击//合成图片层级问题有待修改
		function fn1() {
			//改变层级关系
			
			//清楚li的键盘按下事件
			for ( var i = 0; i < lis.length; i++ ) {
				lis[i].onmousedown = null;
			}
			
			prev.style.display = next.style.display = 'block';
			picSort.style.display = 'none';
			for ( var i = 0; i < div.length; i++ ) {
				div[i].style.backgroundImage = 'url(img/'+ n +'.jpg)';
			}
			for ( var i = 0; i < lis.length; i++ ) {
				div1[i].style.backgroundSize = '800px 500px';
				div1[i].style.backgroundPosition = ''+ -(i%5*160) +'px '+ -(parseInt(i/5)*100) +'px';
				lis[i].onmouseover = lis[i].onmouseout = null;
				mTween(lis[i],{rotateZ: 360 - Math.random()*720,rotateY: 360 - Math.random()*720,rotateX: 360 - Math.random()*720,scale: 100},800,'easeBoth',function () {
					for ( var i = 0; i < lis.length; i++ ) {
						mTween(lis[i],{left: (winW-liW*5)/2+i%5*160,top: (winH-liH*5-80)+parseInt(i/5)*100,rotateX: 0,rotateY: 0,rotateZ: 0},1000,'easeBoth');
					}
				});
			}
		};
		//在整齐的时候点击//这里有个卡顿问题
		function fn2() {
			moveLi();//还原li的点击事件
			prev.style.display = next.style.display = 'none';
			picSort.style.display = 'block';
			picSort.innerHTML = '平铺排序';
			onOff = false;
			for ( var i = 0; i < lis.length; i++ ) {
				var div = lis[i].getElementsByTagName('div');
				for ( var j = 0; j < div.length; j++ ) {
					div[j].style.backgroundImage = 'url(img/'+ (i+1) +'.jpg)';
					div[j].style.backgroundPosition = '';
					if ( j == 0 ) {
						div[j].style.backgroundSize = '160px 100px';
					}
				}
			}
			for ( var i = 0; i < lis.length; i++ ) {
				mTween(lis[i],{left: Math.random()*(winW - liW), top: Math.random()*(winH - liH - 60),rotateZ: 30 - Math.random()*60,rotateY: 30 - Math.random()*60,rotateX: 30 - Math.random()*60,zIndex: 1},1000,'easeBoth');
			}
			enterLi();
		}
	}
}


//点击下一张//屏幕闪光问题
function next3d() {
	next.onclick = function () {
		n++;
		if ( n > lis.length ) {
			n = 1;
		}
		for ( var i = 0; i < lis.length; i++ ) {
			mTween(lis[i],{left: Math.random()*(winW - liW), top: Math.random()*(winH - liH - 60),rotateZ: 30 - Math.random()*60,rotateY: 30 - Math.random()*60,rotateX: 30 - Math.random()*60},600,'easeBoth',function () {
				for ( var i = 0; i < div.length; i++ ) {
					div[i].style.backgroundImage = 'url(img/'+ n +'.jpg)';
				}
				for ( var i = 0; i < lis.length; i++ ) {
					mTween(lis[i],{rotateZ: 360 - Math.random()*720,rotateY: 360 - Math.random()*720,rotateX: 360 - Math.random()*720,scale: 100},800,'easeBoth',function () {
					for ( var i = 0; i < lis.length; i++ ) {
						mTween(lis[i],{left: (winW-liW*5)/2+i%5*160,top: (winH-liH*5-80)+parseInt(i/5)*100,rotateX: 0,rotateY: 0,rotateZ: 0},1000,'easeBoth');
					}
				});
				}
			});
		};
	};
}
//点击上一张 
function prev3d() {
	prev.onclick = function () {
		n--;
		if ( n < 1 ) {
			n = lis.length;
		}
		var arrPos = randPos();
		for ( var i = 0; i < lis.length; i++ ) {
			mTween(lis[i],{left: Math.random()*(winW - liW), top: Math.random()*(winH - liH - 110),rotateZ: 30 - Math.random()*60,rotateY: 30 - Math.random()*60,rotateX: 30 - Math.random()*60},600,'easeBoth',function () {
				for ( var i = 0; i < div.length; i++ ) {
					div[i].style.backgroundImage = 'url(img/'+ n +'.jpg)';
				}
				for ( var i = 0; i < lis.length; i++ ) {
					mTween(lis[i],{rotateZ: 360 - Math.random()*720,rotateY: 360 - Math.random()*720,rotateX: 360 - Math.random()*720,scale: 100},800,'easeBoth',function () {
					for ( var i = 0; i < lis.length; i++ ) {
						mTween(lis[i],{left: (winW-liW*5)/2+i%5*160,top: (winH-liH*5-80)+parseInt(i/5)*100,rotateX: 0,rotateY: 0,rotateZ: 0},1000,'easeBoth');
					}
				});
				}
			});
		};
	}
}


//键盘事件
function keyDown() {
	document.onkeydown = function (ev) {
		if ( ev.ctrlKey ) {
			keyOff = true;
		} 
	}
	document.onkeyup = function (ev) {
		keyOff = false;
	}
	imgList.onclick = function () {
		if (keyOff) {
			prev.style.display = next.style.display = 'none';
			picSort.style.display = 'none';
			imgList.style.display = 'none';
			cubeWrap.style.display = 'block';
			for ( var i = 0; i < divs.length; i++ ) {
				if ( n ) {
					divs[i].style.backgroundImage = 'url(img/'+ n +'.jpg)';
				}
			}
			keyOff = !keyOff;
		}
	}
	cubeWrap.onclick = function () {
		if (keyOff) {
			prev.style.display = next.style.display = 'block';
			imgList.style.display = 'block';
			cubeWrap.style.display = 'none';
			keyOff = !keyOff;
		}
		
	}
	
}

//拖拽li  进行移动
moveLi();
function moveLi() {
	
	for ( var i = 0; i < lis.length; i++ ) {
		lis[i].onmousedown = function (ev) {
			var time = 0;
			var _this = this;
			var disX = ev.pageX - this.offsetLeft;
			var disY = ev.pageY - this.offsetTop;
			
			var startPointX = ev.pageX;
			var startPointY = ev.pageY;
			
			var speedX = 0;
			var speedY = 0;
			
			
			document.onmousemove = function (ev) {
				//charAt   兼容IE6                          
				_this.style.left = ev.pageX - disX + 'px';
				_this.style.top = ev.pageY - disY + 'px';
				
				speedX = ev.pageX - startPointX;
				speedY = ev.pageY - startPointY;
				
				startPointX = ev.pageX;
				startPointY = ev.pageY;
				

				//移动过界处理
				if ( ev.pageX - disX < 0 ) {
					_this.style.left = 0;
				}
				if ( ev.pageX - disX > picWall.offsetWidth - _this.offsetWidth ) {
					_this.style.left = picWall.offsetWidth - _this.offsetWidth + 'px';
				}
				if ( ev.pageY - disY < 0) {
					_this.style.top = 0;
				}
				if ( ev.pageY - disY > picWall.offsetHeight - _this.offsetHeight - 60) {
					_this.style.top = picWall.offsetHeight - _this.offsetHeight - 60 + 'px';
				}
			}
			document.onmouseup = function (ev) {
				clearInterval(timer);
				setInterval(function () {
					speedX = speedX * .95;
					speedY = speedY * .95;
					if ( Math.abs(speedX) < 1 && Math.abs(speedY) < 1 ) {
						clearInterval(timer);
					} else {
						if ( _this.offsetLeft < 5 || _this.offsetLeft > window.innerWidth - _this.offsetWidth - 5 ) {
							speedX = -speedX;
						}
						if ( _this.offsetTop < 5 || _this.offsetTop > window.innerHeight - _this.offsetHeight - 65) {
							speedY = -speedY;
						}
						_this.style.left = _this.offsetLeft + speedX + 'px';
						_this.style.top = _this.offsetTop + speedY + 'px';
					}
				},20)
				
				
				document.onmousemove = document.onmouseup = null;
			};
			return false;
		}
	}
}
	
};

