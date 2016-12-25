(function (d) {
	
	//设置页面元素的宽高  以及简单的移入移出功能
	function lisH() {
		this.ul = d.querySelector('.leftBar');
		this.lis = this.ul.children;
		this.mRight = d.querySelector('.mRight');
		this.mLeft = d.querySelector('.mLeft');
		this.as = d.querySelectorAll('.navList a');
		this.contentRight = d.querySelector('.contentRight');
	}
	lisH.prototype = {
		init: function () {
			var _this = this;
			window.onresize = function () {
				_this.mRight.style.height = window.innerHeight - 51 + 'px';
				_this.mLeft.style.width = window.innerWidth - 160 + 'px';
				_this.mLeft.style.height = window.innerHeight - 51 + 'px';
				_this.contentRight.style.width = _this.mLeft.offsetWidth - 185 + 'px';
			};
			window.onresize();
			this.over();
			this.aOver()
		},
		over: function () {
			for ( var i = 0; i < this.lis.length; i++ ) {
				this.lis[i].onmouseover = function () {
					if ( this.className != 'navGap' && this.className != 'active') {
						this.className = 'hover';
					}
				};
				this.lis[i].onmouseout = function () {
					if ( this.className != 'navGap' && this.className != 'active' ) {
						this.className = '';
					}
				};
			}
		},
		aOver: function () {
			for ( var i = 0; i < this.as.length; i++ ) {
				this.as[i].onmouseover = function () {
					addClass(this,'active');
				};
				this.as[i].onmouseout = function () {
					removeClass(this,'active');
				};
			}
		}
	};
	var l = new lisH();
	l.init();
	
	

	function setCon() {
		this.fileList = d.querySelector('.fileList');
		this.tree = d.querySelector('.tree');
		this.treeDivs = this.tree.getElementsByTagName('div'); 
		this.title = d.querySelector('.title');
		this.num = 0;//起始页为0
		this.pos = 0;//设置树形菜单定位到哪一个上面
	}
	setCon.prototype = {
		init: function () {
			this.structure();
			this.setTree();
			this.treeCheck();
			this.treeClick();
			this.titleClick();
		},
		//渲染文件区域
		structure: function () {
			//找到id为0 的下面的所有数据
			for ( var i = 0; i < data.length; i++ ) {
				if ( data[i].pid == this.num ) {
					this.fileList.innerHTML += this.template(data[i]);
				}
			}
		},
		//生成结构的模板
		template: function (datas) {
			var html = '';
			html += `
				<div class="item" data-id="${datas.id}">
					<label class="label"></label>
					<div></div>
					<p>${datas.title}</p>
					<input type="text">
				</div>
			`
			return html;
		},
		//渲染菜单区域	
		setTree: function () {
			this.tree.innerHTML = this.treeTemplate(-1);
		},
		treeTemplate: function (id) {
			//找到当前的id找到下面有多少个pid与之对应 
			var _this = this;
			var childs = [];
			for ( var i = 0; i < data.length; i++ ) {
				if ( data[i].pid == id ) {
					childs.push(data[i]);
				}
			}
			//生成结构
			var html = '<ul>';
			childs.forEach(function (item) {
				
				var index = _this.getIndex(item.pid).length;
				//判断当前元素下是否有子元素
				for ( var i = 0; i < data.length; i++ ) {
					if ( data[i].pid == item.id ) {
						var iClass = 'iShow';
					}
				}
				
				html += `<li>
							<div class="treeTitle ${iClass}" data-id="${item.id}" style="padding-left:${(index+1)*14}px">
								<span>
									<strong>${item.title}</strong>
									<i></i>
								</span>
							</div>
							${_this.treeTemplate(item.id)}
						</li>`
			});
			html += '</ul>';
			return html;
		},
		//判断当前这个文件在第几层
		getIndex: function getIndex(pid) {
			//根据当前的pid向上查找有多少层的父级元素
			var arr = [];
			for ( var i = 0; i < data.length; i++ ) {
				if ( data[i].id == pid ) {
					arr.push(data[i]);
					arr = arr.concat(getIndex(data[i].pid));
				}
			}
			return arr;
		},
		//设置树形菜单的当前选中状态
		treeCheck: function () {
			for ( var i = 0; i < this.treeDivs.length; i++ ) {
				if ( this.treeDivs[i].getAttribute('data-id') == this.pos ) {//obj.dataset.id
					addClass(this.treeDivs[i],'active');
				}
			}
		},
		//利用时间委托 给树形菜单添加点击事件
		treeClick: function () {
			var _this = this;
			this.tree.addEventListener('click',function (ev) {
				if ( ev.target.tagName == 'STRONG' || ev.target.tagName == 'I' ) {
					var par = ev.target.parentNode.parentNode;
					_this.clickEvent(par);
				} else if ( ev.target.className == 'treeTitle' ) {
					_this.clickEvent(ev.target);
				}
			});
		},
		clickEvent: function (obj) {
			//找到当前id下有多少个子元素  渲染到fileList
			this.fileList.innerHTML = '';
			var num = obj.getAttribute('data-id');
			this.num = num;
			this.structure();

			var pidNum = this.findPid(this.num);
			//根据pid找到其所有的父级
			var arr = this.getIndex(pidNum).reverse();
			console.log(arr);
			var len = arr.length+1;
			var html = '';
			arr.forEach(function (item,i) {
				html += `<a href="javascript:;" style="z-index:${len--}" data-id="${item.id}">${item.title}</a>`;
			});
			html += `<span style="z-index: 1" data-id="${this.num}">${data[this.num].title}</span>`;
			this.title.innerHTML = html;
		},
		//根据当前的id找到其的pid
		findPid: function (num) {
			for ( var i = 0; i < data.length; i++ ) {
				if ( data[i].id == num ) {
					var pidNum = data[i].pid;
				}
			}
			return pidNum;
		},
		//点击title渲染页面  以及右侧树形菜单
		titleClick: function () {
			var _this = this;
			this.title.addEventListener('click',function (ev) {
				if ( ev.target.tagName = 'A' ) {
					_this.clickEvent(ev.target);
				}
			})
		}
	}
	
	
	
	var sC = new setCon();
	sC.init();
	
	
})(document);
