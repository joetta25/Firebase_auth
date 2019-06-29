$(document).ready(function() {
    firebase.initializeApp(firebaseConfig);
    checkAuth();
    jqueryevent();
    jqueryAddRedirect();
})

function jqueryevent() {
    $('.hide-open').click(function() {
        if ($('.bottom-section').hasClass('hidden')) {
            $('.top-section').height('50vh');
            $('.bottom-section').height('50vh');
            $('.bottom-section').removeClass('hidden');
        }
        else {
            $('.top-section').height('97vh');
            $('.bottom-section').height('3vh');
            $('.bottom-section').addClass('hidden');
        }
    })
};

function jqueryAddRedirect() {
    $('.modal .btn').click(function() {
        if($(this).attr('id') =='home') {
            alert(1)
            //window.location.replace("http://stackoverflow.com");
        } else {
            alert(2)
            //window.location.replace("http://google.com");
        }
    })
}


function checkAuth() {
    var user = firebase.auth().currentUser;
    if (user) {
        alert(1);
    } else {
        $('#noauth').modal('show');
    }
}
  