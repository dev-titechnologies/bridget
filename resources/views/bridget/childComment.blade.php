<span class="child_comment">{{$comment->browser_fingerprint==Session::get('fingerPrint')?'Me':$comment->username}} : {{ $comment->comment }}<br>
	<span class="sub_text_time">{{$comment->created_at->diffForHumans()}}</span><br>
</span>
<br>