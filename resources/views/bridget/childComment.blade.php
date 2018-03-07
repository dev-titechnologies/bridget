<div id="reply-{{$comment->_id}}">
	<b>{{$comment->browser_fingerprint==Session::get('fingerPrint')?'Me':$comment->username}}:</b> <span class="comment-reply"><?php echo nl2br($comment->comment); ?></span>
	<br>
	
	<span class="edited-comment">
		@if($comment->isEdited)
		Edited
		@endif
	</span>

	<div class="replytime"> <span class="timeago" datetime="{{strtotime($comment->created_at)}}"></span>
		@if($comment->browser_fingerprint==Session::get('fingerPrint'))	
		&nbsp;&nbsp;&nbsp;<span class="cursor_pointer delete-my-reply" title="Delete" data-pk="{{$comment->_id}}">Delete</span>&nbsp;&nbsp;&nbsp;<span class="cursor_pointer edit-my-reply" title="Edit" data-pk="{{$comment->_id}}">Edit</span>
		@endif
	</div>

</div>
