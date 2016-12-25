var rightList = [
	{
		'name': 'create',
		'title': '新建文件夹'
	},
	{
		'name': 'look',
		'title':'查看',
		child: [
			{'title': '大图标'},
			{'title': '中等图标'},
			{'title': '小图标'},
			{'title': '将图标与网格对齐'},
			{'title': '显示桌面图标'}
		]
	},
	{
		'name': 'sort',
		'title': '排序方式',
		'child': [
			{'title': '名称'},
			{'title': '大小'},
			{'title': '项目类型'},
			{'title': '修改日期'}
		]
	},
	{
		'name': 'new',
		'title': '刷新'
	},
	{
		'name': 'copy',
		'title': '黏贴'
	},
	{
		'name': 'fast',
		'title': '创建快捷方式'
	},
	{
		'name': 'screen',
		'title': '屏幕分辨率'
	},
	{
		'name': 'small',
		"title": '小工具'
	},
	{
		'name': 'own',
		'title': '个性化'
	}
];


musicData = [
	{
		name: '不潮不用花钱',
		artist: '林俊杰',
		src: 'music/林俊杰 - 不潮不用花钱.mp3'
	},
	{
		name: '还影',
		artist: '河图',
		src: 'music/河图 - 还影.mp3'
	},
	{
		name: '依山观澜(无念白)',
		artist: '河图',
		src: 'music/河图 - 依山观澜(无念白).mp3'
	},
	{
		name: '编号89757',
		artist: '林俊杰',
		src: 'music/林俊杰 - 编号89757.mp3'
	},
	{
		name: '女儿情',
		artist: '林俊杰 ',
		src: 'music/林俊杰 - 女儿情.mp3'
	},
	{
		name: '西界',
		artist: '林俊杰',
		src: 'music/林俊杰 - 西界.mp3'
	},
	{
		name: '剑三群像·江湖意',
		artist: '群星',
		src: 'music/群星 - 剑三群像·江湖意.mp3'
	},
	{
		name: '蜗牛与黄鹂鸟',
		artist: '群星',
		src: 'music/群星 - 蜗牛与黄鹂鸟.mp3'
	},
	{
		name: '痒',
		artist: '田馥甄',
		src: 'music/田馥甄 - 痒.mp3'
	},
	{
		name: '剑啸江湖',
		artist: '小曲儿',
		src: 'music/小曲儿 - 剑啸江湖.mp3'
	},
	{
		name: '演员',
		artist: '薛之谦',
		src: 'music/薛之谦 - 演员.mp3'
	},
	{
		name: '主宰',
		artist: '音频怪物',
		src: 'music/音频怪物 - 主宰.mp3'
	}
];


//用文件的pid和其父级的id进行对应
data = [
	{
		id: 0,
		pid: -1,//记录当前第几层
		title:'微云'//文件名
	},
	{
		id: 1,
		pid: 0,
		title: '我的文档'
	},
	{
		id: 2,
		pid: 0,
		title: '我的视频'
	},
	{
		id: 3,
		pid: 0,
		title: '我的音乐'
	},
	{
		id: 4,
		pid: 0,
		title: '我的图片'
	},
	{
		id: 5,
		pid: 3,
		title: '林俊杰'
	},
	{
		id: 6,
		pid: 3,
		title: '河图'
	},
	{
		id: 7,
		pid: 3,
		title: '田馥甄'
	},
	{
		id: 8,
		pid: 1,
		title: '音乐整站'
	},
	{
		id: 9,
		pid: 1,
		title: '网易云'
	},
	{
		id: 10,
		pid: 1,
		title: '淘宝'
	},
	{
		id: 11,
		pid: 5,
		title: '女儿情'
	},
	{
		id: 12,
		pid: 5,
		title: '西界'
	},
	{
		id: 13,
		pid: 5,
		title: '编号89757'
	}
]

