



function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/loginGG');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
    if(xhr.responseText=="success"){
        signOut();
        location.assign('/')
    }
    else 
    { 
        signOut();
        console.log("da vao day");
        location.assign('/login')
        
    }

    };
    xhr.send(JSON.stringify({token:id_token}));
}

function signOut() {
var auth2 = gapi.auth2.getAuthInstance();
auth2.signOut().then(function () {
console.log('User signed out.');
});
}


$(document).ready(function(){
    // hàm dùng đẻ tạo nhiều attribute trong 1 lần 
    function setAttributes(el, attrs) {
        for(var key in attrs) {
          el.setAttribute(key, attrs[key]);
        }
      }

    $("#btnPosted").click((e)=>{
        
        e.preventDefault();
        
        var nameUser =document.getElementById("recipient-name").value
        var hiddenPicture = document.getElementById("hiddenPicture").value
        // dòng 119 index.ejs
        var messageText= document.getElementById("message-text").value
        var hiddenEmailOfPost= document.getElementById("hiddenEmailOfPost").value
        //console.log(hiddenEmailOfPost);
        $('#myModal').hide();
        $('.modal-backdrop').hide();
        $.ajax({
            url: 'http://localhost:3000/insertPost/',
            type: 'POST',
            data: {
                nameUser: nameUser,
                messageText: messageText,
                hiddenEmailOfPost: hiddenEmailOfPost,
                hiddenPicture:hiddenPicture
            }
        }).done(function(ketqua) {

            //console.log("ketqua",ketqua.data);
            if(ketqua.code===0){
                console.log(" da vao day ");
                var parentMedia = document.getElementById("parentMedia")
                var parentMediaBody= document.getElementById("parentMediaBody")
                var imageUser = document.createElement("img")
                //set ảnh đại diện
                setAttributes(imageUser,{"src":ketqua.data.imageUser,"class":"rounded-circle mr-3","width":"56", "height":"56"})
                parentMedia.appendChild(imageUser)
                // thiết lập bên trong của thẻ media-body
                // tên người đăng mới
                var ptag= document.createElement("p")
                setAttributes(ptag,{"class":"mb-2", "id":"parentOfStrong"})
            
                var strongTag = document.createElement("strong")
                var node = document.createTextNode(ketqua.data.name);
              
                strongTag.appendChild(node)
                ptag.appendChild(strongTag)
                parentMediaBody.appendChild(ptag)
                // mess mới đăng
                var p2 = document.createElement("p")
                var nodeMess = document.createTextNode(ketqua.data.message);
                p2.appendChild(nodeMess)
                parentMediaBody.appendChild(p2)
                

                //thời gian tạo bài đăng
                var smallTag = document.createElement("small")
                setAttributes(smallTag,{"class":"text-muted"})
                var nodeSmallTimeCreate = document.createTextNode("now")
                smallTag.appendChild(nodeSmallTimeCreate)
                parentMediaBody.appendChild(smallTag)

                var br = document.createElement("br")
                parentMediaBody.appendChild(br)
                //nút like 
                var aTag = document.createElement("a")
                var nodeATag = document.createTextNode("Like")
                setAttributes(aTag,{"href":"#","class":"btn btn-sm btn-danger mt-1"})
                var iTagIconLike = document.createElement("i")
                setAttributes(iTagIconLike,{"class":"fa fa-heart-o"})
                /*var svgTag = document.createElement("svg")
                setAttributes(svgTag,{"xmlns":"http://www.w3.org/2000/svg" ,"width":"24", "height":"24", "viewBox":"0 0 24 24", "fill":"none", "stroke":"currentColor", "stroke-width":"2", "stroke-linecap":"round", "stroke-linejoin":"round", "class":"feather feather-heart feather-sm"})
                var pathTag = document.createElement("path")
                setAttributes(pathTag,{"d":"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"})
                svgTag.appendChild(pathTag)
                aTag.appendChild(svgTag)*/
                aTag.appendChild(iTagIconLike)
                aTag.appendChild(nodeATag)
                parentMediaBody.appendChild(aTag)
                
                //dòng bình luận
                /*var mediaComment= document.getElementById("mediaComment")
                var aTagComment = document.createElement("a")
                setAttributes(aTagComment,{"class":"pr-2", "href":"#"})
                var imageUserInComment= document.createElement("img")
                setAttributes(imageUserInComment,{"src":"" width="36" height="36" class="rounded-circle mr-2" alt="Stacie Hall"})
                
                var divTag= document.createElement("div")
                setAttributes(divTag,{"class":"media-body"})*/

                // khung binh luận
                var hr = document.createElement("hr")
                parentMediaBody.appendChild(hr)
                
                //div nay dòng 164
                //div nayf div tổng chir đưng sau parentMediaBody
                var divTagParent= document.createElement("div")
                setAttributes(divTagParent,{"class":"row"})
                var divTagsubParent= document.createElement("div")
                setAttributes(divTagsubParent,{"class":"col-auto"})

                //div dòng 168
                var divTag= document.createElement("div")
                setAttributes(divTag,{"class":"avatar avatar-sm"})
                var imageUserInComment = document.createElement("img")
                //set ảnh đại diện  trong comment
                setAttributes(imageUserInComment,{"src":ketqua.data.imageUser,"class":"rounded-circle mr-2","width":"36", "height":"36"})
                divTag.appendChild(imageUserInComment)
                divTagsubParent.appendChild(divTag)
                divTagParent.appendChild(divTagsubParent)
                parentMediaBody.appendChild(divTagParent)

                // set khung input nhập comment
                //div dòng 173
                var divTagsubParentCommentInput= document.createElement("div")
                setAttributes(divTagsubParentCommentInput,{"class":"col ml-n2"})
                var formInputComment= document.createElement("form")
                setAttributes(formInputComment,{"class":"mt-1"})
                var label= document.createElement("label")
                setAttributes(label,{"class":"sr-only"})
                var nodeTextLabel = document.createTextNode("Leave a commnent")
                var textareaCommentInput= document.createElement("textarea")
                setAttributes(textareaCommentInput,{"class":"form-control form-control-flush", "data-toggle":"autosize", "rows":"1", "placeholder":"Leave a comment","id":"styleInputComment"})
                
                label.appendChild(nodeTextLabel)
                formInputComment.appendChild(label)
                formInputComment.appendChild(textareaCommentInput)
                divTagsubParentCommentInput.appendChild(formInputComment)
                divTagParent.appendChild(divTagsubParentCommentInput)
                parentMediaBody.appendChild(divTagParent)

                //div dòng 184
                var divTagsubParentIconComment= document.createElement("div")
                setAttributes(divTagsubParentIconComment,{"class":"col-auto align-self-end"})
                var divtagicon= document.createElement("div")
                setAttributes(divtagicon,{"class":"input-container mb-2"})
                // icon mays anhr
                var aTagIconCamera = document.createElement("a")
                setAttributes(aTagIconCamera,{"class":"text-reset mr-3", "href":"#!", "type":"file", "data-toggle":"tooltip" ,"title":"", "data-original-title":"Add photo"})
                var iTagIconCamera= document.createElement("i")
                setAttributes(iTagIconCamera,{"class":"fa fa-camera"})
                
                aTagIconCamera.appendChild(iTagIconCamera)
                // icon kpej giaays
                var aTagIconPaperclip = document.createElement("a")
                setAttributes(aTagIconPaperclip,{"class":"text-reset mr-3", "href":"#!",  "data-toggle":"tooltip" ,"title":"", "data-original-title":"Attach file"})
                var iTagIconPaperclip= document.createElement("i")
                setAttributes(iTagIconPaperclip,{"class":"fa fa-paperclip"})
                aTagIconPaperclip.appendChild(iTagIconPaperclip)
                
                divtagicon.appendChild(aTagIconCamera)
                divtagicon.appendChild(aTagIconPaperclip)
                divTagsubParentIconComment.appendChild(divtagicon)
                divTagParent.appendChild(divTagsubParentIconComment)
                parentMediaBody.appendChild(divTagParent)


                parentMedia.appendChild(parentMediaBody)
        


                // code taoj cacs thuws bene front end bawngf js  hoặc jquery @@
            }
        });
        
    });
    $(function () {
        'use strict'
  
        $('[data-toggle="offcanvas"]').on('click', function () {
          $('.offcanvas-collapse').toggleClass('open')
        })
      })
  
    /*$('#my-button').click(function(){
        $('#my-file').click();
    });*/


})
