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
setTimeout(function () {
	rand3D();
},3000)
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
		cubeWrap.style.display = 'none';
		imgList.style.display = 'block';
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
				if ( ev.pageY - disY > picWall.offsetHeight - _this.offsetHeight - 80) {
					_this.style.top = picWall.offsetHeight - _this.offsetHeight - 80 + 'px';
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
						if ( _this.offsetLeft < 5 || _this.offsetLeft > picWall.offsetWidth - _this.offsetWidth - 5 ) {
							speedX = -speedX;
						}
						if ( _this.offsetTop < 5 || _this.offsetTop > picWall.offsetHeight - _this.offsetHeight - 65) {
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