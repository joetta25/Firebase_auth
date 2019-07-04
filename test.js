$(document).ready(function() {
    
    $('tr').click(function(){
        let play_icon = $(this).find('i');
        $('tr').removeClass('active');
        $('tr').find('i').removeClass('active fa-pause-circle').addClass('hidden fa-play-circle');
        $(this).addClass('active');
        $(play_icon).removeClass('fa-play-circle hidden').addClass('fa-pause-circle active');
    })
})


function addCurrentSongEvents(){
    $('tr').click(function(){
        let play_icon = $(this).find('i');
        $('tr').removeClass('active');
        $('tr').find('i').removeClass('active fa-pause-circle').addClass('hidden fa-play-circle');
        $(this).addClass('active');
        $(play_icon).removeClass('fa-play-circle hidden').addClass('fa-pause-circle active');
    });
};