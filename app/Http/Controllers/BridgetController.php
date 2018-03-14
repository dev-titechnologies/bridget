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
		$excludedIds=$request->input('excluded_ids')?explode(',',$request->input('excluded_ids')):[];
		$parentComments=BridgetComments::getParents($param,BridgetComments::COMMENTLIMIT,$excludedIds);
		if(!BridgetUrl::isUrlExist($param)){
			BridgetUrl::addUrl($param);
		}
		$url=BridgetUrl::getId($param);


		$parentComments=$parentComments->reverse();

		$commentIds=null;
		foreach($excludedIds as $excludedId):
			$commentIds.=$excludedId.',';
		endforeach;
		foreach($parentComments as $parentComment):
			$commentIds.=$parentComment->_id.',';
		endforeach; 
		$commentIds=rtrim($commentIds,',');

		if($request->ajax()){

			$countParentComments=count($parentComments);
			$showLoadMore=$countParentComments>=BridgetComments::COMMENTLIMIT?true:false;
			$comments = view("bridget.parentComments",
				[		
				"comments"=>$parentComments,
				])->render();
			return response()->json(['count'=>$countParentComments,'success'=>true,'comments'=>$comments,'showLoadMore'=>$showLoadMore,'commentIds'=>$commentIds]);
		}else{
			$fingerPrint=$request->input('fingerPrint');
			return view("bridget.messages", [
				"param"=>$param,
				"parentComments"=>$parentComments,
				'channelId'=>$url->_id,
				'commentIds'=>$commentIds,
				'fingerPrint'=>$fingerPrint
				]);	
		}

	}



	public function addMessage(Request $request)
	{
		$comment=$request->input('comment');
		$parentId=$request->input('parent_id');
		$url=$request->input('url');
		$channel=BridgetUrl::getId($url);
		$browserFingerPrint=BridgetComments::getFingerPrint();
		$userName=$request->input('username');

		// do not allow duplicate comments/replies based on their parents for each user
		if(BridgetComments::isCommentExist($comment,$parentId,$browserFingerPrint)){
			return response()->json(['success'=>false,'duplicate'=>true]);
		}

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
		$browserFingerPrint=BridgetComments::getFingerPrint();
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
			'commentIds'=>$comments,
			'fingerprint'=>BridgetComments::getFingerPrint()
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
			'fingerprint'=>BridgetComments::getFingerPrint()
			);

		event(new \App\Events\UpdateTypingStatus($commentData,$channel->_id));
	}

	public function deleteUserMessage(Request $request)
	{
		
		$id=$request->input('_id');
		$bridgetUrl=$request->input('bridget_url');
		$channel=BridgetUrl::getId($bridgetUrl);
		$comment=BridgetComments::findCommentById($id);
		if($comment){
			$sessionFingerPrint=BridgetComments::getFingerPrint();
			$commentFingerPrint=$comment->browser_fingerprint;

			if($sessionFingerPrint!=$commentFingerPrint){
				return response()->json(['success'=>false,'msg'=>'You are not allowed to perform this action']);
			}else{	
				
				if($comment->delete())
				{
					
					if(!$comment->parent_id){					
						$commentId=$comment->_id;
						$commentData=array('commentId'=>$commentId);
						event(new \App\Events\DeleteMessage($commentData,$channel->_id));
					}
					return response()->json(['success'=>true]);
				}				
			}
		}else{
			return response()->json(['success'=>false,'msg'=>'failed to load the resource']);
		}
	}

	public function editUserMessage(Request $request)
	{
		$id=$request->input('_id');
		$bridgetUrl=$request->input('bridget_url');
		$newComment=$request->input('edited_comment');
		$channel=BridgetUrl::getId($bridgetUrl);
		$comment=BridgetComments::findCommentById($id);
		if($comment){
			$sessionFingerPrint=BridgetComments::getFingerPrint();
			$commentFingerPrint=$comment->browser_fingerprint;

			if($sessionFingerPrint!=$commentFingerPrint){
				return response()->json(['success'=>false,'msg'=>'You are not allowed to perform this action']);
			}else{	
				$isAlreadyEdited=isset($comment->isEdited)?true:false;
				$comment->comment=$newComment;
				$comment->isEdited=true;
				$comment->save();
				$commentData=array('commentId'=>$comment->_id,'newComment'=>nl2br($comment->comment),'isAlreadyEdited'=> $isAlreadyEdited);
				event(new \App\Events\EditMessage($commentData,$channel->_id));
				return response()->json(['success'=>true,'newComment'=>nl2br($comment->comment),'isAlreadyEdited'=>$isAlreadyEdited]);
			}
		}else{
			return response()->json(['success'=>false,'msg'=>'failed to load the resource']);
		}
	}

	public function originalMessage(Request $request)
	{
		$id=$request->input('_id');
		$comment=BridgetComments::findCommentById($id);
		if($comment){
			return response()->json(['success'=>true,'comment'=>$comment->comment]);
		}else{
			return response()->json(['success'=>false,'msg'=>'failed to load the resource']);
		}
	}

}
