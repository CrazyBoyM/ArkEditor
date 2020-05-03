<?php
/**
 * 方舟编辑器
 * @package #方舟编辑器#
 * @author 方舟互联
 * @version 1.0.0
 * @link http://ip3x.com
 * 开源是为了大家共同维护与完善
 * 未经允许禁止抄袭或二次开发
 */
 
  include_once('Action.php');

class ArkEditor_Plugin implements Typecho_Plugin_Interface
{
	/**
     * 激活插件方法,如果激活失败,直接抛出异常
     * 
     * @access public
     * @return void
     * @throws Typecho_Plugin_Exception
     */
  /* 启用插件方法 */
	public static function activate(){
    // 添加按钮
    Helper::addRoute("nlp_api","/miaoapi","ArkEditor_Action",'action');
    Typecho_Plugin::factory('admin/write-post.php')->bottom = array('ArkEditor_Plugin', 'addArkEditor');
    //Typecho_Plugin::factory('Widget_Contents_Page_Edit')->bottom = array('ArkEditor_Plugin', 'positionButton');
    // 内容处理
    //Typecho_Plugin::factory('Widget_Abstract_Contents')->contentEx = array('ArkEditor_Plugin','show');
    // 摘要处理
    //Typecho_Plugin::factory('Widget_Abstract_Contents')->excerptEx = array('ArkEditor_Plugin','hide');
    // 头部插入
    //Typecho_Plugin::factory('Widget_Archive')->header = array('ArkEditor_Plugin', 'header');
    // 尾部插入
    //Typecho_Plugin::factory('Widget_Archive')->footer = array('ArkEditor_Plugin', 'footer');
    return "喵~  你好，主人";
	  }
	/**
     * 禁用插件方法,如果禁用失败,直接抛出异常
     *
     * @static
     * @access public
     * @return void
     * @throws Typecho_Plugin_Exception
     */
  public static function deactivate(){
  	  //Helper::removeRoute("nlp_api");
      return "喵~  再见，且行且珍惜";
    }
    /**
     * 获取插件配置面板
     *
     * @access public
     * @param Typecho_Widget_Helper_Form $form 配置面板
     * @return void
     */
	public static function config(Typecho_Widget_Helper_Form $form){
	$f = new Typecho_Widget_Helper_Form_Element_Text(
      'cattheme',
      null,
      'xcode',
      _t('默认主题')
    );
    $form->addInput($f);
    $f = new Typecho_Widget_Helper_Form_Element_Text(
      'catfontsize',
      null,
      '18px',
      _t('字体大小')
    );
    $form->addInput($f);
    $f = new Typecho_Widget_Helper_Form_Element_Radio(
      'highlightnowrow',
      array(
      	'0' => _t('关闭'),
      	'1' => _t('开启'),
      	),
      '0',
      _t('是否高亮当前行？'),
      null
    );
    $form->addInput($f);
    $f = new Typecho_Widget_Helper_Form_Element_Text(
      'catlang',
      null,
      'markdown',
      _t('默认语言')
    );
    $form->addInput($f);
    $f = new Typecho_Widget_Helper_Form_Element_Radio(
      'autobasicfill',
      array(
      	'0' => _t('关闭'),
      	'1' => _t('开启'),
      	),
      '0',
      _t('是否开启智能的基础补全？'),
      null
    );
    $form->addInput($f);
    $f = new Typecho_Widget_Helper_Form_Element_Radio(
      'autofill',
      array(
      	'0' => _t('关闭'),
      	'1' => _t('开启'),
      	),
      '0',
      _t('是否开启智能的动态补全？'),
      null
    );
    $form->addInput($f);
    $f = new Typecho_Widget_Helper_Form_Element_Radio(
      'autocode',
      array(
      	'0' => _t('关闭'),
      	'1' => _t('开启'),
      	),
      '0',
      _t('是否开启智能的代码段提示？'),
      null
    );
    $form->addInput($f);
    $f = new Typecho_Widget_Helper_Form_Element_Radio(
      'loadjq',
      array(
        '0' => _t('不加载'),
        '1' => _t('加载')
      ),
      '0',
      _t('加载Jquery'),
      _t('是否引入Jquery(3.4.1)，如引入后原有功能异常请关闭此项（一般情况下无需开启此项）')
    );
    $form->addInput($f);
    $f = new Typecho_Widget_Helper_Form_Element_Textarea(
      'style',
      null,
      _t('
        '),
      _t('自定义Style')
    );
    $form->addInput($f);

    echo '<a onclick="window.open(\'https://github.com/CrazyBoyM/ArkEditor\')" style="padding:5px">Github</a></strong><br>';
    }
  // 用户个人设置
  public static function personalConfig(Typecho_Widget_Helper_Form $form){}
  public static function addArkEditor(){ 
    $set=Typecho_Widget::widget('Widget_Options')->plugin('ArkEditor');
    $home = Helper::options()->pluginUrl.'/ArkEditor';
   ?>
	  <script src="https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/ace.js" integrity="sha256-kmNdqc9RKBgwWKQJwes1H5/NDrlPDmoCA1xXTpTPLag=" crossorigin="anonymous"></script>
	  <script src="https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/ext-language_tools.js" integrity="sha256-PpgGurDMN0pdGH+XOyJWiPoi90FbTdl/iSPI83fuw3Q=" crossorigin="anonymous"></script>
	  <script src="https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/ext-error_marker.js" integrity="sha256-mQpIODuFLRRsnlb43d7LbMFVR9otzfJwPe7W4n/1aZA=" crossorigin="anonymous"></script>
	  <script src="https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/ext-modelist.js" integrity="sha256-W/RQIKBDIz5jt/LZWIcICLYs8qGvoSyYT1R3tzpsf4U=" crossorigin="anonymous"></script>
	  <script>
		var catlang="<?echo $set->catlang?>",
			cattheme="<?echo $set->cattheme?>",
			catfontsize="<?echo $set->catfontsize?>",
			highlightnowrow="<?echo $set->highlightnowrow?>",
			catdate="<?echo $set->catdate?>",
			autobasicfill="<?echo $set->autobasicfill?>",
			autofill="<?echo $set->autofill?>",
			autocode="<?echo $set->autocode?>";
	  </script>
	  <?
    echo "<link rel=\"stylesheet\" href=\"{$home}/js/lib/layui/css/layui.css\">";
    echo "<link rel=\"stylesheet\" href=\"{$home}/css/miao.css\">";
    echo "<link rel=\"stylesheet\" href=\"{$home}/css/font-awesome/css/font-awesome.min.css\">";
    echo "<script src=\"{$home}/js/lib/marked/marked.js\"></script>";
    echo "<script src=\"{$home}/js/lib/layui/layui.all.js\"></script>";
    echo "<script src=\"{$home}/js/lib/jquery/jquery.cookie.js\"></script>";
    echo "<script src=\"{$home}/js/Miao.js\"></script>";
  }
  public static function loadJquery(){
    echo '<script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>';
  }
  //用不到的放一块备用
  public static function show($data,$widget,$last){}
  public static function hide($data,$widget,$last){}
  public static function header(){}
  public static function footer(){}
}
  ?>