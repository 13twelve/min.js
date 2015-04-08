# min.js

v2

A super tiny JavaScript library to execute simple DOM querying, hooking name spaced event listeners, trigger events and some simple DOM node helpers. Creates objects with prototypes rather than adding prototypes to nodes themselves.

This is a re-write of my [fork](https://github.com/13twelve/min_v1.js) of Remy Sharp's [min.js](https://github.com/remy/min.js).

Checks for querySelectorAll and addEventListener and returns undefined if not present.

**WIP** Needs testing!

## Browser Compatibility

Uses querySelectorAll, addEventListener, getComputedStyle and Object.keys. If the browser doesn't support these it stops running. Effectively this means modern browsers (IE9+).

**Individual browser tests not yet completed**


## Filesize

* ~5kb uncompressed
* ~2kb minified
* ~1kb minified and gzipped

## Query elements

```js
var divs = $('div'); // minjs object
```

Creates minjs object: an array of nodes with prototype methods.

Optionally you can supply a context in which to look:

```js
var node = document.getElementById("#content"); // #content node
var divs = $('p',node); // minjs object
```

You can also pass in a node, to turn it into a minjs object:

```js
var node = document.getElementById("#content"); // #content node
var container = $(node); // minjs object
```

To return nodes from the minjs object:

```js
var divs = $('div','#content');
var first_div = divs[0]; // node
```


## Events

### Bind events with on()

Basic:

```js
$('p:first-child a').on('click', function (event) {
  event.preventDefault();
  // do something else
});
```

Or with a namespace:
```js
$('p:first-child a').on('click.foo', function (event) {
  event.preventDefault();
  // do something else
});
```

Note:
* only accepts singular events and singular namespaces
* **must** contain an event type (namespace is optional)

### Unbind events with off()

```js
$('p:first-child a').off(); // clears all handlers
$('p:first-child a').off('click'); // clears just the click handlers
$('p:first-child a').off('click.foo'); // clears just foo namespaced click handlers
$('p:first-child a').off('.foo'); // clears foo namespaced handlers
```

### Custom events

```js
$(document).on('foo', function () {
  // foo was fired
});

$(document).trigger('foo');
```

## Looping


### Looping elements

```js
$('p').each(function(el,index) {
  console.log(el.innerHTML);
});
```

To break a loop, return false:

```js
// assume you have 5 p's
$('p').each(function(el,index) {
  console.log(i);
  if (i === 1) {
    return false;
  }
});
// 0, 1
```

### Looping any array

```js
var my_arr = ["a","b","c"];
$.each(my_arr,function(value,index) {
  console.log(index,value);
});
// 0 "a", 1 "b", 2 "c"
```

## Index

Search for a given element in a collection.

```js
var node = document.getElementById("#foo"); // p#foo node
var i = $("p").index(node); // number
```

```js
var p_foo = $("p#foo"); // p#foo minjs obj
var i = $("p").index(p_foo); // number
```

If a match isn't found the number returned is -1.

If nothing is passed then the returned number will be that of the first child of the collection, likely 0.

## Chaining events

```js
$('a').on('foo', bar).on('click', doclick).trigger('foobar');
```

## Add, remove, has CSS class

```js
$('a').addClass("foo"); // adds class to all links
$('a').removeClass("bar"); // removes class from all links
var is_foo = $('a').hasClass("foo"); // assumes the first item, returns true/false
```

## Read/write attributes

```js
$('div:last-child').attr('data-url'); // returns contents of attribute
$('div:first-child').attr('data-url','http://www.github.com/13twelve'); // sets attribute
```

Assumes the first item if passed a collection larger than 1.

## Read/write CSS styles

```js
$('a:last-child').css('color'); // returns computed value of color
$('a:first-child').css('color','#000000'); // sets style
$('a:first-child').css({
  color: '#000000',
  paddingRight: '10px'
}); // sets multiple styles
```

Assumes the first item if passed a collection larger than 1.

## Silent failing

This tiny library silently fails when it doesn't match any elements.

## More info

* License: MIT
