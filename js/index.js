

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
		this.allName();//储存所有文件夹位置
		this.clearC();//点击document清空所有文件夹的class
		this.keyd();//键盘事件
		this.blur();//input失焦事件
		this.divEvent();//文件夹的移入 移出 点击 
		this.clickRight();//右击事件
		this.createMent();//生成popup页面的内容
		this.ulsC();//list里的点击事件
		this.drag();//拖拽
		for ( var i = 0; i < this.ps.length; i++ ) {
			this.arr.push(this.ps[i].innerHTML);
		}
	}
	//存储所有文件夹的名字 以及文件夹的位置
	pos.prototype.ergodic = function () {
		for ( var i = 0; i < this.divs.length; i++ ) {
			this.divs[i].style.top = i%4*160 + 'px';
			this.divs[i].style.left = parseInt(i/4)*130 + 'px';	
		}
	};
	
	pos.prototype.allName = function () {
		for ( var i = 0; i < this.divs.length; i++ ) {
			this.divs[i].index = i;
			this.arrPos.push([this.divs[i].offsetLeft,this.divs[i].offsetTop]);
		}
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
			var ev = ev || window.event;
			if ( ev.target.tagName == 'IMG' ) {
				var obj = ev.target.parentNode;
				_this.click(ev,obj);
			} 
			ev.preventDefault();
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
	//在文件上的鼠标右击事件
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
			_this.deleteElement(obj);

		};
		this.wrap.addEventListener('click',function () {
			_this.ul.style.display = 'none';
		});
	};
	//删除文件夹
	pos.prototype.deleteElement = function (obj) {
		this.desktop.removeChild(obj);
		for ( var i = 0; i < this.divs.length; i++ ) {
			this.divs[i].index = i;
		}
		var span = obj.getElementsByTagName('span')[0];
		var index = this.arr.indexOf(span.innerHTML);
		this.arr.splice(index,1);
		this.arrPos.pop();
		this.ergodic();
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
			this.inputs[i].addEventListener('blur',function () {
				var next = this.previousElementSibling;
				_this.deleteName(this,next);
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
			var index = this.arr.indexOf(obj2.innerHTML);
			this.arr.splice(index,1);
			this.arr.push(obj1.value);
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
	};
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
	};
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
	//利用事件委托实现各个list上面的功能
	
	pos.prototype.ulsC = function () {
		var _this = this;
		this.uls[0].addEventListener('click',function (ev) {
			var tar = ev.target;
			console.log(tar.innerHTML)
			if ( tar.innerHTML === '新建文件夹' ) {
				_this.createFile();
			} else if (tar.innerHTML === '刷新') {
				_this.arrPos.length = 0;
				_this.ergodic();
				_this.allName();
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
		
		div.style.top = divL%4*160 + 'px';
		div.style.left = parseInt(divL/4)*130 + 'px';
		div.index = divL;
		
		
		inputs.addEventListener('blur',function () {
			_this.deleteName(this,span);
		})
		
		img.addEventListener('mousedown',function (ev) {
			ev.cancelBubble = true;
			_this.divDown(ev,div);
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
		
		for ( var i = 0; i < this.divs.length; i++ ) {
			if ( this.divs[i].style.transition != '' ) {
				return;
			}
		}
		
		var _this = this;
		this.disX = ev.pageX - that.offsetLeft;
		this.disY = ev.pageY - that.offsetTop;
		document.addEventListener('mousemove',move);
		function move(ev) {
		    _this.fnMove(ev,that);
		}

		document.addEventListener('mouseup',up);
		function up(ev) {
			_this.fnUp(ev,that,move,up);
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
						_this.divs[i].className = 'active';
					}
				} 
			}
			for ( var i = 0; i < _this.divs.length; i++ ) {
				if ( i != _this.posIndex && i != that.index ) {
					removeClass(_this.divs[i],'active');
				}
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
	pos.prototype.fnUp = function (ev,that,move,up) {
			
		document.removeEventListener('mousemove',move);
		document.removeEventListener('mouseup',up);
		
		
		var _this = this;
		var nowIndex = that.index;
		// && this.posIndex != that.index 
		if ( this.posIndex != -1 ) {
			
//			if ( this.posIndex === that.index ) {
//				this.posIndex = -1;
//			}
			
			if ( this.divs[this.posIndex].id == 'recycle' && that != this.divs[this.posIndex] ) {
				this.deleteElement(that);
				this.posIndex = -1;
				return;
			}
			that.style.transition = this.divs[this.posIndex].style.transition = '.5s';
			
			//交换位置
			that.style.left = this.arrPos[this.posIndex][0] + 'px';
			that.style.top = this.arrPos[this.posIndex][1] + 'px';

			this.divs[this.posIndex].style.left = this.arrPos[nowIndex][0] + 'px';
			this.divs[this.posIndex].style.top = this.arrPos[nowIndex][1] + 'px';

			var divsArray = Array.from(this.divs);
			
			
			//运动结束的时候 交换节点 重新渲染页面 然后重置参数
			setTimeout(function () {
				var temp = that;
				divsArray[that.index] = divsArray[_this.posIndex];
				divsArray[_this.posIndex] = temp;
				
				_this.desktop.innerHTML = '';
				
				for ( var i = 0; i < divsArray.length; i++ ) {
					_this.desktop.appendChild(divsArray[i]);
				}
				
				for ( var i = 0; i < _this.divs.length; i++ ) {
					_this.divs[i].style.zIndex = 1;
					_this.divs[i].index = i;
				}
				
				for ( var i = 0; i < _this.divs.length; i++ ) {
					_this.divs[i].style.transition = '';
				}
				_this.posIndex = -1;
			},500);
			
		}
			
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
		this.musicWrap = document.querySelector('.musicWrap');
		this.music = document.getElementById('music');
	}
	tool.prototype.init = function () {
		this.show();
		this.snakeshow();
		this.musicshow();
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
	
	//双击音乐  让音乐界面显示出来
	tool.prototype.musicshow = function () {
		var _this = this;
		this.music.addEventListener('dblclick',function () {
			_this.musicWrap.style.display = 'block';
		});
	};
	
	var t = new tool();
	t.init();
	
	
})();


