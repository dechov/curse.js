$(function() {
  $('.curse-btn')
    .animate({ 'padding-left': 312 }, 300)
    .click(function() {
      $('.text-container').curse({
        color: 'hsl(136, 30%, 75%)',
        markPageNumbers: true
      });
      $(this).remove();
      return false;
    });
});
