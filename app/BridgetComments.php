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


	public static function getParents($url,$startFrom,$limit=self::COMMENTLIMIT,$realTimeOffset,$deletedOffset)
	{
		return self::where('parent_id','=',null)
		->where('url','=',$url)
		->where('url','=',$url)
		->skip(($startFrom*$limit)+$realTimeOffset-$deletedOffset)
		->orderBy('created_at','desc')
		->limit(self::COMMENTLIMIT)
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
		$bridgetComment->comment=$comment;
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
			return 'Add reply';
		}elseif($count==1){
			return '1 Reply';
		}else{
			return $count.' Replies';
		}
	}
}
