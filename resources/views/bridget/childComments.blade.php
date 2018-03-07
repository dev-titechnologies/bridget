<div class="child-comments">
	@foreach($childComments as $child)
	@include('bridget.childComment',['comment' => $child])
	@endforeach
</div>
<textarea class="user-replay" placeholder="Add a reply..." data-autoresize style="overflow: hidden;"></textarea>
<input type="hidden" class="old-reply-id">
<textarea class="user-edit-replay" style="display:none;overflow: hidden;" data-autoresize style="overflow: hidden;"></textarea>
<span class="cancel-edit-reply cursor_pointer" style="display:none;">Cancel</span>
<script>
	jQuery.each(jQuery('textarea[data-autoresize]'), function() {
		var offset = this.offsetHeight - this.clientHeight;
		jQuery(this).on('keyup input', function() { resizeTextarea(this,offset); }).removeAttr('data-autoresize');
	});

</script>
