(function () {
	var c = document.getElementById('canvas');

	var cxt = c.getContext('2d');
	
	var arr = [];
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	
	var W = window.innerWidth;
	var H = window.innerHeight;
	
	window.onresize = function () {
		c.width = window.innerWidth;
		c.height = window.innerHeight;
		
		var W = window.innerWidth;
		var H = window.innerHeight;
	}
	
	//随机函数的封装
	function rad(n,m) {
		return Math.floor(Math.random()*(m-n) + n);
	}
	function d(n) {
		return n*Math.PI/180;
	}
	
	//单开页面是 随机在页面中生成100个雪花
	
	for ( var i = 0; i < 150; i++ ) {
		arr.push({
			'left': rad(0,W),
			'top': rad(0,H),
			'deg': rad(-10,10),//控制雪花位置
			'scale': rad(2,10)  //控制雪花大小
		});
	}
	
	setInterval(drawSnow,16);
	
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
			if ( arr.length < 200 ) {
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
})();
(function () {
	function pos() {
		this.doc = document;
		this.desktop = document.querySelector('.desktop');
		this.divs = this.desktop.children;
		this.ps = this.divs.getElementsByTagName('span');
		this.inputs = this.divs.getElementsByTagName('input');
	}
	pos.prototype.init = function () {
		this.ergodic();
		this.clearC();
	}
	
	pos.prototype.clearC = function () {
		var _this = this;
		this.doc.addEventListener('click',function () {
			for ( var i = 0; i < _this.divs.length; i++ ) {
				_this.divs[i].className = '';
			}
		});
	}
	
	pos.prototype.ergodic = function () {
		var _this = this;
		for ( var i = 0; i < this.divs.length; i++ ) {
			this.divs[i].style.top = 20 + i%4*160 + 'px';
			this.divs[i].style.left = 20 + parseInt(i/4)*130 + 'px';
			this.divs[i].addEventListener('mouseenter',function () {
				_this.enter(this);
			});
			this.divs[i].addEventListener('mouseleave',function () {
				_this.leave(this);
			});
			this.divs[i].addEventListener('click',function (ev) {
				ev = ev || window.event;
				_this.click(ev,this);
			});
		}
	};
	
	pos.prototype.enter = function (obj) {
		if ( obj.className == 'active' ) {
			obj.className = 'active';
		} else {
			obj.className = 'hover';	
		}
	};
	
	pos.prototype.leave = function (obj) {
		if ( obj.className == 'active' ) {
			obj.className = 'active';
		} else {
			obj.className = '';
		}
	};
	
	pos.prototype.click = function (ev,obj) {
		ev.cancelBubble = true;
		for ( var i = 0; i < this.divs.length; i++ ) {
			this.divs[i].className = '';
		}
		obj.className = 'active';
	};
	
	var p = new pos();
	p.init();
	
})();
