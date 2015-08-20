# min.js

v2.0.5
2015-08-15

A super tiny JavaScript library to execute simple DOM querying, hooking name spaced event listeners, trigger events and some simple DOM node helpers.

This is not jQuery or a jQuery replacement - more a convenience library to help you type less when writing vanilla JS. It intentionally doesn't try to replicate jQuery's API in order to keep its size down and encourage you to write vanilla JS on your own.


## Browser Compatibility

Uses querySelectorAll, addEventListener, getComputedStyle and Object.keys. If the browser doesn't support these it stops running.

[Qunit](https://qunitjs.com/) tests: [http://www.thirteentwelve.com/minjs/test/test.html](http://www.thirteentwelve.com/minjs/test/test.html)

Tests pass in:
* Chrome 41, 42, 43 (OSX)
* Chrome 42 (Windows 7, Android 5, Android 4.4.4)
* Safari 5, 8 (OSX)
* Safari 7.1, 8.3 (iOS)
* Firefox 4, 36 (OSX)
* Firefox 34 (Windows 7)
* IE9, IE10, IE11 (Windows 7)
* Android 2.3.7, 4.1.1, 4.2.2, 4.3, 4.4.4, 5, 5.1 native browser


## Filesize

* ~6kb uncompressed
* ~2kb minified
* ~1kb minified and gzipped


## Query elements

```js
var divs = min$('div'); // minjs object
```

Creates minjs object: an array of nodes with prototype methods.

Optionally you can supply a context in which to look:

```js
var node = document.getElementById("#content"); // #content node
var divs = min$('p',node); // minjs object
```

You can also pass in a node, to turn it into a minjs object:

```js
var node = document.getElementById("#content"); // #content node
var container = min$(node); // minjs object
```

To return nodes from the minjs object:

```js
var divs = min$('div');
var first_div = divs[0]; // node
```

## $ Selector

min.js isn't jQuery. You can, of course, bind $ to min$:

```js
window.$ = min$;
```
(after min$ and before the rest of your JavaScript)

And then:

```js
var divs = $('div'); // minjs object
```

## Events

### Bind events with on()

Basic:

```js
min$('p:first-child a').on('click', function (event) {
  event.preventDefault();
  // do something else
});
```

Or with a namespace:
```js
min$('p:first-child a').on('click.foo', function (event) {
  event.preventDefault();
  // do something else
});
```

Note:
* only accepts singular events and singular namespaces
* **must** contain an event type (namespace is optional)

### Unbind events with off()

```js
min$('p:first-child a').off(); // clears all handlers
min$('p:first-child a').off('click'); // clears just the click handlers
min$('p:first-child a').off('click.foo'); // clears just foo namespaced click handlers
min$('p:first-child a').off('.foo'); // clears foo namespaced handlers
```

### Custom events

```js
min$(document).on('foo', function () {
  // foo was fired
});

### Trigger events

min$(document).trigger('foo');
```

## Looping


### Looping elements

```js
min$('p').each(function(el,index) {
  console.log(el.innerHTML); // node's inner HTML
});
```

To break a loop, return false:

```js
// assume you have 5 p's
min$('p').each(function(el,index) {
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
min$.each(my_arr,function(value,index) {
  console.log(index,value);
});
// 0 "a", 1 "b", 2 "c"
```

## Index

Search for a given element in a collection.

```js
var node = document.getElementById("foo"); // p#foo node
var i = min$("p").index(node); // number
```

```js
var p_foo = min$("p#foo"); // p#foo minjs obj
var i = min$("p").index(p_foo); // number
```

If a match isn't found the number returned is -1.

If nothing is passed then the returned number will be that of the first child of the collection, likely 0.

## Chaining events

```js
min$('a').on('foo', bar).on('click', doclick).trigger('foobar');
```

## Add, remove, has CSS class

```js
min$('a').addClass("foo"); // adds class to all links
min$('a').removeClass("bar"); // removes class from all links
var is_foo = min$('a').hasClass("foo"); // assumes the first item, returns true/false
```

## Read/write attributes

```js
min$('div:last-child').attr('data-url'); // returns contents of attribute for first returned element
min$('div').attr('data-url','http://www.github.com/13twelve'); // sets attribute on all divs
```

## Read/write CSS styles

```js
min$('a:last-child').css('color'); // returns computed value of color
min$('a:first-child').css('color','#000000'); // sets style
min$('a:first-child').css({
  color: '#000000',
  paddingRight: '10px'
}); // sets multiple styles
```

Assumes the first item if passed a collection larger than 1.

Careful with reading shorthand properties in Firefox, it doesn't handle them like Webkit [Bugzilla - Bug 137688](https://bugzilla.mozilla.org/show_bug.cgi?id=137688)

## Extending

You can extend min$ by adding to its prototype:

```js
min$.prototype.tagNames = function(){
  min$.each(this,function(el){
   console.log(el.tagName);
  });
  // allow for chaining
  return this;
};
```

Then you could use:

```js
min$("*").tagNames(); // HTML, HEAD, META, TITLE, LINK..
```

Or aliased:

```js
window.$ = min$;
$.tagNames(); // HTML, HEAD, META, TITLE, LINK..
```

'this' inside your function, is the minjs object, which is an array like object with the minjs methods on its prototype. To loop a collection, use the internal minjs each method.Returning 'this' at the end allows for chaining.

This example returns the offset of an element. If your collection has more than one element, it only returns the offset for the first.

```js
min$.prototype.offset = function(){
  var node = (this.length > 0) ? this[0] : this;
  if (document.body.contains(node)) {
    var rect = node.getBoundingClientRect()
    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    };
  } else {
    return null;
  }
};
```

Then you could use:

```js
min$("h1").offset(); // Object {top: 300, left: 20}
```

Alternatively you can extend minjs itself. Here is an example of a method to merge objects together:

```js
min$.merge_objects = function(obj1,obj2){
  var merged = {};
  for (var def in obj1) {
    merged[def] = obj1[def];
  }
  for (var def in obj2) {
    merged[def] = obj2[def];
  }
  return merged;
};
```

Then you could use:

```js
min$.merge_objects({foo:"bar"},{bar:"foo"}); // Object {foo: "bar", bar: "foo"}
```

Or aliased:

```js
window.$ = min$;
$.merge_objects({foo:"bar"},{bar:"foo"}); // Object {foo: "bar", bar: "foo"}
```

## Alternatives

These libraries aim to replicate the jQuery API in a more complete way:
* [Cash](https://github.com/kenwheeler/cash)
* [Sprint](https://github.com/bendc/sprint)
* [Zepto](http://zeptojs.com/)


## Inspiration

minjs is inspired by [Remy Sharp's](https://github.com/remy) [minjs](https://github.com/remy/min.js). Remy chose to extend the global node prototype where as this minjs has its own prototype.


## More info

License: MIT
