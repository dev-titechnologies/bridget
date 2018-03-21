@foreach($comments as $comment)
@include('bridget.comment',['comment' => $comment])			
@endforeach

<script>
	jQuery.each(jQuery('textarea[data-autoresize]'), function() {
		var offset = this.offsetHeight - this.clientHeight;
		jQuery(this).on('keyup input', function() { resizeTextarea(this,offset); }).removeAttr('data-autoresize');
	});
	
</script>
