<?php
use App\BridgetComments;
?>
<div id="reply-{{$comment->_id}}" class="reply-to-comment">
	<input type="hidden" class="old-reply-id" value="{{$comment->_id}}">
	<textarea class="user-edit-replay edit-ele" data-autoresize id="edit-reply-{{$comment->_id}}"></textarea>
	<span class="edit-ele cancel-edit-reply cursor_pointer" id="cancel-{{$comment->_id}}">press esc to cancel</span>
	<div class="comment-reply-container"> 
		<b>{{$comment->browser_fingerprint==BridgetComments::getFingerPrint()?'Me':$comment->username}}:</b> 
		@if($comment->browser_fingerprint==BridgetComments::getFingerPrint())	
		<span class="user-action cursor_pointer user-edit-action">...</span>
		<ul style="display: none;">
			<li class="edit-my-reply" title="Edit" data-pk="{{$comment->_id}}"><a href="#"><i class="fa fa-edit"></i><span>Edit</span></a></li>
			<li class="delete-my-reply" title="Delete" data-pk="{{$comment->_id}}"><a href="#"><i class="fa fa-trash-o"></i><span>Delete</span></a></li>			
		</ul>
		@endif	
		<span class="comment-reply">	
			<?php echo BridgetComments::formatComment($comment); ?></span>			
			<br>

			<span class="edited-label">
				@if($comment->isEdited)
				Edited
				@endif
			</span>

			<div class="replytime"> <span class="timeago" datetime="{{strtotime($comment->created_at)}}"></span></div>

		</div>
	</div>
	<script>
		jQuery.each(jQuery('textarea[data-autoresize]'), function() {
			var offset = this.offsetHeight - this.clientHeight;
			jQuery(this).on('keyup input', function() { resizeTextarea(this,offset); }).removeAttr('data-autoresize');
		});

	</script>