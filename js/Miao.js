$width=$("#text").width();
$height=$("#text").height();
$topbar='<div id="topbar" style="display:flex;width:100vw;height:60px;background:#45526f"></div>';
$editor='<div id="miaoeditor" style="display:block;float:left;width:47vw;height:100%;padding:0 1.5vw"></div>';
$preview='<div id="miaopreview" style="display:block;float:left;width:47vw;height:100%;padding:0 1.5vw;overflow-y: auto;"><span></span></div>';
$start="<div id=\"miao\" style='width:100vw;height:100vh;background:#d9d9d9'>"
$end="</div>"
$leftmenu='<nav id="miao-menu"><ul><li class="wmd-button" id="miao-bold" title="加粗"><i class="fa fa-bold"></i></li><li class="wmd-button" id="miao-italic" title="斜体"><i class="fa fa-italic"></i></li><li class="wmd-button" id="miao-link" title="链接"><i class="fa fa-link"></i></li><li class="wmd-button" id="miao-quote" title="引用"><i class="fa fa-quote-left"></i></li><li class="wmd-button" id="miao-code" title="代码"><i class="fa fa-code"></i></li><li class="wmd-button" id="miao-image" title="图片"><i class="fa fa-image"></i></li><li class="wmd-button" id="miao-heading" title="标题"><i class="fa fa-header"></i></li><li class="wmd-button" id="miao-hr" title="分割线"><i class="fa fa-arrows-h"></i></li><li class="wmd-button" id="miao-more" title="摘要分割线"><i class="fa fa-pagelines"></i></li><li class="wmd-button" id="miao-undo" title="undo - Ctrl+Z"><i class="fa fa-undo"></i></li><li class="wmd-button" id="miao-redo" title="redo - Ctrl+Y"><i class="fa fa-repeat"></i></li><li class="wmd-button" id="miao-save" title="保存到本地缓存 Ctrl + S"><i class="fa fa-save"></i></li><li class="wmd-button" id="miao-load" title="从缓存导入 Ctrl + U"><i class="fa fa-upload"></i></li></ul></nav>';
$rightmenu='<nav id="miao-menu2"><li id="miao-exit">切回</li><li id="miao-theme">主题</li><li id="miao-lang">语言</li><li id="miao-font">字体</li></nav>';
$html=$start+$topbar+$editor+$preview+$end;
const layer = layui.layer;
var s=" ",editor;
function ps(s1,s2){
	editor.insert(s1);
	editor.find(s2);
	editor.focus();
}
function miaoButton(){
	$("#miao-link").click(function(){
		ps("[链接名][编号]","");
		editor.setValue(editor.getValue()+"\n[编号]:链接 \"描述\"\n",1);
	});
	$("#miao-image").click(function(){
		ps("![图片名][编号]","");	
		editor.setValue(editor.getValue()+"\n[编号]:链接 \"描述\"\n",1);
	});
	$("#miao-bold").click(function(){
		ps("**加粗部分**","加粗部分")
		});
	$("#miao-italic").click(function(){
		ps("*斜体文字*","斜体文字")
	});
	$("#miao-quote").click(function(){
		ps("> 引用文字","引用文字")	
	});
	$("#miao-code").click(function(){
		ps("```\n代码部分\n```\n","代码部分");	
	});
	$("#miao-heading").click(function(){
		ps("## 标题文字 ##","标题文字");
	});
	$("#miao-hr").click(function(){
		ps("----------\n","");	
	});
	$("#miao-more").click(function(){
		ps("<!--more-->\n\n\n","");
	});
	$("#miao-undo").click(function(){
		editor.undo();	
	});
	$("#miao-redo").click(function(){
		editor.redo();
	});
	$("#miao-save").click(function(){
		$.cookie('miao-cookie', editor.getValue(), { expires: catdate });
		layer.msg('保存成功', {icon: 1});
	});
	$("#miao-load").click(function(){
		layer.confirm('这将会覆盖当前内容，确认加载？', {
			  title:null,
			  btn: ['Yes','No'] //按钮
			}, function(){
			editor.setValue($.cookie('miao-cookie'));
			layer.msg('加载完成', {icon: 1});
			}, function(){
				layer.msg("已取消", {icon: 0});
		});
	});
	$("#miao-font").click(function(){
		layer.prompt({
		  formType: 0,
		  value: catfontsize,
		  title: '请输入要切换的字体大小'
		}, function(value, index, elem){
		  catfontsize=value.toLowerCase();
			try {
			  editor.setFontSize(catfontsize);
			  layer.msg("切换字体大小到"+catfontsize+"成功", {icon: 1});
			}
			catch(err) {
			    layer.msg("失败，请检查拼写是否正确", {icon: 0});
			}
		  layer.close(index);
		});	
	});
	$("#miao-lang").click(function(){
		layer.prompt({
		  formType: 0,
		  value: catlang.toLowerCase(),
		  title: '请输入要切换的语言'
		}, function(value, index, elem){
		  catlang=value.toLowerCase();
			try {
			  editor.getSession().setMode("ace/mode/"+catlang);
			  layer.msg("切换语言到"+catlang+"成功", {icon: 1});
			}
			catch(err) {
			    layer.msg("失败，请检查拼写是否正确", {icon: 0});
			}
		  layer.close(index);
		});	
	});
	$("#miao-theme").click(function(){
		var dex=layer.confirm('切换主题', {
		  btn: ['深色','浅色'] ,
		  title:null
		}
		, function(){
			console.log(1);
		  editor.setTheme("ace/theme/monokai");
		  layer.close(dex);
		}, function(){
			console.log(2);
		  editor.setTheme("ace/theme/xcode");
		});
	});
	$("#miao-exit").click(function(){
			$("#text").val(editor.getValue());
			$('.typecho-head-nav.clearfix').show();
			$('.main').show();
			$('.typecho-foot').show();
			$('#miao').hide();
			$('#miaoeditor').hide();
	});
}
function correct(str){
	var x=$.ajax({
	  type: 'POST',
	  url: "/index.php/miaoapi",
	  data: {'text':str},
	  success: function(data){
	  	var vec=data.item.vec_fragment
		var len=vec.length;
	  	console.log(len);
		for(var i=0;i<len;i++){
			editor.search(vec[i].ori_frag);
			editor.highlightSelectedWord();
		}
	  },
	  dataType: "json"
	});
}
function changeEditor(){
	$('.typecho-head-nav.clearfix').hide();
	$('.main').hide();
	$('.typecho-foot').hide();
	$('#miao').show();
	$('#miaoeditor').show();
	editor.setValue($("#text").val(),1);
	$('#miaopreview span').html(marked("\n\n\n > 已开启智能沉浸，享受写作的快感吧\n -  如需插入图片,建议先返回上传附件并记录链接到文本框中\n -  输入任意文本，侧屏将实时渲染预览内容"));
	editor.focus();
}
window.onload = function() {
	$(".wmd-edittab").prepend("<a onclick=\"changeEditor()\">沉浸</a>");
	setTimeout(function() {
	$(".editormd-menu").append('<li><a onclick=\"changeEditor()\" title="沉浸" unselectable="on"><i class="fa fa-graduation-cap fun" name="miaoeditor" unselectable="on"></i></a></li>');
	}, 1000);
	$("body").append($html);
	$("#miaoeditor").height($("#miao").height()-$("#topbar").height());
	$("#miaopreview").height($("#miao").height()-$("#topbar").height());
	$("#topbar").append($leftmenu);
	$("#topbar").append($rightmenu);
	miaoButton();
	$('#miao').hide();
	editor = ace.edit("miaoeditor");
	ace.require("ace/ext/language_tools");
	ace.require("ace/ext/modelist");
	editor.setOptions({
	enableBasicAutocompletion: autobasicfill,
	enableSnippets: autocode,
	enableLiveAutocompletion: autofill,
	});
	editor.setTheme("ace/theme/"+cattheme.toLowerCase());
	editor.getSession().setMode("ace/mode/"+catlang.toLowerCase());
	editor.setFontSize(catfontsize);
	editor.setHighlightActiveLine(highlightnowrow);
	editor.session.mergeUndoDeltas = true; 
	editor.session.setUseWrapMode(true);
	editor.commands.addCommand({
	    name: 'miao-save-c',
	    bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
	    exec: function(editor) {
	    	$.cookie('miao-cookie', editor.getValue(), { expires: 3 });
	    	layer.msg('保存成功',{icon: 1});
	    },
	    readOnly: false 
	});
	editor.commands.addCommand({
	    name: 'miao-load-c',
	    bindKey: {win: 'Ctrl-U',  mac: 'Command-U'},
	    exec: function(editor) {
			layer.confirm('这将会覆盖当前内容，确认加载？', {
			  title:null,
			  btn: ['Yes','No'] 
			}, function(){
			editor.setValue($.cookie('miao-cookie'));
			layer.msg('加载完成', {icon: 1});
			}, function(){
				layer.msg("已取消", {icon: 0});
			});
	    },
	    readOnly: false 
	});
	marked.setOptions({
	  renderer: new marked.Renderer(),
	  highlight: null,
	  pedantic: false,
	  gfm: true,
	  breaks: true,
	  sanitize: false,
	  smartLists: true,
	  smartypants: false,
	  xhtml: false
	});
	
   editor.on("change", function(e){
   		s=editor.getValue();
    	$('#miaopreview span').html(marked(s));
    	
   });
	//setInterval("diff()","500");
}