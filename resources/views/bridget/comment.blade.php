<?php
use App\BridgetComments;
?>

<div id="comment-{{$comment->_id}}">
	<div class="message new {{ $comment->browser_fingerprint==BridgetComments::getFingerPrint()?'message-personal':'' }}">

		<b><span id="commentuser-{{$comment->_id}}">{{ $comment->browser_fingerprint==BridgetComments::getFingerPrint()?'me':$comment->username }} </span></b>:<span class="user-comment">
		<?php echo BridgetComments::formatComment($comment); ?>


	</span>
	@if($comment->browser_fingerprint==BridgetComments::getFingerPrint())		
	<span class="user-action cursor_pointer">...</span>
	<ul style="display: none;">
		<li><a href="#"><i class="fa fa-edit"></i><span class="edit-my-comment" title="Edit" data-pk="{{$comment->_id}}">Edit</span></a></li>
		<li><a href="#"><i class="fa fa-trash-o"></i><span class="delete-my-comment" title="Delete" data-pk="{{$comment->_id}}">Delete</span></a></li>			
	</ul>
	@endif			
	<br/>
	<span class="edited-comment">@if($comment->isEdited)
		Edited 
		@endif
	</span>


	<div class="timestamp commentlink see-all-replay cursor_pointer">

		{{BridgetComments::numberOfReply($comment->_id)}}

	</div>
	<div class="timestamp hidetlink hide-all-replay cursor_pointer"  style="display: none;"> Hide </div>
	<div class="timestamp timelink"><span class="timeago" datetime="{{strtotime($comment->created_at)}}"></span></div>
</div>

<div class="replybox child_comment_container" style="display: none;">
	@include('bridget.childComments',['childComments' => BridgetComments::getChildrens($comment->_id)])	
</div>
</div>
