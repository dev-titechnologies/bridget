<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class BridgetUrl extends Eloquent
{
	protected $collection = 'bridget_urls';

	public static function addUrl($url)
	{
		$bridgetUrl=new self();
		$bridgetUrl->url=$url;
		return $bridgetUrl->save();
	}

	public static function isUrlExist($url){
		return self::where('url','=',$url)->count();
	}

	public static function getId($url)
	{
		return self::where('url','=',$url)->first();
	}	

	public static function totalCount()
	{
		return self::count();
	}	
}
