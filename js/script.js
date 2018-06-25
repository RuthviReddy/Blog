//declare a global variable for our base URL
var url = "http://localhost:8888";

//function to register users
//we'll use it for OnClick event on html
function registerUser() {
     
     //getEle... extracts the values from the TextBox
     var username = document.getElementsByClassName("username");
     var password = document.getElementsByClassName("password");

     //this is a method from jQuery
     //it makes our HTTP requests to servers and gets 
     //our response dynamically
     $.ajax({
         url: url + "/register",
         method: "post",
         data: {
             username: username[0].value,
             password: password[0].value
         },
         success : function(response) {
            window.location.assign("/registeredMessage");
        },
        error : function(xmlHttpRequest, textStatus, errorThrown) {
            if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {

                window.location.assign("/registeredMessage");
            }
            else {
                alert("ERROR!");
            }
        } 
     });
     /*.success(function(response){
         window.location.assign("/registeredMessage");
     }).error(function(response) {
         alert(response.message);
     });*/
}

function loginUser() {
    var username = document.getElementsByClassName("username");
    var password = document.getElementsByClassName("password");
    
    
    $.ajax({
        url: url + '/login',
        method: 'post',
        async: 'false',
        
        data: {
            username: username[0].value,
            password: password[0].value
        },
        success : function(response) {
            window.location.assign("/home");
        },
        error : function(xmlHttpRequest, textStatus, errorThrown) {
            if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {

                window.location.assign("/home");
            }
            else {
                alert("Incorrect Username or password!");
            }
        }
    });
    /*.success(function(response){
     window.location.assign("/home");       //redirects page through client side
 }).error(function(response) {
     alert("Incorrect username or password!");
 });*/
}

function getUser() {
    var username = document.getElementsByClassName("username");

    $.ajax ({
        url: url + "/user",
        method: "get",

        success : function(response) {
            document.getElementsByClassName("username")[0].innerHTML = response.username;

        },

        error : function(xmlHttpRequest, textStatus, errorThrown) {
            if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
                document.getElementsByClassName("username")[0].innerHTML = response.username;
            }
            else {
                alert("Cannot fetch data. Please try again later.");

            }
        }

    });
}