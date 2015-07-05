$(document).ready(function() {
  function addIntegerBorderRadius(length, i, elem) {
    i = length - i - 1;
    if (i % 3 === 0) {
      $(elem).addClass('-right');
    }
    if ((i + 1) % 3 === 0) {
      $(elem).addClass('-left');
    }
  }

  $('.counter.-separate').each(function(i, elem) {
    var $children = $(elem).children();
    var $digits = $children.filter('.digit');
    $digits.each(function(i, elem) {
      addIntegerBorderRadius($digits.length, i, elem);
    });
  });
});
