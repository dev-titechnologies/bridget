var selectedElement=null;
var anonymousCommentId=null;      
var domElements=(function(){

    return {
        'replayLink':'.replay-comment',
        'replayBtn':'.replay-btn',
        'chatContainer':'.floating-chat',
        'messagesContainer':'.messages',
        'allReplays':'.see-all-replay',
        'childCommentContainer':'.child_comment_container',
        'hideAllReplay':'.hide-all-replay',
        'commentFooter':'.comment_footer',
        'cancelReplayInput':'.cancel_input',
        'userReplayInput':'.user-replay',
        'sendMessageBtn':'#sendMessage',
        'messageTextBox':'.comment-box',
        'responseMessage':'#new-message',
        'userComments':'.user-comments',
        'anonymousPost':'.anonymous-post',
        'userNameField':'.name_field'
    }

})();
$(".bot").fadeIn( "slow" );
$(".name_field").focus();
var element = $(domElements.chatContainer);
var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');

setTimeout(function() {
    element.addClass('enter');
}, 1000);

element.click(openElement);

function openElement() {
    var messages = element.find('.messages');
    var textInput = element.find(domElements.messageTextBox);
    element.find('>i').hide();
    element.addClass('expand');
    element.find('.chat').addClass('enter');
    var strLength = textInput.val().length * 2;
    textInput.keydown(onMetaAndEnter).prop("disabled", false).focus();
    element.off('click', openElement);
    element.find('.header button').click(closeElement);
    element.find('#sendMessage').click(sendNewMessage);
    messages.scrollTop(messages.prop("scrollHeight"));
}

function closeElement() {
    element.find('.chat').removeClass('enter').hide();
    element.find('>i').show();
    element.removeClass('expand');
    element.find('.header button').off('click', closeElement);
    element.find('#sendMessage').off('click', sendNewMessage);
    element.find('.text-box').off('keydown', onMetaAndEnter).prop("disabled", true).blur();
    setTimeout(function() {
        element.find('.chat').removeClass('enter').show()
        element.click(openElement);
    }, 500);
}


function sendNewMessage() 
{

    var userInput = $(domElements.messageTextBox);
    var newMessage = userInput.val();

    if (!newMessage) {
        return;
    }   

    var request =sendMsg(null,newMessage,pageUrl,fingerprint);
    ajaxSuccessComment(request);

}

function ajaxSuccessComment(request)
{
    request.done(function(response){ 
        anonymousCommentId=response._id;     
        getUserName();      

    });

    request.fail(function(jqXHR, textStatus) {
       alert( "Request failed: " + textStatus );
   });
}

function displayNewMessage(data)
{
    $(domElements.messagesContainer).append(data.message); 
    if(fingerprint!=data.commentFingerPrint){
        $('#commentuser-'+data.commentId).html(data.username);
    }   

    $(domElements.messageTextBox).val('');
    $(domElements.messagesContainer).finish().animate({
        scrollTop: $(domElements.messagesContainer).prop("scrollHeight")
    }, 2500);
}

function displayNewName(data)
{
 $('#commentuser-'+data.commentId).html(data.username); 
}

function getUserName()
{   

    var bridgetUsername = localStorage.getItem('bridget-username');

    if(!bridgetUsername){

        $('.bot-container').show();
        return;
    }
    return bridgetUsername;
}

function onMetaAndEnter(event) {
    if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
        sendNewMessage();
    }
}

function sendMsg(parentId,msg,url,fingerPrint)
{   

    return $.ajax({
        url: baseUrl+'/add-message',
        type: "POST",
        data: {
            '_token': CSRF_TOKEN,
            'parent_id':parentId,
            'comment':msg,
            'url':url,
            'fingerPrint':fingerPrint,
            'username':localStorage.getItem('bridget-username')?localStorage.getItem('bridget-username'):'Anonymous'
        },
        dataType: "json"
    });
}

function showChildComments(parentId)
{

    return $.ajax({
        url: baseUrl+'/child-comments',
        type: "POST",
        data: {
            '_token': CSRF_TOKEN,
            'parent_id':parentId
        },
        dataType: "json"
    });
}

