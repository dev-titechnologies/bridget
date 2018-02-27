<?php
use App\BridgetComments;
?>
<div id="comment-{{$comment->_id}}">
	<div class="message new {{ $comment->browser_fingerprint==Session::get('fingerPrint')?'message-personal':'' }}">
		<b><span id="commentuser-{{$comment->_id}}">{{ $comment->browser_fingerprint==Session::get('fingerPrint')?'me':$comment->username }} </span></b>:{{ $comment->comment }} 
		<div class="timestamp commentlink see-all-replay cursor_pointer">

		{{BridgetComments::numberOfReply($comment->_id)}}

		</div>
		<div class="timestamp hidetlink hide-all-replay cursor_pointer"  style="display: none;"> Hide </div>
		<div class="timestamp timelink"><span class="timeago" title="{{strtotime($comment->created_at)}}"></span></div>.
	</div>


	<div class="replybox child_comment_container" style="display: none;">

	</div>
</div>
