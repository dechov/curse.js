$.fn.curse = function(options) {
  var settings = $.extend({
    scrollMarginRatio: 1/7,
    cursorSize: 10,
    color: '#AAAAAA',
    animateSpeed: 300,
    markPageNumbers: false
  }, options);
  
  return this.each(function() {
    var $this = $(this);
    
    if (settings.height) {
      $this.height(settings.height);
    }
    $this.css('overflow', 'hidden');
    if ($this.css('position') !== 'absolute') {
      $this.css('position', 'relative');
    }
    
    var scrollPosition = settings.initialScrollPosition;
    if (scrollPosition === undefined) {
      scrollPosition = $this.scrollTop();
    }
    $this.data('scrollPosition', scrollPosition);
    $this.data('maxScrollPosition', $this.prop('scrollHeight'));

    $('<div class="cursejs-cursor">').css({
      position: 'absolute',
      left: 0,
      'z-index': 1000,  // TODO compute a "local" z somehow?
      
      // Source: http://davidwalsh.name/css-triangles
      width: 0,
      height: 0,
      'border-bottom': '0 solid transparent',
      'border-top': '0 solid transparent',
      'border-left-style': 'solid',
      'border-left-color': settings.color,
      'border-width': settings.cursorSize,
      'font-size': 0,
      'line-height': 0
    }).appendTo($this);

    $('<div class="cursejs-margin cursejs-top-margin">').css({
      opacity: 0,
      background: 'linear-gradient(to bottom, ' + $this.css('backgroundColor') + ' 0%, hsla(0,0%,100%,0) 100%)'
      
      // TODO implement these for cross browser compatibility?
      //background: '-moz-linear-gradient(top,  rgba(30,87,153,1) 0%, rgba(125,185,232,0) 100%)', /* FF3.6+ */
      //background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(30,87,153,1)), color-stop(100%,rgba(125,185,232,0))); /* Chrome,Safari4+ */
      //background: -webkit-linear-gradient(top,  rgba(30,87,153,1) 0%,rgba(125,185,232,0) 100%); /* Chrome10+,Safari5.1+ */
      //background: -o-linear-gradient(top,  rgba(30,87,153,1) 0%,rgba(125,185,232,0) 100%); /* Opera 11.10+ */
      //background: -ms-linear-gradient(top,  rgba(30,87,153,1) 0%,rgba(125,185,232,0) 100%); /* IE10+ */
      //filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1e5799', endColorstr='#007db9e8',GradientType=0 ); /* IE6-9 */
    }).appendTo($this);
    $('<div class="cursejs-margin cursejs-bottom-margin">').css({
      background: 'linear-gradient(to bottom, hsla(0,0%,100%,0) 0%, ' + $this.css('backgroundColor') + ' 100%)'
    }).appendTo($this);
    $('.cursejs-margin').css({
      position: 'absolute',
      left: 0,
      right: 0,
      'border-width': 0,
      'border-color': $this.css('backgroundColor'),
      'border-style': 'solid',
      'pointer-events': 'none'
    });

    var shiftMargins = function(scrollMargin, scrollInterval, pageIndex, maxPageIndex, animateSpeed) {
      $this.find('.cursejs-top-margin').stop()
        .animate({
          top: pageIndex * scrollInterval - 1   - scrollInterval - scrollMargin,
          opacity: pageIndex === 0 ? 0 : 1
        }, animateSpeed);
      $this.find('.cursejs-bottom-margin').stop()
        .animate({
          top: pageIndex * scrollInterval - 1 + scrollMargin + scrollInterval,
          opacity: pageIndex === maxPageIndex ? 0 : 1
        }, animateSpeed);
    };
    
    $this.bind('mousewheel', function(event, delta, deltaX, deltaY) {
      deltaY = deltaY || 0;
      var scrollMargin = $this.data('scrollMargin'),
          scrollInterval = $this.data('scrollInterval'),
          maxPageIndex = $this.data('maxPageIndex'),
          maxScrollPosition = $this.data('maxScrollPosition'),
          scrollPosition = Math.max(0, Math.min(maxScrollPosition, $this.data('scrollPosition') - (deltaY / 4))),
          pageIndex = Math.max(0, Math.min(maxPageIndex, Math.floor((scrollPosition - scrollMargin) / scrollInterval))),
          scrollOffset = (scrollPosition - (scrollInterval * pageIndex));
      
      if (pageIndex !== $this.data('pageIndex')) {
        $this.stop().animate({ scrollTop: pageIndex * scrollInterval }, settings.animateSpeed);
        shiftMargins(scrollMargin, scrollInterval, pageIndex, maxPageIndex, settings.animateSpeed);
      }
      $this.find('div.cursejs-cursor').css('top', scrollPosition - Math.ceil(settings.cursorSize));
      
      $this.data('scrollPosition', scrollPosition);
      $this.data('pageIndex', pageIndex);
      $this.data('scrollOffset', scrollOffset);
      return false;
    });

    $this.bind('resize', function(event) {
      var $this = $(this);

      // Determine the natural scrollHeight
      var scrollTop = $this.scrollTop();
      $this.find('.cursejs-bottom-margin, .cursejs-cursor').hide();
      var maxScrollPosition = $this.prop('scrollHeight');
      $this.find('.cursejs-bottom-margin, .cursejs-cursor').show();
      $this.scrollTop(scrollTop);
      
      var scrollMargin = ($this.outerHeight() * settings.scrollMarginRatio),
          scrollInterval = ($this.outerHeight() - (2 * scrollMargin)),
          maxPageIndex = Math.floor((maxScrollPosition - (2 * scrollMargin)) / scrollInterval),
          scrollPosition = ($this.data('scrollPosition') / $this.data('maxScrollPosition') * maxScrollPosition),
          pageIndex = Math.max(0, Math.min(maxPageIndex, Math.floor((scrollPosition - scrollMargin) / scrollInterval)));
      console.log($this.data('scrollPosition'), $this.data('maxScrollPosition'), maxScrollPosition)
      // Mark page numbers
      if (settings.markPageNumbers) {
        $this.find('.cursejs-pagenum').remove();
        var i;
        for (i = 1; i <= maxPageIndex; i++) {
          var displayIndex = i + 1;
          $('<div class="cursejs-pagenum">').html(displayIndex).css({
            position: 'absolute',
            left: '0.4em',
            'font-size': '0.6em',
            color: settings.color,
            'font-family': 'Sans-Serif',
            top: scrollMargin + (i * scrollInterval)
          }).appendTo($this);
        }
      }
      
      $this.stop().animate({ scrollTop: pageIndex * scrollInterval }, settings.animateSpeed);
      
      $this.find('.cursejs-margin').css({ height: scrollMargin * 2 + scrollInterval });
      $this.find('.cursejs-top-margin').css({ 'border-top-width': scrollMargin + scrollInterval });
      $this.find('.cursejs-bottom-margin').css({ 'border-bottom-width': scrollMargin + scrollInterval });
      shiftMargins(scrollMargin, scrollInterval, pageIndex, maxPageIndex, settings.animateSpeed);
      
      $this.data('scrollMargin', scrollMargin);
      $this.data('scrollInterval', scrollInterval);
      $this.data('pageIndex', pageIndex);
      $this.data('maxPageIndex', maxPageIndex);
      $this.data('scrollPosition', scrollPosition);
      $this.data('maxScrollPosition', maxScrollPosition);
      
      $this.trigger('mousewheel');
    });
    $this.trigger('resize');
  });
};
