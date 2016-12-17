//屏幕雪花
var c = document.getElementById('canvas');

var cxt = c.getContext('2d');

var arr = [];

var W,H;

W = c.width = window.innerWidth;
H = c.height = window.innerHeight;


window.onresize = function () {
	W = c.width = window.innerWidth;
	H = c.height = window.innerHeight;
};

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
		if ( arr.length < 100 ) {
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
	},Math.random()*200 + 300);
}
next();
