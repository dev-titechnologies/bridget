<div class="child-comments">
	@foreach($childComments as $child)
	@include('bridget.childComment',['comment' => $child])
	@endforeach
</div>
<input class="user-replay" type="text" placeholder="Add a reply...">

