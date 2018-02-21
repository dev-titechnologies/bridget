<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BridgetUrl extends Model
{

	public static function addUrl($url)
	{
		$bridgetUrl=new self();
		$bridgetUrl->url=$url;
		return $bridgetUrl->save();
	}

	public static function isUrlExist($url){
		self::where()
	}	
}
