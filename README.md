# min.js

v2.0.1

A super tiny JavaScript library to execute simple DOM querying, hooking name spaced event listeners, trigger events and some simple DOM node helpers. Creates objects with prototypes rather than adding prototypes to nodes themselves.

This is a re-write of my [fork](https://github.com/13twelve/min_v1.js) of Remy Sharp's [min.js](https://github.com/remy/min.js).

Checks for querySelectorAll, addEventListener, window.getComputedStyle and Object.keys. Returns undefined if not present.


## Browser Compatibility

Uses querySelectorAll, addEventListener, getComputedStyle and Object.keys. If the browser doesn't support these it stops running. Effectively this means modern browsers (IE9+).

**Individual browser tests not yet completed**


## Filesize

* ~5kb uncompressed
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

min.js isn't jQuery. Though the few methods it does have, work similar to jQuery. The intention is that using this will save you some typing on some common repeated JavaScript tasks. You can, of course, bind $ to min$:

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
var node = document.getElementById("#foo"); // p#foo node
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
min$('div:last-child').attr('data-url'); // returns contents of attribute
min$('div:first-child').attr('data-url','http://www.github.com/13twelve'); // sets attribute
```

Assumes the first item if passed a collection larger than 1.

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
  if (document.contains(node)) {
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
min$.extend({foo:"bar"},{bar:"foo"}); // Object {foo: "bar", bar: "foo"}
```

Or aliased:

```js
window.$ = min$;
$.extend({foo:"bar"},{bar:"foo"}); // Object {foo: "bar", bar: "foo"}
```

## Silent failing

This tiny library silently fails when it doesn't match any elements.

## More info

* License: MIT
