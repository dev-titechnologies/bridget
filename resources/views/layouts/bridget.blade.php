<!doctype html>
<html lang="en" class="">

<head>
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
	<link rel="stylesheet" href="{{ URL::asset('css/normalize.min.css') }}">
	<link rel="stylesheet" href="{{ URL::asset('css/bridgit_style.css') }}">	
	<link rel="stylesheet" href="{{ URL::asset('css/jquery.mCustomScrollbar.min.css') }}">
	<meta name="csrf-token" content="{{ csrf_token() }}" />
	
	<script src="{{ URL::asset('js/jquery.min.js') }}"></script>
	<script src="{{ URL::asset('js/jquery.mCustomScrollbar.concat.min.js') }}"></script>
	
	<script>var baseUrl="<?php echo URL::to('/'); ?>"</script>
</head>

<body>

	@yield('content')
</body>

<script type="text/javascript">
	var csrfToken = $('[name="csrf-token"]').attr('content');

	  setInterval(refreshToken, 1800000); // 1/2 hour 

	  function refreshToken(){
	  	
	  	$.get('refresh-csrf').done(function(data){
	  		csrfToken = data;
	  		$('[name="csrf-token"]').attr("content", csrfToken);
	  	});
	  }

	</script>

	</html>