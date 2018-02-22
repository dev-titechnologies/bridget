<!doctype html>
<html lang="en" class="">

<head>
	<link rel="stylesheet" href="{{ URL::asset('css/bridget_style.css') }}">
	<meta name="csrf-token" content="{{ csrf_token() }}" />
	
	<script src="http://code.jquery.com/jquery-3.3.1.min.js"></script>
	
	<script>var baseUrl="<?php echo URL::to('/'); ?>"</script>
</head>

<body>

	@yield('content')
</body>

</html>