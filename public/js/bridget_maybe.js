//------------CONFIGS------------------//

var assetPath = 'http://bridget.com/';
var iFrameUrl = 'http://bridget.com/bridget';
var ContainerId = '#bridget_container'
var IframeContainerId = '.bridget-frame'
//------------/CONFIGS------------------//

promise1 = null;
promise2 = null;

if (typeof jQuery == 'undefined') {

    promise1 = getScript("http://code.jquery.com/jquery-latest.min.js",function(){

        injectScript();
    });

}else{
    injectScript();
}

function injectScript()
{
    if ($(window).width() < 700) {
        jQuery('head').append('<meta name="viewport" content="width=device-width,  initial-scale=1.0, maximum-scale=1.0, user-scalable=0>');
     }

  jQuery('head').append('<link rel="stylesheet" href="' + assetPath + '/css/bridgit.css" type="text/css" />');
  jQuery(ContainerId).html('<div class="bridget-bridget-chat-btn active"> <div class="bridget-floating-bridget-chat enter">  <img src="' + assetPath + '/img/comment.png" width="25"> </div> </div>');
  jQuery(ContainerId).append('<section class="bridgit-messenger"> <div class="bridget-menu"> <div class="button-bridgit">...</div> </div> <div class="bridget-chat"> <div class="bridget-chat-title"> <h1> What do you think? </h2> </div> <div class="bridget-frame">Loading... </div>   </div> </section>');
  promiseFunctions();
  addIframe() 
}

function getScript(url,cb) {
    var script = document.createElement('script');
    script.src = url;
    var head = document.getElementsByTagName('head')[0];
    done = false;
    head.appendChild(script);

    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
            cb();
            script.onload = script.onreadystatechange = null;
        }
    };
    head.appendChild(script);

}


function promiseFunctions() {


    jQuery('.bridget-bridget-chat-btn').click(function () {
        jQuery('.bridget-bridget-chat-btn').toggleClass('active');
        jQuery('.bridgit-messenger').toggleClass('active');
    });

    jQuery('.bridget-menu').click(function () {
        jQuery('.bridget-bridget-chat-btn').toggleClass('active');
        jQuery('.bridgit-messenger').toggleClass('active');
    });



}
function addIframe() {
    var bridgetFingerprint = localStorage.getItem('bridget-fingerprint');
    if(!bridgetFingerprint){
        var bridgetFingerprint = new Date().getTime() + Math.random();
        localStorage.setItem("bridget-fingerprint", bridgetFingerprint);   
    }
    var url =window.location.href;
    iFrameUrl=iFrameUrl+'?bridget_url='+url+'&fingerPrint='+bridgetFingerprint;
    var $frame = jQuery('<iframe style="width:100%; height:100%;" src="' + iFrameUrl + '" frameborder="0">');
    jQuery(IframeContainerId).html($frame);
}







