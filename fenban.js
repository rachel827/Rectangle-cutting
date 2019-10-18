;(function($, window, document,undefined) {
	Array.prototype.remove=function(dx){
		if(isNaN(dx)||dx>this.length){
			return false;
		}
		for(var i=0,n=0;i<this.length;i++){
			if(this[i]!=this[dx]){
				this[n++]=this[i]
			}else{
				this[i-1] += this[i]
			}
		}
		this.length-=1
	};
	Array.prototype.insert = function (index, item) {
		this[0]=0;
		this.splice(index, 0, item);
	};

	var Fenban = function(ele, opt) {
		this.$element = ele,
			this.defaults = {
				'zongfen': '100',
				'data': [],
				'list':[],
				'param':{},//系统参数设置，contentB,contentC,contentD,contentE
				'type':'1',//1是分班分数线，2是奖项分数线
				'widths' : [],
				_target:null,
				ismove:false,
				isactives:false,
				addWidth:0
			},
			this.options = $.extend({}, this.defaults, opt),
			this.initfenshu=function(){
				if(this.options.zongfen>0){
					var zongshu = Math.ceil(this.options.zongfen/10);
					for(var i = 1 ; i <= 10 ; i++){
						if(10 == i){
							$(".fenshu tr:eq(0)").append('<td style="text-align:right;">'+this.options.zongfen+'</td>');
						}else if(1 == i){
							$(".fenshu tr:eq(0)").append('<td style="text-align:right;">'+zongshu*i+'</td>');
						}else{
							$(".fenshu tr:eq(0)").append('<td style="text-align:right;">'+zongshu*i+'</td>');
						}

					}

				}
			},
			this.initinfo=function(){
				var _this = this;
				if(_this.options.data.length<1){
					_this.add(2);
					return;
				}
				$(_this.options.data).each(function(index){
					console.log(index);
					console.log(index);
					if(index== 0){
						if(this.score != 0){
							_this.options.widths.push(this.score*($(".fenshu").width()-21)/_this.options.zongfen);
							$("div.bans div:eq(0)").css("width",this.score*($(".fenshu").width()-21)/_this.options.zongfen);
						}else{
							_this.options.widths.push(0);
						}

						if(_this.options.data.length == 1){
							_this.add(1,_this.options.zongfen-this.score,this.name,this.peopleCount,this.id,this.context_A,this.context_B);//只有一条数据的时候，生成数据
						}


					}else{

						if(_this.options.data.length-1 == index){
							if(this.score==_this.options.zongfen){
								return false;
							}else{
								_this.add(1,this.score-_this.options.data[index-1].score,_this.options.data[index-1].name,_this.options.data[index-1].peopleCount,_this.options.data[index-1].id,_this.options.data[index-1].context_A,_this.options.data[index-1].context_B);
								_this.add(1,_this.options.zongfen-this.score,this.name,this.peopleCount,this.id,this.context_A,this.context_B);//生成最后最后一个

							}
						}else{
							_this.add(1,this.score-_this.options.data[index-1].score,_this.options.data[index-1].name,_this.options.data[index-1].peopleCount,_this.options.data[index-1].id,_this.options.data[index-1].context_A,_this.options.data[index-1].context_B);
						}

					}
				});

			},
			this.calfenshu=function (newban){
				var _this=this;
				var index=this.getindexbyobj(newban);
				var score = (_this.calarray(index)*_this.options.zongfen/($(".fenshu").width()-21)).toFixed(1);
				newban.find('div:eq(0)').text(score);

				var num=0;

				if((index-1) == (_this.options.data.length-1)) {
					for (var x = 0; x < _this.options.list.length; x++) {
						if(score<parseFloat(_this.options.list[x].score) && score<parseFloat(_this.options.zongfen)){
							num+=_this.options.list[x].count;
						}else if(score==parseFloat(_this.options.list[x].score)){
							num+=_this.options.list[x].count;
						}else if(score==parseFloat(_this.options.zongfen)) {
							num+=_this.options.list[x].count;
						}else{
							continue;
						}

					}
				}else{
					if(index != -1){
						for(var y=0;y<_this.options.list.length;y++){
							if(score<parseFloat(_this.options.list[y].score) && parseFloat(_this.options.list[y].score)<parseFloat(_this.options.data[index].score)){
								num+=_this.options.list[y].count;
							}else if(score==parseFloat(_this.options.list[y].score)){
								num+=_this.options.list[y].count;
							}else{
								continue;
							}

						}
					}else{

					}

				}
				//console.log(num);
				newban.find('div:eq(1)').find('div:eq(0)').text(num+'人');


			},
			this.getindexbyobj=function(newban){
				return $(".bans").children("div").index(newban);
			},
			this.calarray=function (index){
				var total = 0 ;
				for(var i = 0 ; i < index ; i++){
					total += this.options.widths[i]
				}
				return total;
			},
			this.banmouseover=function(e){
				if($("input:focus").length>0){
					$(e.target).css("cursor","default");
					return;
				}else{
					var _this =this;
					_this.options.isactives = false;
					if($(e.target).hasClass('cursorPointer')){
						$(e.target).css("cursor","pointer ");
					}

					var _td = $(e.target).closest(".ban")[0];
					if(Math.abs($(e.target).offset().left-e.clientX) < 1 && $(_td).prev('div').length>0 && !_this.options.ismove){
						_this.options._target = $(_td).prev();
						_this.options.isactives = true;
						$(e.target).css("cursor","w-resize");
					}
					if(Math.abs($(e.target).offset().left+$(e.target).width()-e.clientX) < 1 && !!$(_td).next('.ban').length>0 && !_this.options.ismove){
						_this.options.isactives = true;
						$(e.target).css("cursor","w-resize");
						_this.options._target =  _td;

					}
				}

			},
			this.caleverban=function(){
				var _this =this;
				$(".bans .ban").each(function(i,a){
					_this.calfenshu($(a));
				});
				_this.options.data=_this.getData();
			},
			this.mousedown = function(e1){
				var _this = this;
				if(_this.options.isactives){
					_this.options.ismove = true;
					var index = this.getindexbyobj(_this.options._target);
					if(index == -1){
						return;
					}
					var _width = _this.options.widths[index]+0;
					var next_width =_this.options.widths[index+1]+0;
					$(document).unbind('mousemove');
					$(document).mousemove(function(e2){
						if(_this.options.ismove){
							if(_this.getindexbyobj(_this.options._target) != 0 && _width+e2.clientX-e1.clientX < 1){
								return;
							}
							if(next_width-e2.clientX+e1.clientX < 1){
								return;
							}
							if(_this.getindexbyobj(_this.options._target) == 0 && _width+e2.clientX-e1.clientX < 0){
								return;
							}
							//					alert(1);
							if(e2.clientX-e1.clientX > 0){
								_this.options.widths[index] = _width+e2.clientX-e1.clientX;
								_this.options.widths[index+1] = next_width-e2.clientX+e1.clientX;
								$(_this.options._target).next('.ban').css("width",next_width-e2.clientX+e1.clientX);
								$(_this.options._target).css("width",_width+e2.clientX-e1.clientX);
							}else{
								_this.options.widths[index] = _width+e2.clientX-e1.clientX;
								_this.options.widths[index+1] = next_width-e2.clientX+e1.clientX;
								$(_this.options._target).css("width",_width+e2.clientX-e1.clientX);
								$(_this.options._target).next('.ban').css("width",next_width-e2.clientX+e1.clientX);

							}
							_this.options.addWidth=_this.options.widths[0];
							_this.caleverban();
						}

					});
					$(document).mouseup(function(e2){
						_this.options.ismove = false;
						$(document).unbind('mousemove');
					})
				}
			},
			this.init=function() {
				$('#cotent').html('<div style="position: absolute;width: 1px;height:100px;background-color: #fff;right: 0"></div><table cellspacing=0 cellpadding=0 style="width:100%;">'+
					'<tr><td style="width:20px;border-right: 1px solid gray;">'+
					'</td>'+
					'<td>'+
					'<div class="bans" style="height:100px;width:100%;">'+
					'<div style="background-color: white;"></div>'+
					'</div>'+
					'</td>'+
					'</tr>'+
					'</table>'+
					'<table class="fenshu" cellspacing=0 cellpadding=0 style="width:800px;font-size: 12px;border-top: 1px solid gray;table-layout:fixed;">'+
					'<tr style="height:20px;"><td style="height:20px;width:20px;border-right: 1px solid gray;"></td>'+
					'</tr>'+
					'</table>');
				var _this=this;
				_this.options.widths=[];
				var myarr=_this.options.data;
				var arr=[];
				for(var i=0;i<myarr.length;i++){
					arr.push(myarr[i].score)
				}
				var _this=this;
				var num=0;
				for(var i=0;i<arr.length;i++){
					if(i == (arr.length-1)){
						num=0;
						for(var x=0;x<_this.options.list.length;x++){
							if(parseFloat(arr[i])<parseFloat(_this.options.list[x].score) && parseFloat(arr[i])<parseFloat(_this.options.zongfen)){
								num+=_this.options.list[x].count;
							}else if(parseFloat(arr[i])==parseFloat(_this.options.list[x].score)){
								num+=_this.options.list[x].count;
							}else if(parseFloat(arr[i])==parseFloat(_this.options.zongfen)) {
								num+=_this.options.list[x].count;
							}else{
								continue;
							}
						}
					}else{
						num=0;
						for(var y=0;y<_this.options.list.length;y++){
							if(parseFloat(arr[i])<parseFloat(_this.options.list[y].score) && parseFloat(_this.options.list[y].score)<parseFloat(arr[i+1])){
								num+=_this.options.list[y].count;
							}else if(parseFloat(arr[i])==parseFloat(_this.options.list[y].score)){
								num+=_this.options.list[y].count;
							}else{
								continue;
							}

						}
					}
					console.log('num'+num)
					_this.options.data[i].peopleCount=num;

				};
				console.log(_this.options.data);
				_this.initfenshu();
				_this.initinfo();
				$(document).mousedown(function(e1){
					_this.mousedown(e1);
				});
				$(document).mouseup(function(){
					_this.options.ismove = false;
				});

			},
			this.changename = function(e){
				var name = $(e).text();
				$(e).empty();
				var $input = $('<input value="'+name+'" />');
				$input.blur(function(){
					var $div = $(this).parent();
					$div.empty();
					$div.text($(this).val());
				});
				$(e).append($input);
				$input.focus();
			},
			this.changescore = function(e){
				var _this = this;
				_this.options.ismove=false;
				var score = $(e).text();
				$(e).empty();
				var $input = $("<input type=\"text\" style=\"width:50px;\"  value="+score+">");
				$input.select();
				var index=$(e).parent().index();
				var datas=_this.getData();
				$input.keyup(function(){
					var _value = $(this).val();
					var reg = /^([1-9]\d*|0)+(\.\d{1})?$/;
					if (!reg.test(_value)) {
						var newValue=_value.replace(/[^\d|.]/g, '');
						$(this).val(newValue)
						return false;
					}
				});
				$input.blur(function(){
					if(!$(this).val()){$(this).val(0)};
					var dValue=parseFloat(Math.ceil(1/(($(".fenshu").width()-21)/_this.options.zongfen)*10)/10).toFixed(1);
					if(index == 1){
						if(datas.length==1){   //只有一个班时
							var $div = $(this).parent();
							$div.empty();
							$div.text($(this).val());
							_this.options.data[index-1].score=$(this).val();
							_this.init();
							return;
						}
						if($(this).val()>parseFloat(datas[index].score)-parseFloat(dValue)){
							Alert('分数应小于'+parseFloat(datas[index].score)-parseFloat(dValue));
							var $div = $(this).parent();
							$div.empty();
							$div.text(score);
						}else if($(this).val()<0){
							Alert('分数不能小于0');
							var $div = $(this).parent();
							$div.empty();
							$div.text(score);
						}else{
							var $div = $(this).parent();
							$div.empty();
							$div.text($(this).val());
							_this.options.data[index-1].score=$(this).val();
							_this.init();

						}
					}else if(index == datas.length){
						console.log(_this.options.data)

						if($(this).val()>parseFloat(_this.options.zongfen)){
							Alert('分数不能大于'+_this.options.zongfen);
							var $div = $(this).parent();
							$div.empty();
							$div.text(score);
						}else if($(this).val()<parseFloat(datas[index-2].score)+parseFloat(dValue)){
							Alert('分数应大于'+(parseFloat(datas[index-2].score)+parseFloat(dValue)));
							var $div = $(this).parent();
							$div.empty();
							$div.text(score);
						}else{
							var $div = $(this).parent();
							$div.empty();
							$div.text($(this).val());
							_this.options.data[index-1].score=$(this).val();
							_this.init();

						}
					}else{
						console.log(_this.options.data)
						if($(this).val()>parseFloat(datas[index].score)-parseFloat(dValue)){
							Alert('分数应小于'+(parseFloat(datas[index].score)-parseFloat(dValue)));
							var $div = $(this).parent();
							$div.empty();
							$div.text(score);
						}else if($(this).val()<parseFloat(datas[index-2].score)+parseFloat(dValue)){
							Alert('分数应大于'+(parseFloat(datas[index-2].score)+parseFloat(dValue)));
							var $div = $(this).parent();
							$div.empty();
							$div.text(score);
						}else{
							var $div = $(this).parent();
							$div.empty();
							$div.text($(this).val());
							_this.options.data[index-1].score=$(this).val();

							_this.init();


						}
					}

				});
				document.onkeydown = function(e){
					var ev = document.all ? window.event : e;
					if(ev.keyCode==13) {
						$input.blur();
					}
				};
				$(e).append($input);
				$input.focus();
			}

	};

	var ue1,ue2;
	Fenban.prototype.add=function(type,fs,name,num,id,texta,textb){
		var $width,newban,_this=this;
		if(type != 1){
			if(_this.options.widths.length>0 && _this.options.widths[0] < 1){
				Alert('添加失败,没有足够的空间可以添加');
				return;
			}else{
				if(_this.options.widths.length<1)
					_this.options.widths[0]= $(".bans").width();
				newban = $('<div class="ban" data-id="'+(id || "")+'" style="width:'+_this.options.widths[0]+'px;">'+
					'<div style="border-right: 1px solid #3f82c8;"><div style="height:25px;width:100%;">0人</div>'+
					'</div></div>');
				var $score=$('<div style="height:50px;width:100%;text-align:left;"></div>').prependTo(newban);
				var $name = $('<div class="cursorPointer"  style="height:25px;width:100%;">名称</div>').appendTo(newban.children('div:eq(1)'));
				if(_this.options.type == '1'){
					console.log('分班')
					var $aText = $('<div class="aText"  style="display: none">'+_this.options.param.contentB+'</div>').appendTo(newban);
					var $bText = $('<div class="bText"  style="display: none">'+_this.options.param.contentC+'</div>').appendTo(newban);
				}
				if(_this.options.type == '2'){
					console.log('奖项')
					var $aText = $('<div class="aText"  style="display: none">'+_this.options.param.contentD+'</div>').appendTo(newban);
					var $bText = $('<div class="bText"  style="display: none">'+_this.options.param.contentE+'</div>').appendTo(newban);
				}

				$name.dblclick(function(){
					_this.changename(this)
				});
				$score.dblclick(function(){
					_this.changescore(this)
				});
				_this.options.widths.insert(1,_this.options.widths[0]);
				var obj={
					"score":(_this.options.widths[0]*_this.options.zongfen/($(".fenshu").width()-21)).toFixed(1)
				}
				_this.options.data.insert(1,obj);

				$(".bans div:eq(0)").width(0);
				$(".bans div:eq(0)").after(newban);
				_this.options.data=_this.getData();
			}
		}else{
			console.log(name)
			console.log(texta)
			console.log(textb)
			$width = fs*($(".fenshu").width()-21)/_this.options.zongfen;
			_this.options.widths.push($width);

			newban = $('<div class="ban" data-id="'+(id || "")+'" style="width:'+$width+'px;">'+
				'<div style="border-right: 1px solid #3f82c8;"><div style="height:25px;width:100%;">'+num+'人</div>'+
				'</div></div>');
			var $score=$('<div  style="height:50px;width:100%;text-align:left;"></div>').prependTo(newban);
			var $name = $('<div class="cursorPointer"  style="height:25px;width:100%;">'+name+'</div>').appendTo(newban.children('div:eq(1)'));
			var $aText = $('<div class="aText"  style="display: none">'+texta+'</div>').appendTo(newban);
			var $bText = $('<div class="bText"  style="display: none">'+textb+'</div>').appendTo(newban);
			$name.dblclick(function(){
				_this.changename(this)
			});
			$score.dblclick(function(){
				_this.changescore(this)
			});
			newban.appendTo($("div.bans"));
		}
		var index;
		ue1 = UE.getEditor('editor1',{
			topOffset: 0,
			autoFloatEnabled: false,
			autoHeightEnabled: false,
			autotypeset: {
				removeEmptyline: true
			},
			toolbars: [["source", "forecolor", "backcolor", "bold", "italic", "underline", "strikethrough", "fontborder", "paragraph", "fontfamily", "fontsize", "fullscreen", "undo", "redo", "indent", "justifyleft", "justifyright", "justifycenter", "justifyjustify", "insertorderedlist","inserttable", "edittable", "edittd", "insertparagraphbeforetable", "insertrow", "insertcol", "mergeright", "mergedown", "deleterow", "deletecol", "splittorows", "splittocols", "splittocells", "deletecaption", "inserttitle", "mergecells", "deletetable","spechars", "rowspacingtop", "rowspacingbottom", "imagenone", "imagecenter", "superscript" ]]
		});
		ue2 = UE.getEditor('editor2',{
			topOffset: 0,
			autoFloatEnabled: false,
			autoHeightEnabled: false,
			autotypeset: {
				removeEmptyline: true
			},
			toolbars: [["source", "forecolor", "backcolor", "bold", "italic", "underline", "strikethrough", "fontborder", "paragraph", "fontfamily", "fontsize", "fullscreen", "undo", "redo", "indent", "justifyleft", "justifyright", "justifycenter", "justifyjustify", "insertorderedlist","inserttable", "edittable", "edittd", "insertparagraphbeforetable", "insertrow", "insertcol", "mergeright", "mergedown", "deleterow", "deletecol", "splittorows", "splittocols", "splittocells", "deletecaption", "inserttitle", "mergecells", "deletetable","spechars", "rowspacingtop", "rowspacingbottom", "imagenone", "imagecenter", "superscript" ]]
		});

		newban.mouseover(function(e){
			_this.banmouseover(e);
		}).click(function(){
			console.log(_this.options.data)
			var curIndex=$('#cotent .bans').children('.actives').eq(0).index();

			if(curIndex!= -1){
				_this.options.data[curIndex-1].context_A=ue1.getContent();
				_this.options.data[curIndex-1].context_B=ue2.getContent();
				$('#cotent .bans').children('.actives').eq(0).find('.aText').eq(0).html(_this.options.data[curIndex-1].context_A);
				$('#cotent .bans').children('.actives').eq(0).find('.bText').eq(0).html(_this.options.data[curIndex-1].context_B)

				console.log(_this.options.data)
			}
			if(!$(this).hasClass("actives")){
				$(this).parent().children("div").removeClass("actives");
				$('#edtitorBox').css("display",'block');
				index=$(this).index()-1;

				if(_this.options.data[index].context_A){
					ue1.ready(function() {
						ue1.setContent(_this.options.data[index].context_A, false)
					});

				}else{
					ue1.ready(function() {
						ue1.setContent("", false)
					});

				}
				if(_this.options.data[index].context_B){
					ue2.ready(function() {
						ue2.setContent(_this.options.data[index].context_B, false)
					});

				}else{
					ue2.ready(function() {
						ue2.setContent("", false)
					});

				}



			}else{
				$('#edtitorBox').css("display",'none')
			}
			$(this).toggleClass("actives");
		});
		this.calfenshu(newban);

	};


	Fenban.prototype.del=function del(){
		if($(".bans .actives").length > 0){
			var index = this.getindexbyobj($(".bans .actives")[0]);
			var $pre = $(".actives").prev('div')
			$('#edtitorBox').css("display",'none')
			$(".actives").remove();
			$pre.width(this.options.widths[index]+this.options.widths[index-1]);
			this.options.widths.remove(index);
			console.log(JSON.stringify(this.options.data))
			console.log(index)
			this.options.data.remove(index-1);
			console.log(JSON.stringify(this.options.data))
			this.caleverban();
		}
	};

	Fenban.prototype.getData=function(){
		var curIndex=$('#cotent .bans').children('.actives').eq(0).index();
		if(curIndex!= -1){
			this.options.data[curIndex-1].context_A=ue1.getContent();
			this.options.data[curIndex-1].context_B=ue2.getContent();
			$('#cotent .bans').children('.actives').eq(0).find('.aText').eq(0).html(this.options.data[curIndex-1].context_A);
			$('#cotent .bans').children('.actives').eq(0).find('.bText').eq(0).html(this.options.data[curIndex-1].context_B)
			console.log(this.options.data)
		}
		var resultdata = [];
		$(".bans").children(".ban").each(function(){
			var peoplecount=$(this).find("div:eq(1) > div:eq(0)").text();
			resultdata.push(
				{
					id:$(this).data('id'),
					name:$(this).find("div:eq(1) > div:eq(1)").text(),
					peopleCount:peoplecount.substring(0,peoplecount.length-1),
					score:$(this).children("div:eq(0)").text(),
					context_A:$(this).find('.aText').eq(0).html(),
					context_B:$(this).find('.bText').eq(0).html()
				}
			);
		});
		return resultdata;
	};


	$.fn.fenban = function(options) {
		var fenban  = new Fenban(this, options)
		fenban.init();
		return fenban;
	};


})(jQuery, window, document);
