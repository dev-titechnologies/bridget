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
		
		$pageNumber=$request->input('page_num')?$request->input('page_num'):0;
		$param = $request->input('bridget_url');

		if (!Session::has('fingerPrint')){
			$fingerprint=$request->input('fingerPrint');
			session()->put('fingerPrint', $fingerprint);
		}		
		$realTimeOffset=$request->input('real_time_offset')?$request->input('real_time_offset'):0;
		$parentComments=BridgetComments::getParents($param,$pageNumber,BridgetComments::COMMENTLIMIT,$realTimeOffset);
		if(!BridgetUrl::isUrlExist($param)){
			BridgetUrl::addUrl($param);
		}
		$url=BridgetUrl::getId($param);

		$parentComments=$parentComments->reverse();

		if($request->ajax()){
			$countParentComments=count($parentComments);
			$showLoadMore=$countParentComments>=BridgetComments::COMMENTLIMIT?true:false;
			$comments = view("bridget.parentComments",
				[		
				"comments"=>$parentComments,
				])->render();
			return response()->json(['count'=>$countParentComments,'success'=>true,'comments'=>$comments,'showLoadMore'=>$showLoadMore]);
		}else{
			return view("bridget.messages", [
				"param"=>$param,
				"parentComments"=>$parentComments,
				'channelId'=>$url->_id
				]);	
		}

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
		$childCount=false;
		if($comment){
			if($parentId){				
				$childCount=BridgetComments::numberOfReply($parentId);
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

			return response()->json(['success'=>true,'message' => $commentHtml,'_id'=>$comment->_id,'childCount'=>$childCount]);
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
		
		$username=$request->input('username');
		$browserFingerPrint=Session::get('fingerPrint');
		if(BridgetComments::updateCommentByFingerPrint($browserFingerPrint,$username))
		{			
			return response()->json(['success'=>true]);
		}else{
			return response()->json(['success'=>false]);
		}
		
	}

	public function updateDisplayName(Request $request)
	{
		$username=$request->input('username');
		$comments=$request->input('comments');
		$url=$request->input('url');
		$channel=BridgetUrl::getId($url);

		$commentData=array(
			'username'=>$username,
			'commentIds'=>$comments
			);

		event(new \App\Events\UpdateUserName($commentData,$channel->_id));
	}

	public function updateTypingStatus(Request $request)
	{
		$username=$request->input('username');
		$url=$request->input('url');
		$channel=BridgetUrl::getId($url);

		$commentData=array(
			'username'=>$username,
			'fingerprint'=>Session::get('fingerPrint')
			);

		event(new \App\Events\UpdateTypingStatus($commentData,$channel->_id));
	}

}
