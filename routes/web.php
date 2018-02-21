<?php

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
Route::get('fire/{message}', function ($message) {    
	event(new App\Events\EventName($message,'test-channel1'));
	return "event fired";
});
Route::get('bridget', 'BridgetController@getMessages');
Route::get('seeder', 'BridgetController@index');
Route::post('add-message', 'BridgetController@addMessage');
Route::post('child-comments', 'BridgetController@childComments');
Route::post('update-username', 'BridgetController@updateUserName');