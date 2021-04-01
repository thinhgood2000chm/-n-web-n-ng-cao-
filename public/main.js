
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
    $("#btnPosted").click(()=>{
        var nameUser =document.getElementById("recipient-name").value
        // dòng 119 index.ejs
        var messageText= document.getElementById("message-text").value
        var hiddenEmailOfPost= document.getElementById("hiddenEmailOfPost").value
        console.log(hiddenEmailOfPost);
        fetch("http://localhost:3000/insertPost/"+hiddenEmailOfPost+"/"+nameUser+"/"+messageText,{
            method: "POST"
        })
        .then( res=> console.log(res))
        .catch(console.log)
    })
    })