function updateUserName(username)
{
  return $.ajax({
    url: baseUrl+'/update-username',
    type: "POST",
    data: {
        '_token': CSRF_TOKEN,
        'username':username
    },
    dataType: "json",
    beforeSend:function(){
       $('#comment-box').attr('disabled',true); 
       $('.user-replay').attr('disabled',true);
   }
});
}

function getParentId(ele)
{
 return $(ele).attr('id').split('-')[1];
}

(function(){


    $(domElements.replayLink).on('click',function(e){
        $(this).next('div').show();
    })

    $(document).on('keypress',domElements.userNameField,function(e){
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode == '13' && $(this).val()!=''){            
            updateUserName($(this).val());
            localStorage.setItem('bridget-username',$(this).val());            
            $('.bot-container').hide();
            $('#comment-box').attr('disabled',false); 
            $('.user-replay').attr('disabled',false);
        }   
    });

    $(document).on('click',domElements.replayBtn,function(e){
        selectedElement=$(this);        
        $(this).parent('.comment_footer').find('.reply_input').show();
        $(this).parent('.comment_footer').find('.user-replay').focus();

    });

    $(document).on('click',domElements.cancelReplayInput,function(e){
        $(this).parent('.reply_input').hide();
    });
    //comment-box
    $(document).on('keypress',domElements.messageTextBox,function(e){ 

        var keycode = (e.keyCode ? e.keyCode : e.which);

        if(keycode == '13'){
            sendNewMessage();
        }
    });

    $(document).on('keypress',domElements.userReplayInput,function(e){    
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode == '13'){
         var $input=$(this);  

         if(!$input.val()){
            return;
        }


        var parentId=getParentId($(this).parents('li'));


        var request =sendMsg(parentId,$input.val(),pageUrl,fingerprint);

        ajaxSuccessReplay(request,$input);


    }
});

    function ajaxSuccessReplay(request,$input)
    {
       request.done(function(response) {
        anonymousCommentId=response._id;
        $input.parents('.comment_footer').find(domElements.allReplays).trigger("click");
        $input.val('');
        $input.parent('.reply_input').hide();
        getUserName();
    });

       request.fail(function(jqXHR, textStatus) {
          alert( "Request failed: " + textStatus );
      }); 
   }


   $(document).on('click',domElements.anonymousPost,function(e){
    localStorage.setItem('bridget-username','Anonymous');
    updateUserName('Anonymous');
    $('.bot-container').hide();
    $('#comment-box').attr('disabled',false); 
    $('.user-replay').attr('disabled',false);
});

   $(document).on('click',domElements.allReplays,function(e){
    var ele=$(this);
    var parentLi=$(ele).parents('li');
    var request =showChildComments(getParentId($(parentLi)));

    request.done(function(response) {
        $(parentLi).find(domElements.childCommentContainer).html(response.view);
        $(parentLi).find(domElements.childCommentContainer).show();
        $(ele).hide();
        $(ele).next('span').show();
    });

    request.fail(function(jqXHR, textStatus) {
      alert( "Request failed: " + textStatus );
  });

});
   $(document).on('click',domElements.hideAllReplay,function(e){
    $(this).hide();
    $(this).prev('span').show();
    var parentLi=$(this).parents('li');
    $(parentLi).find(domElements.childCommentContainer).hide();
});


})();

/*function postMessage()
{
   if($(domElements.messageTextBox).val()!=''){           
       var request =sendMsg(null,$(domElements.messageTextBox).val(),pageUrl,fingerprint);
       ajaxSuccessComment(request);
   }       
   else if($(selectedElement).parent('.comment_footer').find('.user-replay').val()!=''){
    var parentId=getParentId($(selectedElement).parents('li'));
    var request =sendMsg(parentId,$(selectedElement).parent('.comment_footer').find('.user-replay').val(),pageUrl,fingerprint);
    ajaxSuccessReplay(request,$(selectedElement).parent('.comment_footer').find('.user-replay'))
}

}*/