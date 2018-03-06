<?php
use App\BridgetComments;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', function () {
	$b=App\BridgetComments::onlyTrashed()
                ->count();
	print_r($b);
	return view('welcome');
});
Route::get('/docs', function () {
	dd('<div id="bridget_container"></div> <script src="http://ec2-54-252-171-131.ap-southeast-2.compute.amazonaws.com/js/bridget_maybe.js"></script>');
});

Route::get('bridget', 'BridgetController@getMessages');
Route::get('seeder', 'BridgetController@index');
Route::post('add-message', 'BridgetController@addMessage');
Route::post('child-comments', 'BridgetController@childComments');
Route::post('update-username', 'BridgetController@updateUserName');
Route::post('update-display-name', 'BridgetController@updateDisplayName');
Route::post('update-typing-status', 'BridgetController@updateTypingStatus');
Route::post('delete-my-comment', 'BridgetController@deleteUserMessage');
Route::post('edit-message', 'BridgetController@editUserMessage');
Route::post('original-message', 'BridgetController@originalMessage');
Route::get('refresh-csrf', function(){
	return csrf_token();
});
