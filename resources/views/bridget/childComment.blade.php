<div id="reply-{{$comment->_id}}">
	<b>{{$comment->browser_fingerprint==Session::get('fingerPrint')?'Me':$comment->username}}:</b> <span class="comment-reply"><?php echo nl2br($comment->comment); ?></span>
	<br>
	@if($comment->isEdited)
	<span class="edited-comment">Edited</span>
	@endif
	<div class="replytime"> <span class="timeago" datetime="{{strtotime($comment->created_at)}}"></span>
		@if($comment->browser_fingerprint==Session::get('fingerPrint'))	
		&nbsp;&nbsp;&nbsp;<span class="cursor_pointer delete-my-reply" title="Delete" data-pk="{{$comment->_id}}"><i class="fa fa-trash-o"></i></span>&nbsp;&nbsp;&nbsp;<span class="cursor_pointer edit-my-reply" title="Edit" data-pk="{{$comment->_id}}"><i class="fa fa-edit"></i></span>
		@endif
	</div>

</div>
