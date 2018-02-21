<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\BridgetComments;
use App\BridgetUrl;
use Session;

class BridgetController extends Controller
{


	public function getMessages(Request $request)
	{
		$fingerprint=$request->input('fingerPrint');
		$pageNumber=$request->input('page_num')?$request->input('page_num'):0;
		$param = $request->input('bridget_url');
		
		session()->put('fingerPrint', $fingerprint);
		$parentComments=BridgetComments::getParents($param,$pageNumber);
		if(!BridgetUrl::isUrlExist($param)){
			BridgetUrl::addUrl($param);
		}
		$url=BridgetUrl::getId($param);

		$parentComments=$parentComments->reverse();
		return view("bridget.messages", [
			"param"=>$param,
			"parentComments"=>$parentComments,
			'channelId'=>$url->_id
			]);		
	}

	public function addMessage(Request $request)
	{
		$comment=$request->input('comment');
		$parentId=$request->input('parent_id');
		$url=$request->input('url');
		$channel=BridgetUrl::getId($url);
		$browserFingerPrint=Session::get('fingerPrint');
		$userName=$request->input('username');
		$comment=BridgetComments::addMessage($comment,$parentId,$url,$browserFingerPrint,$userName);
		
		if($comment){
			if($parentId){
				$commentHtml = view("bridget.childComment",compact('comment'))->render();
			}else{
				$commentHtml = view("bridget.comment",compact('comment'))->render();
				$commentData=array(
					'message'=> $commentHtml,
					'username'=>$comment->username,
					'commentId'=>$comment->_id,
					'commentFingerPrint'=>$comment->browser_fingerprint
					);
				event(new \App\Events\SendMessage($commentData,$channel->_id));
			}

			return response()->json(['success'=>true,'message' => $commentHtml,'_id'=>$comment->_id]);
		}else{
			return response()->json(['success'=>false]);
		}		
	}

	public function childComments(Request $request)
	{
		$parentId=$request->input('parent_id');
		$childComments=BridgetComments::getChildrens($parentId);
		$view = view("bridget.childComments",compact('childComments'))->render();
		return response()->json(['success'=>true,'view' => $view]);
	}

	public function updateUserName(Request $request)
	{
		$commentId=$request->input('_id');
		$userName=$request->input('username');
		$url=$request->input('pageUrl');
		$channel=BridgetUrl::getId($url);
		if(BridgetComments::updateCommentUserByPk($commentId,$userName))
		{
			$data=array(
				'username'=>$userName,
				'commentId'=>$commentId
				);
			event(new \App\Events\UpdateUserName($data,$channel->_id));
			return response()->json(['success'=>true]);
		}else{
			return response()->json(['success'=>false]);
		}
		
	}

	public function index()
	{
		$faker = \Faker\Factory::create();
		$url=$faker->url;
		$counter=0;
		for ($i=1; $i <= 3; $i++) { 
			$counter++;
			$bridgetComments=new BridgetComments();
			$bridgetComments->username=$faker->userName;
			$bridgetComments->comment=$faker->text;
			$bridgetComments->parent_id=null;
			$bridgetComments->browser_fingerprint=$counter;
			$bridgetComments->url=$url;
			$bridgetComments->save();
			for($j=1;$j<5;$j++){
				$counter++;
				$bridgetComments1=new BridgetComments();
				$bridgetComments1->username=$faker->userName;
				$bridgetComments1->comment=$faker->text;
				$bridgetComments1->parent_id=$bridgetComments->_id;
				$bridgetComments1->browser_fingerprint=$counter;
				$bridgetComments1->url=$url;
				$bridgetComments1->save();

				for($k=1;$k<5;$k++){
					$counter++;
					$bridgetComments2=new BridgetComments();
					$bridgetComments2->username=$faker->userName;
					$bridgetComments2->comment=$faker->text;
					$bridgetComments2->parent_id=$bridgetComments1->_id;
					$bridgetComments2->browser_fingerprint=$counter;
					$bridgetComments2->url=$url;
					$bridgetComments2->save();
				}
			}

		}
	}
}
