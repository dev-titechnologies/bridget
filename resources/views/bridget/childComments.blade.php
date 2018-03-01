<div class="child-comments">
	@foreach($childComments as $child)
	@include('bridget.childComment',['comment' => $child])
	@endforeach
</div>
<textarea class="user-replay" placeholder="Add a reply..."></textarea>
<!-- <script>
	jQuery.each(jQuery('textarea[data-autoresize]'), function() {
		var offset = this.offsetHeight - this.clientHeight;

		var resizeTextarea = function(el) {
			jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
		};
		jQuery(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
	});

</script> -->