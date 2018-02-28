<div class="child-comments">
	@foreach($childComments as $child)
	@include('bridget.childComment',['comment' => $child])
	@endforeach
</div>
<textarea class="user-replay" placeholder="Add a reply..." rows="4" cols="50"></textarea>

