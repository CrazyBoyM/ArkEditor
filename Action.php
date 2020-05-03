<?php
require_once 'nlp/AipNlp.php';
const APP_ID = '';
const API_KEY = '';
const SECRET_KEY = '';

class MiaoEditor_Action implements Widget_Interface_Do
{

    public function execute()
    {
        //Do nothing
    }

    public function action()
    {	
    	if (empty($_POST) && false !== strpos($this->dataType(), 'json')) {
            $content = file_get_contents('php://input');
            $post    = (array)json_decode($content, true);
        } else {
            $post = $_POST;
        }
		$client = new AipNlp(APP_ID, API_KEY, SECRET_KEY);
    	$text=$post['text'];
    	$x=$client->ecnet($text);
    	echo json_encode($x);
        }
}
?>