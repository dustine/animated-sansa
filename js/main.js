$(document).ready(function() {
});

var canvas = $('#timeline-bar')[0];
/*width: 100%;
height: 1.7em;*/
canvas.width = $(canvas.parentElement).width();
canvas.height = $(canvas.parentElement).height() * 0.8;
var context = canvas.getContext('2d');

context.fillRect(0, 0, canvas.width, canvas.height);
