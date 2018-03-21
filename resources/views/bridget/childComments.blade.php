<div class="child-comments">
	@foreach($childComments as $child)
	@include('bridget.childComment',['comment' => $child])
	@endforeach
</div>
<textarea class="user-replay" placeholder="Add a reply..." data-autoresize style="overflow: hidden;"></textarea>
<script>
	jQuery.each(jQuery('textarea[data-autoresize]'), function() {
		var offset = this.offsetHeight - this.clientHeight;
		jQuery(this).on('keyup input', function() { resizeTextarea(this,offset); }).removeAttr('data-autoresize');
	});
	
</script>
