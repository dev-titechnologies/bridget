var Bridgit=(function(){
var assetPath = 'http://ec2-54-252-171-131.ap-southeast-2.compute.amazonaws.com';
var iFrameUrl = 'http://ec2-54-252-171-131.ap-southeast-2.compute.amazonaws.com/bridget';
  
var ContainerId = '.bridget_container';
  var IframeContainerId = '.bridget-frame';
  var options={};
  var userOptions={};

  init=function(options){

    injectJquery(function(){
      injectScript(options);
    });
  }
  injectJquery=function(cb){
    if (typeof jQuery == 'undefined') {
      getScript("http://code.jquery.com/jquery-latest.min.js",function(){
        cb();
      });
    }else{
      cb();
    }
  }
  injectScript=function(config){
    options = {
      'url':window.location.href,
      'containerId':ContainerId,
      'bridgitId':'#bridgit'+'-'+ContainerId
    };
    userOptions = {
      'url':config.url,
      'containerId':'#'+config.containerId,
      'bridgitId':'#bridgit'+'-'+config.containerId
    };
    options=$.extend(options, userOptions);
    jQuery('head').append('<link rel="stylesheet" href="' + assetPath + '/css/bridgit.css" type="text/css" />');

    var meta=document.createElement('meta');
    meta.name='viewport';
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
    document.getElementsByTagName('head')[0].appendChild(meta);
    jQuery(options.containerId).html('<div class="bridget-bridget-chat-btn active" id="bridget-bridget-chat-btn-'+removeHash(options.bridgitId)+'"> <input type="hidden" class="bridgit-url" value="'+options.url+'"><div class="bridget-floating-bridget-chat enter">  <img src="' + assetPath + '/img/comment.png" width="25"> </div> </div>');
    jQuery(options.containerId).append('<section class="bridgit-messenger"> <div class="bridget-menu" id="bridgit-messenger-'+removeHash(options.bridgitId)+'"> <div class="button-bridgit">x</div> </div> <div class="bridget-chat"> <div class="bridget-chat-title"><span class="logo_bridgit"><img src="img/logo.png"></span> </div> <div id="'+removeHash(options.bridgitId)+'">Loading... </div>   </div> </section>');
    jQuery(options.bridgitId).css({'height':'98%','overflow': 'hidden'});
    jQuery('.bridgit-messenger').css({'height':'98%','overflow': 'hidden'});


    promiseFunctions();
  }
  getScript=function(url,cb){
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
  addIframe=function(id,url){
    var bridgetFingerprint = localStorage.getItem('bridget-fingerprint');
    if(!bridgetFingerprint){
      var bridgetFingerprint = new Date().getTime() + Math.random();
      localStorage.setItem("bridget-fingerprint", bridgetFingerprint);   
    }
    iFrameNewUrl=iFrameUrl+'?bridget_url='+url+'&fingerPrint='+bridgetFingerprint+'&openStatus=0';
    var $frame = jQuery('<iframe style="width:100%; height:100%;" src="' + iFrameNewUrl + '" frameborder="0" id="'+id+'">');
    jQuery('#bridgit-'+id).html($frame);
  }
  promiseFunctions=function(){
    $('.bridget-bridget-chat-btn').click(function (e) {
      e.stopImmediatePropagation();
      toggleChatBtn();      
      jQuery(this).toggleClass('active');
      jQuery(this).parents('.bridget_container').find('.bridgit-messenger').toggleClass('active');
      addIframe($(this).attr('id').split('-').pop(),$(this).find('.bridgit-url').val());
    });

    $('.bridget-menu').click(function (e) {
      e.stopImmediatePropagation();
      jQuery(this).parents('.bridget_container').find('.bridget-bridget-chat-btn').toggleClass('active');
      jQuery(this).parents('.bridget_container').find('.bridgit-messenger').toggleClass('active');
    });
  }
  removeHash=function(string){
    return string.substring(1, string.length);
  }
  toggleChatBtn=function(){
    $('.bridget_container').each(function(){
      jQuery(this).find('.bridgit-messenger').removeClass('active');
      jQuery(this).find('.bridget-bridget-chat-btn').addClass('active');
    })
  }

  return {
    init:init,

  }
})();

Bridgit.init({
  'containerId':"bridget_container"
})

