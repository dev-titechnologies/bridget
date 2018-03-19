<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use Jenssegers\Mongodb\Eloquent\SoftDeletes;

class ProfanityFilter extends Eloquent
{
	protected $collection = 'profanity_filters';
}
