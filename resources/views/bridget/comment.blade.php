
<li id="comment-{{$comment->_id}}">
	<b><span id="commentuser-{{$comment->_id}}">{{ $comment->browser_fingerprint==Session::get('fingerPrint')?'me':$comment->username }}: </span></b> {{ $comment->comment }} <br>

	<div class="child_comment_container" style="display: none;">


	</div>
	<div class="comment_footer">

		<span class="sub_text see-all-replay">View Replies.</span>
		<span class="sub_text hide-all-replay" style="display: none;">Hide Replies.</span>
		<span class="sub_text replay-btn">Reply.</span>
		<span class="sub_text_time">{{ $comment->created_at->diffForHumans()}}</span><br>

		<div class="reply_input"  style="display: none;">
			<input type="text" class="user-replay">
			<span class="sub_text cancel_input">Cancel</span>
			<span class="sub_text_time2">Press enter to add comment</span>
		</div> 
	</div>
</li>