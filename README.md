curse.js
========

Page-based scrolling experiment with vertical-track cursor. See [demo](http://dechov.github.io/curse.js/)!

## Dependencies

- **jQuery**
- [brandonaaron/jquery-mousewheel](https://github.com/brandonaaron/jquery-mousewheel)
- [cowboy/jquery-resize](https://github.com/cowboy/jquery-resize) *(optional)*


## Usage

```javascript
$('.your-text-container').curse(options);
```
 
Options (and *defaults*):
- scrollMarginRatio: *1/7*
- cursorSize: *10*
- color: *'#AAAAAA'*
- animateSpeed: *300*
- markPageNumbers: *false*
- initialScrollPosition: *undefined (i.e. current scrollTop)*


## Todos

- Draggable cursor!
- Support right-side cursor as (default?) option
- Snap cursor to lines?
- Export plugin to `build` directory
- Un-curse
