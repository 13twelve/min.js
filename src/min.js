/*!
 * minjs
 * v2.0.6
 * https://github.com/13twelve/min.js
 * http://www.thirteentwelve.com/minjs/test/test.html (tests)
 *
 * Released under the MIT license
 *
 * Date: 2015-12-02
 */
min$ = (function (window, document, undefined) {

  // Kill exeuction for bad browsers
  if(typeof document.querySelectorAll === undefined || !('addEventListener' in window) || !window.getComputedStyle || !Object.keys) {
    return;
  }

  // make $ collection objects
  function $(elements) {
    if (elements) {
      this.length = elements.length;
      for (var i = 0; i < this.length; i++) {
        this[i] = elements[i];
      }
    }
  }

  // a counter for unique event ids - used for namespacing event handlers
  var event_uuid = 0;
  // a store for events - used for namespacing event handlers
  var events_cache = {};

  // a breakable each function
  var each = function(arr,func) {
    var arr_length = arr.length;
    for (var i = 0; i < arr_length; i++) {
      var value = func.call(arr[i],arr[i],i);
      if (value === false) {
        break;
      }
    }
    return arr;
  };

  function valid(node){
    return [1, 9].indexOf(node.nodeType) > -1;
  }

  // the main methods of minjs
  $.prototype = {
    each:function(func){
      return each(this,func);
    },
    on:function(type,fn){
      each(this,function(el){
        event_uuid++;
        if (!el.handlers) {
          el.handlers = {};
        }
        // check for namespace
        var type_arr = type.split(".");
        // store event data
        el.handlers[event_uuid] = type;
        events_cache[event_uuid] = {
          type: type_arr[0],
          namespace: type_arr[1] || "",
          fn: fn
        };
        // add listener
        el.addEventListener(type_arr[0], fn, false);
      });
      // allow for chaining
      return this;
    },
    off:function(type){
      each(this,function(el){
        // check for namespace
        var node = el;
        var node_handlers = node.handlers || [];
        var type_arr = (typeof type === "undefined") ? [] : type.split(".");
        var event_type, event_namespace;
        //
        if (type_arr.length > 0) {
          event_type = type_arr[0] || "";
          event_namespace = type_arr[1] || "";
        }
        // loop handlers
        Object.keys(node_handlers).forEach(function(key){
          if (
            (type_arr.length === 0) || // off(); so remove all events from node
            (event_type === events_cache[key].type && event_namespace === events_cache[key].namespace) || // match type and namespace
            (event_type === events_cache[key].type && event_namespace === "") || // match type and no namespace
             (event_namespace === events_cache[key].namespace && event_type === "") // match namespace and no type
          ){
            // remove the listener
            node.removeEventListener(events_cache[key].type, events_cache[key].fn, false);
            // clean up after yourself
            delete node.handlers[key];
            delete events_cache[key];
          }
        });
      });
      // allow for chaining
      return this;
    },
    trigger:function(type,data){
      // construct an HTML event. This could have
      // been a real custom event
      var event = document.createEvent('HTMLEvents');
      event.initEvent(type, true, true);
      event.data = data || {};
      event.eventName = type;
      //
      each(this,function(el){
        event.target = el;
        el.dispatchEvent(event);
      });
      // allow for chaining
      return this;
    },
    addClass:function(className){
      each(this,function(el){
        if (el.classList) {
          el.classList.add(className);
        } else if (!min$(el).hasClass(className)) {
          el.className += ' ' + className;
        }
      });
      return this;
    },
    removeClass:function(className){
      each(this,function(el){
        if (el.classList) {
          el.classList.remove(className);
        } else {
          el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
      });
      return this;
    },
    hasClass:function(className){
      var el = (this.length > 0) ? this[0] : this;
      if (!valid(el)) { return this; }
      if (el.classList) {
        return el.classList.contains(className);
      } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
      }
    },
    attr:function(a,v){
      if (v === undefined) {
        var el = (this.length > 0) ? this[0] : this;
        if (!valid(el)) { return this; }
        return el.getAttribute(a);
      } else {
        each(this,function(el){
          el.setAttribute(a,v);
        });
        return this;
      }
    },
    css:function(p,v){
      if (typeof p === "object") {
        each(this,function(el){
          for (var n in p) {
            if (p.hasOwnProperty(n)) {
              el.style[n] = p[n];
            }
          }
        });
        return this;
      } else {
        if (v === undefined) {
          var el = (this.length > 0) ? this[0] : this;
          if (!valid(el)) { return this; }
          return window.getComputedStyle(el,null).getPropertyValue(p);
        } else {
          each(this,function(el){
            el.style[p] = v;
          });
          return this;
        }
      }
    },
    index:function(item){
      var n = -1;
      if (item) {
        item = (item.length > 0 || item.addClass) ? item[0] : item;
        if (item === undefined || !valid(item)) {
          return n;
        }
      } else {
        item = this[0] || this;
      }
      each(this,function(el,i){
        if (el === item) {
          n = i;
          return false;
        }
      });
      return n;
    }
  };

  function min$(selector,context){
    var nodes = [];
    if (selector && typeof selector !== "string") {
      nodes = (selector.addClass) ? selector : [selector];
    } else if (selector) {
      nodes = (context || document).querySelectorAll(selector || '☺');
    }
    return new $(nodes);
  }

  min$.each = each;

  min$.prototype = $.prototype;

  return min$;
})(window, document);
