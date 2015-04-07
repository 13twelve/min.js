$ = (function () {
  console.warn("minjs v2.0.0 - untested alpha - methods may not work as expected");

  // Kill exeuction for bad browsers
  if(typeof document.querySelectorAll !== undefined && !('addEventListener' in window)) {
    return;
  }

  function minjs(elements) {
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

  function each(arr,func) {
    //Array.prototype.forEach.call(arr, func);
    var arr_length = arr.length;
    for (var i = 0; i < arr_length; i++) {
      var value = func.call(arr[i],arr[i],i);
      if (value === false) {
        break;
      }
    }
    return arr;
  }

  minjs.prototype = {
    each:function(func){
      return each(this,func);
    },
    on:function(type,fn) {
      each(this,function(el,i){
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
    off:function(nodelist,type) {
      each(this,function(el,i){
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
        Object.keys(node_handlers).forEach(function(key,i){
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
    trigger:function(type, data) {
      // construct an HTML event. This could have
      // been a real custom event
      var event = document.createEvent('HTMLEvents');
      event.initEvent(type, true, true);
      event.data = data || {};
      event.eventName = type;
      //
      each(this,function(el,i){
        event.target = el;
        el.dispatchEvent(event);
      });
      // allow for chaining
      return this;
    },
    addClass:function(className){
      each(this,function(el,i){
        if (el.classList) {
          el.classList.add(className);
        } else if (!$(el).hasClass(className)) {
          el.className += ' ' + className;
        }
      });
      return this;
    },
    removeClass:function(className){
      each(this,function(el,i){
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
      if (el.classList) {
        return el.classList.contains(className);
      } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
      }
      return el;
    },
    attr:function(){
      var el = (this.length > 0) ? this[0] : this;
      if (v === undefined) {
        return el.getAttribute(a);
      } else {
        el.setAttribute(a,v);
        return el;
      }
    },
    css:function(p,v) {
      var el = (this.length > 0) ? this[0] : this;
      if (typeof p === "object") {
        for (var n in p) {
          el.style[n] = p[n];
        }
        return el;
      } else {
        if (v === undefined) {
          return document.defaultView.getComputedStyle(el,null).getPropertyValue(p);
        } else {
          el.style[p] = v;
          return el;
        }
      }
    }
  }

  function $(selector,context){
    var nodes = [];
    if (selector && typeof selector !== "string") {
      nodes = (selector.addClass) ? selector : [selector];
    } else if (selector) {
      nodes = (context || document).querySelectorAll(selector || '☺');
    }
    return new minjs(nodes);
  }

  return $;
})();
