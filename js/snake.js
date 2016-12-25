(function () {
	/* 总体思路：
		1. 
		2.
		3.创建空的二维数组容器，二维中的每一项都是undefined
		4.创建一个数据层面的二维数组，目的就是用来做碰撞检测的
		5.设定范围scope函数，用来限制随机物品出现的坐标
		6.
	*/
	
	//给span加颜色
	var color = ['#81ff9c','#f72ab5','#e8ff10','#20f5f8'];
	var span = document.querySelectorAll('.left span');
	
	span = Array.from(span);
	span.forEach(function (item,i) {
		item.style.background = color[i];
	})
	//---------------------------------------------------------------------
	//变量声明
	var mapX = 20,mapY = 20;
	var snakeData = creatArr(mapX,mapY);
	var mapData = creatArr(mapX,mapY);
	//蛇的属性
	var snake = [];//[[x,y],[x,y],[x,y]]
	var len = 3;//蛇的长度
	var speed = 10;//蛇的速度
	//声明定时器
	var snakeTimer = 0;
	var direction = 39;
	var flag = true;
	var speedTimer = null;
	var oldSpeed = 0;
	
	var skateTimer = [];
	var breakTimer = [];
	var score = document.getElementById('score');
	var startGame = document.getElementById('start');
	var closeGame = document.getElementById('close');
	var snakeD = document.getElementById('snake');
	console.log(snakeD);
	//---------------------------------------------------------------------	
	//初始化函数
	clearInterval(snakeTimer);
	creatMap(mapX,mapY);
	startGame.onclick = start;
	//游戏关闭
	closeGame.onclick = function () {
		startGame.onclick = start;
		clearInterval(snakeTimer);
		skateTimer.forEach(function (item) {
			clearTimeout(item);
		});
		breakTimer.forEach(function (item) {
			clearTimeout(item);
		});
		clear();
		mTween(snakeD,{top: -800},600,'linear',function () {
			snakeD.style.display = 'none';
		});
	}
	
//	snakeData[p[0]][p[1]].className = 'snake'; 
	function start() {
		this.onclick = null;
		clear();//用来清除所有的样式
		initSnake();
		walk();
		addObj('food');
		addToy();
	}
	//---------------------------------------------------------------------	
	//需求一：生成地图
	function creatMap(x,y) {
		var map = document.getElementById('map');
		var table = document.createElement('table');
		table.cellSpacing = 0;
		table.cellPadding = 0;
		var tbody = table.createTBody();
		
		for ( var i = 0; i < x; i++ ) {
			var tr = document.createElement('tr');
			for ( var j = 0; j < y; j++ ) {
				var td = document.createElement('td');
				snakeData[i][j] = tr.appendChild(td);
				
			}
			tbody.appendChild(tr);
		}
		
		table.appendChild(tbody);
		map.appendChild(table);
	}

	//需求二：创建二维数组
	function creatArr(x,y) {
		var arr = new Array(x);
		for ( var i = 0; i < x; i++ ) {
			arr[i] = new Array(y);
		}
		return arr;
	}

	//需求三：设定范围
	function scope(startX,startY,endX,endY) {
		startX = startX || 0;
		startY = startY || 0;
		endX = endX || mapX - 1;
		endY = endY || mapY - 1;
		var p = [],
			x = rP([startX,endX]),
			y = rP([startY,endY]);
		p.push(x,y);
		//用来判断这个点生成的位置是否有物品，如果有就重复执行上面的代码
		if ( mapData[x][y] ) {
			return scope(startX,startY,endX,endY);
		}
		return p;
	}

	//需求四：编写随机函数
	function rP(arr) {
		var max = Math.max.apply(null,arr);
		var min = Math.min.apply(null,arr);
		return Math.round(Math.random() * (max - min) + min);
	}

	//需求五：生成小蛇
	function initSnake() {
		//找到一个随机的点，但是这个点必须符合指定的范围，不能撞墙，也不能截取
		var p = scope(0,2,mapX - 1,parseInt(mapY/2));
		for ( var i = 0; i < len; i++ ) {
			var x = p[0];//某一行
			var y = p[1] - i;//某一列中  挨着的 3个td
			snake.push([x,y]);
			//放到蛇的数组中，这样这个数组就存了三个挨着的点
			snakeData[x][y].className = 'snake';//绘制蛇
			mapData[x][y] = 'snake';//在数据层面注册蛇的数据
		}
	}
	
	//需求6：让蛇走起来
	function walk() {
		clearInterval(snakeTimer);
		snakeTimer = setInterval(step,5000/speed);
	}
	
	//需求7：控制蛇的运动
	function step() {
		var headX = snake[0][0],
		headY = snake[0][1];
		
		
		switch(direction) {
			case 37:
				headY -= 1;
				break;
			case 38:
				headX -= 1;
				break;
			case 39:
				headY += 1;
				break;
			case 40:
				headX += 1;
				break;
		}
		if ( headX < 0 || headX > mapX - 1 || headY < 0 || headY > mapY - 1 || mapData[headX][headY] == 'snake' || mapData[headX][headY] == 'block') {
			clearInterval(snakeTimer);
			skateTimer.forEach(function (item) {
				clearTimeout(item);
			});
			breakTimer.forEach(function (item) {
				clearTimeout(item);
			});
			alert('haha,你死了~~~');
			startGame.onclick = start;
			return;
		}
		
		if ( len%4 == 0 && len < 55 && mapData[headX][headY] == 'food' ) {
			speed += 5;
			walk();
		}
		
		if ( len%9 == 0 && len < 60 && mapData[headX][headY] == 'food') {
			addObj('block');
		}
		
		if ( mapData[headX][headY] == 'skate' ) {
			speed += 15;
			walk();
		}
		
		if ( mapData[headX][headY] == 'break' ) {
			speed = 10;
			walk();
		}
		
		if (mapData[headX][headY] == 'food') {
			addObj('food');
			mapData[headX][headY] = true;
		}
		
		if ( !mapData[headX][headY] ) {
			var lastX = snake[snake.length - 1][0],
				lastY = snake[snake.length - 1][1];
			snakeData[lastX][lastY].className = '';
			snake.pop();
			mapData[lastX][lastY] = false;
		}
		
		snake.unshift([headX,headY]);
		snakeData[headX][headY].className = 'snake';
		mapData[headX][headY] = 'snake';
		len = snake.length;
		score.innerHTML = (len - 3) * 10;
		
		flag = true;
		
	}
	
	//需求8：控制方向
	document.onkeydown = function (e) {
		var e = e || window.event;
		if ( !flag ) {
			return;
		}
		flag = false;
		if ( e.keyCode > 36 && e.keyCode < 41 && Math.abs(e.keyCode - direction) != 2 ) {
			direction = e.keyCode;
		}	
		return false;
}
	
	//控制9：添加的随机的物品
	function addObj(name) {
		var p = scope();
		snakeData[p[0]][p[1]].className = name;
		mapData[p[0]][p[1]] = name;
	}

	//需求10：添加随机数量的滑板和刹车
	function addToy() {
		var skateNum = rP([6,10]);
		var breakNum = rP([4,6]);
		for ( var i = 0; i < skateNum; i++ ) {
			skateTimer.push(setTimeout(function () {
				addObj('skate');
			},rP([8000,120000])))
		}
		for ( var i = 0; i < breakNum; i++ ) {
			breakTimer.push(setTimeout(function () {
				addObj('break');
			},rP([10000,160000])))
		}
	}
	
	//需求11：清楚地图
	function clear() {
		snakeData.forEach(function (item) {
			item.forEach(function (item) {
				item.className = '';
			})
		})
		snake = [];
		len = 3;
		mapData = creatArr(mapX,mapY);
		direction = 39;
		flag = true;
		speed = 10;
		score.innerHTML = 0;
	}




})();