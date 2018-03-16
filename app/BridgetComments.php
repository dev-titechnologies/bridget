<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use Jenssegers\Mongodb\Eloquent\SoftDeletes;

class BridgetComments extends Eloquent
{
	protected $collection = 'bridget_comments';

	const COMMENTLIMIT=15;	
	use SoftDeletes;

	protected $dates = ['deleted_at'];


	public static function getParents($url,$limit=self::COMMENTLIMIT,$excludedIds=[])
	{
		return self::where('parent_id','=',null)
		->where('url','=',$url)
		->whereNotIn('_id',$excludedIds)
		->orderBy('created_at','desc')
		->limit($limit)
		->get();
	}

	public static function getParentsCommentCount($url)
	{
		return self::where('parent_id','=',null)
		->where('url','=',$url)
		->count();
	}

	public static function getChildrens($parentId)
	{
		return self::where('parent_id','=',$parentId)->get();
	}

	public static function getChildrensCount($parentId)
	{
		return self::where('parent_id','=',$parentId)->count();
	}

	public static function addMessage($comment,$parentId,$url,$browserFingerPrint,$userName)
	{
		$bridgetComment=new self();
		$bridgetComment->comment=htmlentities($comment);
		$bridgetComment->parent_id=$parentId;
		$bridgetComment->url=$url;
		$bridgetComment->browser_fingerprint=$browserFingerPrint;
		$bridgetComment->username=$userName;
		$bridgetComment->save();
		return $bridgetComment;
	}

	public static function updateCommentByFingerPrint($fingerPrint,$userName)
	{
		return self::where('browser_fingerprint','=',$fingerPrint)
		->update(['username' => $userName]);
	}

	public static function numberOfReply($parentId)
	{
		$count=self::getChildrensCount($parentId);
		if($count==0){
			return 'Reply';
		}elseif($count==1){
			return '1 Reply';
		}else{
			return $count.' Replies';
		}
	}

	public static function findCommentById($id)
	{
		return self::where('_id','=',$id)->first();
	}

	public static function getFingerPrint()
	{
		return request()->header('x-fingerprint')?request()->header('x-fingerprint'):request()->fingerPrint;
	}

	public static function isCommentExist($comment,$parent=null,$browserFingerPrint)
	{
		return self::where('comment', '=', $comment)
		->where('parent_id','=',$parent)
		->where('browser_fingerprint','=',$browserFingerPrint)
		->exists()?true:false;
	}

	public static function isTagMatch($string, $tagname){
		$pattern = "#<\s*?$tagname\b[^>]*>(.*?)</$tagname\b[^>]*>#s";
		preg_match($pattern, $string, $matches);
		return isset($matches)?$matches:false;
	}
	public static function formatComment($comment)
	{
		if($comment->browser_fingerprint==self::getFingerPrint()){
			return nl2br($comment->comment); 
		}else{
			return preg_replace('/\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/i', '', nl2br($comment->comment));
		}
	}


}
