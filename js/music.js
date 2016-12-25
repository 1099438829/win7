(function () {
	
	function ctrol() {
		this.musicWrap = document.querySelector('.musicWrap');
		
		//上一首  下一首  播放 暂停
		this.play = this.musicWrap.querySelector('.play');
		this.prev = this.musicWrap.querySelector('.pre');
		this.next = this.musicWrap.querySelector('.next');
		this.loop = document.querySelector('.loop');
		this.loofOff = true;//用来判断是不是单曲循环
		

		this.musicName = this.musicWrap.querySelector('.musicName');
		this.musicArtist = this.musicWrap.querySelector('.musicArtist');
		this.totalTime = this.musicWrap.querySelector('.totalTime');
		this.nowTime = this.musicWrap.querySelector('.nowTime');
		this.divs = this.musicWrap.querySelector('.header div');
		
		//播放进度条相关
		this.curnow = this.musicWrap.querySelector('.curnow');
		this.dotbtn = this.musicWrap.querySelector('.dotBtn');
		this.bar = this.musicWrap.querySelector('.bar');
		this.disX = 0;//进度条拖拽
		
		//音乐列表
 		this.list = this.musicWrap.querySelector('.list');
		this.playList = this.musicWrap.querySelector('.playList');
		this.musicList = this.playList.querySelector('.musicList');
		this.closeBtn = this.playList.querySelector('strong');
		this.lis = this.musicList.children;
		
		
		//canvas相关参数 audio
		this.audo = document.getElementById('audio');
		this.canvas = document.getElementById('mCanvas');
		this.cxt = this.canvas.getContext('2d');
		this.audioC = new AudioContext();
		this.analyser = this.audioC.createAnalyser();
		this.audiosrc = this.audioC.createMediaElementSource(this.audo);
		
		this.num = 0;//音乐条个数
		
		this.timer = null;//实时监测播放进度
		
		this.onOff = true;//判断当前是否是播放状态
		
		
		this.n = 0;  //记录当前播放的是第几首歌曲
		
		//最大化 最小化  关闭
		this.min = document.querySelector('.min');
		this.max = document.querySelector('.max');
		this.close = document.querySelector('.close');
		
		//滚动条
		this.scroll = document.querySelector('.scroll');
		this.roll = document.querySelector('.roll');
		this.disY = 0;//音乐列表滚动
		
		  
	};

	ctrol.prototype.init = function () {
		var _this = this;
		this.audo.volume = .1;
		window.onresize = function () {
			_this.canvas.width = window.innerWidth * 0.8;
			_this.canvas.height = window.innerHeight * 0.7;
			_this.num = Math.floor(_this.canvas.width/12);
		}
		window.onresize();
		this.played();//点击开始按钮
		this.nexted();//点击下一首
		this.preved();//点击上一首
		this.dragbar();//进度条拖拽
		this.createPlayL();//生成音乐列表
		this.closed();//关闭音乐列表
		this.drag();//拖拽小点
		this.mined();
		this.maxed();
		this.scrolled();
		this.looped();
	};
	//生成音乐列表 
	ctrol.prototype.createPlayL = function () {
		for ( var i = 0; i < musicData.length; i++ ) {
			var li = document.createElement('li');
			var span1 = document.createElement('span');
			var span2 = document.createElement('span');
			span1.innerHTML = musicData[i].name + ' ';
			span2.innerHTML = '- '+ musicData[i].artist;
			li.appendChild(span1);
			li.appendChild(span2);
			this.musicList.appendChild(li);
		}
		this.showMusicList();
		this.lis[0].className = 'active';
	};
	//点击显示音乐列表  关闭音乐列表
	ctrol.prototype.showMusicList = function () {
		var _this = this;
		this.list.onclick = function () {
			_this.playList.style.bottom = 0;
			_this.changeMusic();
		};
		this.closeBtn.onmouseover = function () {
			this.style.transform = 'rotate(-180deg)';
			this.style.color = 'yellow';
		};
		this.closeBtn.onmouseout = function () {
			this.style.transform = 'rotate(0)';
			this.style.color = '#fff';
		};
		this.closeBtn.onclick = function () {
			_this.playList.style.bottom = '-360px';
		};
	}
	//点击开始播放
	ctrol.prototype.played = function () {
		var _this = this;
		this.play.onclick = function () {
			if ( _this.audo.paused ) {
				_this.musicPlay();
			} else {
				clearInterval(_this.timer);
				_this.onOff = true;
				_this.audo.pause();
				this.style.background = 'url(deskImg/play_rdi_btn_play.png) no-repeat';
			}
		};
	};
	//播放执行函数
	ctrol.prototype.musicPlay = function () {
		var _this = this;
		this.onOff = false;
		this.audo.play();
		this.totalT();
		this.canvasCreate();
		this.timer = setInterval(function () {
			_this.nowT();
		},20);
		this.play.style.background = 'url(deskImg/play_rdi_btn_pause.png) no-repeat';
	};
	
	//获取播放总时间
	ctrol.prototype.totalT = function () {
		var totalTime = this.audo.duration;
		var m = this.tbD(Math.floor(totalTime/60));
		var s = this.tbD(Math.round(totalTime % 60));
		var str = m + ':' + s;
		this.totalTime.innerHTML = str;
		
	};
	//获取当前播放时间  根据当前时间来计算进度条该走多少
	ctrol.prototype.nowT = function () {
		var nowTime = this.audo.currentTime;
		var totalTime = this.audo.duration;
		var m = this.tbD(Math.floor(nowTime/60));
		var s = this.tbD(Math.round(nowTime % 60));
		var str = '';
		str = m + ':' + s;
		var scale = nowTime / totalTime;
		this.nowTime.innerHTML = str;
		this.curnow.style.width = scale * 240 + 'px';
		this.dotbtn.style.left = -10 + scale * 240 + 'px';
		this.over();
	};
	
	//补零函数
	ctrol.prototype.tbD = function (num) {
		return num = num <= 9 ? '0' + num : '' + num; 
	};
	
	//点击单曲循环
	ctrol.prototype.looped = function () {
		var _this = this;
		this.loop.onclick = function () {
			if ( _this.loofOff ) {
				this.style.background = 'url(deskImg/play_icn_loop_solo.png) no-repeat';
				_this.audo.loop = true;
				_this.loofOff = false;
			} else {
				_this.audo.loop = false;
				this.style.background = 'url(deskImg/play_icn_loop.png) no-repeat';
				_this.loofOff = true;
			}
		};
	};
	
	//点击下一张
	ctrol.prototype.nexted = function () {
		
		var _this = this;
		this.next.onclick = function () {
			if ( _this.loofOff ) {
				_this.n++;
				if ( _this.n > musicData.length - 1 ) {
					_this.n = 0;
				}
				_this.playR();
			} else {
				_this.audo.currentTime = 0;
			}
		};
	};
	//点击上一张
	ctrol.prototype.preved = function () {
		var _this = this;
		this.prev.onclick = function () {
			if ( _this.loofOff ) {
				_this.n--;
				if ( _this.n < 0 ) {
					_this.n = musicData.length - 1;
				}
				_this.playR();
			} else {
				_this.audo.currentTime = 0;
			}
		}
	};
	//音乐播放完的后需要完成的工作
	ctrol.prototype.over = function () {
		if ( this.audo.ended ) {
			this.cxt.clearRect(0,0,this.canvas.width,this.canvas.height);
			if ( this.loofOff ) {
				this.n++;
				console.log(this.n);
				if ( this.n > musicData.length - 1 ) {
					this.n = 0;
				}
			} else {
				_this.audo.currentTime = 0;
			}
			clearInterval(this.timer);
			this.playR();
		};
	};
	//点击进度条
	ctrol.prototype.dragbar = function () {
		var _this = this;
		this.bar.onclick = function (ev) {
			clearInterval(_this.timer);
			var l = this.getBoundingClientRect().left;
			var sca = (ev.pageX - l)/this.offsetWidth;
			var t = sca*_this.audo.duration;
			
			_this.audo.currentTime = t;
			_this.nowT();
		};
	};
	
	//进度条拖拽
	ctrol.prototype.drag = function () {
		var _this = this;
		this.dotbtn.onmousedown = function (ev) {
			console.log(1);
			_this.disX = ev.pageX - this.offsetLeft;
			_this.musicWrap.onmousemove = function (ev) {
				console.log(1);
				_this.fnMove(ev);
			};
			_this.musicWrap.onmouseup = function () {
				_this.fnUp();
			};
			ev.cancelBubble = true;
			ev.preventDefault();
		};
		_this.dotbtn.onmouseout = function () {
			_this.fnUp();
		};
	};
	//移动
	ctrol.prototype.fnMove = function (ev) {
		
		clearInterval(this.timer);
		this.audo.pause();
		var l = ev.pageX - this.disX;
		if ( l <= -10 ) {
			l = -10;
		}
		if ( l >= 230) {
			l = 230;
		}
		this.dotbtn.style.left = l + 'px';
		this.curnow.style.width = l + 10 + 'px';
		this.audo.currentTime = l/240 * this.audo.duration;
	};
	
	//抬起
	ctrol.prototype.fnUp = function () {
		var _this = this;
		this.musicWrap.onmousemove = this.musicWrap.onmouseup = null;
		if ( !this.onOff ) {
			_this.audo.play();
			_this.totalT();
			_this.canvasCreate();
			this.timer = setInterval(function () {
				_this.nowT();
			},20);	
		}
	};
	
	
	//播放重置
	ctrol.prototype.playR = function () {
		for ( var i = 0; i < this.lis.length; i++ ) {
			this.lis[i].className = '';
		}
		this.lis[this.n].className = 'active';
		this.cxt.clearRect(0,0,this.canvas.width,this.canvas.height);
		clearInterval(this.timer);
		var _this = this;
		this.musicName.innerHTML = musicData[this.n].name;
		this.musicArtist.innerHTML = musicData[this.n].artist;
		this.curnow.style.width = 0;
		this.dotbtn.style.left = '-9px';
		this.audo.src = musicData[this.n].src;
		
		this.audo.onloadedmetadata = function () {
			if ( !_this.onOff ) {
				_this.audo.autoplay = true;
			} else {
				_this.audo.autoplay = false;
			}
			_this.canvasCreate();
			_this.totalT();
			_this.timer = setInterval(function () {
				_this.nowT();
			},20);
		};
	};
	
	//canvas绘制
	ctrol.prototype.canvasCreate = function () {
		var _this = this;
		
		
		this.audiosrc.connect(this.analyser);//将提取到的数据放入analyserNode
		this.analyser.connect(this.audioC.destination);//与外部硬件连接
		
		gradient = this.cxt.createLinearGradient(0, 0, 0, 400);
		gradient.addColorStop(1, '#0f0');
		gradient.addColorStop(0.5, '#ff0');
		gradient.addColorStop(0, '#f00');
		var Ymaotou = [];
		
		
		
		var fn = function (){ 
			//获得音频中所有个频率的能量值
			var voiceHeight = new Uint8Array(_this.analyser.frequencyBinCount);
			_this.analyser.getByteFrequencyData(voiceHeight);
			
			//获取步长
			var step = Math.round(voiceHeight.length/_this.num);
			
			
			
			_this.cxt.clearRect(0,0,_this.canvas.width,_this.canvas.height);
			
			_this.cxt.beginPath();
			for ( var i = 0; i < _this.num; i++ ) {
				var val = voiceHeight[step*i];
				
				if ( Ymaotou.length < _this.num ) {
					Ymaotou.push(val);
				}
				
				_this.cxt.fillStyle = 'lightblue';
				
				if ( val < Ymaotou[i] ) {
					_this.cxt.fillRect(i*12,350 - (--Ymaotou[i]),10,2);
				} else {
					_this.cxt.fillRect(i*12,350 - val,10,2);
					Ymaotou[i] = val;
				}
				_this.cxt.fillStyle = gradient;
				_this.cxt.fillRect(i*12,350,10,-val+2);
			}
			
			_this.cxt.stroke();
			requestAnimationFrame(fn);
		};
		requestAnimationFrame(fn);
	};
	
	//点击关闭
	ctrol.prototype.closed = function () {
		var _this = this;
		this.close.onclick = function () {
			clearInterval(_this.timer);
			_this.onOff = true;
			_this.audo.pause();
			_this.play.background = 'url(deskImg/play_rdi_btn_play.png) no-repeat';
			_this.musicWrap.style.display = 'none';
		};
	};
	
	//点击最小化
	ctrol.prototype.mined = function () {
		var _this = this;
		this.min.onclick = function () {
			_this.musicWrap.id = 'musicWrap';
		};
	};
	//点击最大化
	ctrol.prototype.maxed = function () {
		var _this = this;
		this.max.onclick = function () {
			_this.musicWrap.id = '';
		};
	};
	//点击音乐列表进行歌曲切换
	ctrol.prototype.changeMusic = function () {
		for ( var i = 0; i < this.lis.length; i++ ) {
			this.lis[i].index = i;
			var _this = this;
			this.lis[i].onclick = function () {
				_this.n = this.index;
				for ( var i = 0; i < _this.lis.length; i++ ) {
					_this.lis[i].className = '';
				}
				_this.musicPlay();
				_this.playR();
			};
		}
	};
	
	//音乐列表  滚动
	ctrol.prototype.scrolled = function () {
		var _this = this;
		this.roll.onmousedown = function (ev) {
			_this.disY = ev.pageY - this.offsetTop;
			document.onmousemove = function (ev) {
				var l = ev.pageY - _this.disY;
				if ( l < 0 ) {
					l = 0;
				}
				if ( l > _this.scroll.offsetHeight - _this.roll.offsetHeight ) {
					l = _this.scroll.offsetHeight - _this.roll.offsetHeight;
				}
				_this.roll.style.top = l + 'px';
				var scale = l/(_this.scroll.offsetHeight - _this.roll.offsetHeight);
				_this.musicList.style.top = scale * (295 - _this.musicList.scrollHeight) + 'px';
			};
			document.onmouseup = function () {
				document.onmousemove = document.onmouseup = null;
			};
		};
		
		
		myWheel(this.playList,fn);
		
		function fn(o) {
			var t = _this.roll.offsetTop;
		    if (o) {
		    	//向上滚动
		    	t -= 5;
		    	if ( t < 0 ) {
					t = 0;
				} 
		    } else {
		    	//向下滚动
		    	t += 5;
		    	if ( t > _this.scroll.offsetHeight - _this.roll.offsetHeight ) {
					t = _this.scroll.offsetHeight - _this.roll.offsetHeight;
				}
		    }
		    _this.roll.style.top = t + 'px';
		    var scale = t /( _this.scroll.offsetHeight - _this.roll.offsetHeight);	
			_this.musicList.style.top = scale * (295 - _this.musicList.scrollHeight) + 'px';
		}
		
		
		//判断是哪个浏览器 对应添加事件
		function myWheel(obj,callBack) {
			if ( window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
				obj.addEventListener('DOMMouseScroll',whellFn);//chrome IE
			} else {
				obj.addEventListener('mousewheel',whellFn);//ff
			}
			function whellFn(ev) {
			    var down;
			    if (ev.wheelDelta) {
			    	down = ev.wheelDelta > 0 ? true : false;//chrome ie
			    } else {
			    	down = ev.detail < 0 ? true : false;//ff
			    }
			    if ( callBack && typeof callBack == 'function' ) {
			    	callBack(down);
			    }
			}
		}
	};
	
	var c = new ctrol();
	c.init();
	
})();
