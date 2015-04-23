QUnit.module("Global");

QUnit.test("min$ valid function", function(assert) {
  assert.equal(typeof min$, "function", "min$ valid function passed");
});

// Query elements
QUnit.module("Query elements");

QUnit.test("Query tagName", function(assert) {
  assert.equal(min$('ul').length, 1, "Query tagName passed");
});

QUnit.test("Query className", function(assert) {
  assert.equal(min$('.list-item').length, 3, "Query className passed");
});

QUnit.test("Query ID", function(assert) {
  assert.equal(min$('#list_item_1').length, 1, "Query ID passed");
});

QUnit.test("Query attribute", function(assert) {
  assert.equal(min$('[data-attribute]').length, 1, "Query attribute passed");
});

QUnit.test("Query with context", function(assert) {
  assert.equal(min$('a',document.getElementById("list_item_1")).length, 1, "Query with context passed");
});

QUnit.test("Query with node", function(assert) {
  assert.equal(min$(document.getElementById("list_item_1")).length, 1, "Query with node passed");
});

QUnit.test("Query with min$ object", function(assert) {
  assert.equal(min$(min$("ul")).length, 1, "Query with min$ object passed");
});


// Looping
QUnit.module("Looping");

QUnit.test("Looping: each", function(assert) {
  var str = "";
  min$('.list-item').each(function(el,index){
    str += index+el.innerHTML;
  });
  assert.equal(str, "0a1b2c", "each passed");
});

QUnit.test("Looping: each (breaking the loop)", function(assert) {
  var str = "";
  min$('.list-item').each(function(el,index){
    str += index+el.innerHTML;
    if (index === 1) {
      return false;
    }
  });
  assert.equal(str, "0a1b", "each (breaking the loop) passed");
});

QUnit.test("Looping: $.each", function(assert) {
  var arr = ['a','b','c'];
  var str = "";
  min$.each(arr, function(value,index){
    str += index+value;
  });
  assert.equal(str, "0a1b2c", "$.each passed");
});

// Events - trigger
QUnit.module("Events - trigger");

QUnit.test("Events: trigger", function(assert) {
  assert.expect(1);
  document.getElementById("button").addEventListener("click", function(){
    assert.ok(true, "Events: trigger - passed");
  }, false);
  min$("#button").trigger("click");
});

// Events - on
QUnit.module("Events - on");

QUnit.test("Events: on", function(assert) {
  assert.expect(1);
  min$("#button").on("click", function() {
    assert.ok(true, "Events: on - passed");
  });
  min$("#button").trigger("click");
});

QUnit.test("Events: on.namespace", function(assert) {
  assert.expect(1);
  min$("#button").on("click.namespace", function() {
    assert.ok(true, "Events: on.namespace - passed");
  });
  min$("#button").trigger("click");
});

// Events - custom
QUnit.module("Events - custom");

QUnit.test("Events: custom", function(assert) {
  assert.expect(1);
  min$(document).on("foo", function() {
    assert.ok(true, "Events: custom - passed");
  });
  min$(document).trigger("foo");
});

// Events - off
QUnit.module("Events - off");

QUnit.test("Events: off (all handlers)", function(assert) {
  var count = 0;
  min$("#button").on("click", function() {
    count++;
  });
  min$("#button").on("mousedown", function() {
    count++;
  });
  min$("#button").trigger("click");
  min$("#button").trigger("mousedown");
  min$("#button").off();
  min$("#button").trigger("click");
  min$("#button").trigger("mousedown");
  assert.equal(count, 2, "Events: off (all handlers) - passed");
});

QUnit.test("Events: off (named handler)", function(assert) {
  var count = 0;
  min$("#button").on("click", function() {
    count++;
  });
  min$("#button").on("mousedown", function() {
    count++;
  });
  min$("#button").trigger("click");
  min$("#button").trigger("mousedown");
  min$("#button").off("click");
  min$("#button").trigger("click");
  min$("#button").trigger("mousedown");
  assert.equal(count, 3, "Events: off (named handler) - passed");
});

QUnit.test("Events: off (namespaced named handler)", function(assert) {
  var count = 0;
  min$("#button").on("click", function() {
    count++;
  });
  min$("#button").on("click.foo", function() {
    count++;
  });
  min$("#button").trigger("click");
  min$("#button").off("click.foo");
  min$("#button").trigger("click");
  assert.equal(count, 3, "Events: off (namespaced named handler) - passed");
});

QUnit.test("Events: off (namespaced handler)", function(assert) {
  var count = 0;
  min$("#button").on("click", function() {
    count++;
  });
  min$("#button").on("click.foo", function() {
    count++;
  });
  min$("#button").on("mousedown.foo", function() {
    count++;
  });
  min$("#button").trigger("click");
  min$("#button").trigger("mousedown");
  min$("#button").off(".foo");
  min$("#button").trigger("click");
  min$("#button").trigger("mousedown");
  assert.equal(count, 4, "Events: off (namespaced handler) - passed");
});

// Index
QUnit.module("Index method");

var index_test_html = '<ol><li><a href="#">a</a></li><li><a href="#">b</a></li><li id="index_test"><a href="#">c</a></li></ol>';

QUnit.test("passing a node", function(assert) {
  document.getElementById("target").innerHTML = index_test_html;
  var node = document.getElementById("index_test");
  var pos = min$("#target ol > li").index(node);
  document.getElementById("target").innerHTML = "";
  assert.equal(pos, 2, "passed");
});

QUnit.test("passing a min$ collection", function(assert) {
  document.getElementById("target").innerHTML = index_test_html;
  var node = min$("#index_test");
  var pos = min$("#target ol > li").index(node);
  document.getElementById("target").innerHTML = "";
  assert.equal(pos, 2, "passed");
});

QUnit.test("nothing passed", function(assert) {
  document.getElementById("target").innerHTML = index_test_html;
  var pos = min$("#target ol > li").index();
  document.getElementById("target").innerHTML = "";
  assert.equal(pos, 0, "passed");
});

QUnit.test("no match", function(assert) {
  document.getElementById("target").innerHTML = index_test_html;
  var node = min$("#fail");
  var pos = min$("#target ol > li").index(node,true);
  document.getElementById("target").innerHTML = "";
  assert.equal(pos, -1, "passed");
});

// CSS class methods
QUnit.module("CSS Class methods");

QUnit.test("add", function(assert) {
  min$("ul > li").addClass("testClass");
  assert.equal(min$('ul > li.testClass').length, 3, "passed");
});

QUnit.test("remove", function(assert) {
  min$("ul > li.removeClass").removeClass("removeClass");
  assert.equal(min$('ul > li.removeClass').length, 0, "passed");
});

QUnit.test("hasClass, class present", function(assert) {
  assert.equal(min$("#list_item_1").hasClass("hasClass"), true, "passed");
});

QUnit.test("hasClass, class not present", function(assert) {
  assert.equal(min$("#list_item_2").hasClass("hasClass"), false, "passed");
});

// Read/write attributes
QUnit.module("Attributes methods");

QUnit.test("read", function(assert) {
  assert.equal(min$("ul").attr("data-attribute"), "test", "passed");
});

QUnit.test("write", function(assert) {
  min$("ol > li").attr("data-attribute","test");
  assert.equal(min$("#list_item_3").attr("data-attribute"), "test", " passed");
});

// Read/write CSS styles
QUnit.module("CSS style methods");

QUnit.test("read", function(assert) {
  assert.equal(min$("#button").css("display"), "inline", "passed");
});

QUnit.test("write", function(assert) {
  min$("#button").css("display","block")
  assert.equal(min$("#button").css("display"), "block", "passed");
});

QUnit.test("write with object", function(assert) {
  var str = "";
  min$("#target").css({
    paddingLeft: "5px",
    marginBottom: "10px"
  });
  str += min$("#target").css("padding-left");
  str += min$("#target").css("margin-bottom");
  assert.equal(str, "5px10px", "passed");
});

// Extending
QUnit.module("Extending");

QUnit.test("extend min$", function(assert) {
  var str = "";
  min$.extend_test = function(num) {
    return num * 2;
  };
  str += typeof min$.extend_test;
  str += min$.extend_test(1);
  assert.equal(str, "function2", "passed");
});

QUnit.test("extend min$ prototype", function(assert) {
  var str = "";
  min$.prototype.extend_test = function() {
    var el = this[0];
    return el.tagName.toLowerCase();
  };
  str += typeof min$.prototype.extend_test;
  str += min$("#target").extend_test();
  assert.equal(str, "functiondiv", "passed");
});

// Chaining
QUnit.module("Chaining");

QUnit.test("each", function(assert) {
  var str = "";
  var count = 0;
  var test = min$("li").each(function(el){
    count++;
  });
  str += typeof test;
  str += (test.length && test.addClass) ? "true" : "false";
  assert.equal(str, "objecttrue", "passed");
});
QUnit.test("on", function(assert) {
  var str = "";
  var count = 0;
  var test = min$("li").on("click",function(el){
    count++;
  });
  str += typeof test;
  str += (test.length && test.addClass) ? "true" : "false";
  assert.equal(str, "objecttrue", "passed");
});
QUnit.test("off", function(assert) {
  var str = "";
  var test = min$("li").off("click");
  str += typeof test;
  str += (test.length && test.addClass) ? "true" : "false";
  assert.equal(str, "objecttrue", "passed");
});
QUnit.test("trigger", function(assert) {
  var str = "";
  var test = min$("li").trigger("foo");
  str += typeof test;
  str += (test.length && test.addClass) ? "true" : "false";
  assert.equal(str, "objecttrue", "passed");
});
QUnit.test("addClass", function(assert) {
  var str = "";
  var test = min$("li").addClass("foo");
  str += typeof test;
  str += (test.length && test.addClass) ? "true" : "false";
  assert.equal(str, "objecttrue", "passed");
});
QUnit.test("removeClass", function(assert) {
  var str = "";
  var test = min$("li").removeClass("foo");
  str += typeof test;
  str += (test.length && test.addClass) ? "true" : "false";
  assert.equal(str, "objecttrue", "passed");
});
QUnit.test("write attribute", function(assert) {
  var str = "";
  var test = min$("li").attr("foo","bar");
  str += typeof test;
  str += (test.length && test.addClass) ? "true" : "false";
  assert.equal(str, "objecttrue", "passed");
});
QUnit.test("set style", function(assert) {
  var str = "";
  var test = min$("li").css("display","block");
  str += typeof test;
  str += (test.length && test.addClass) ? "true" : "false";
  assert.equal(str, "objecttrue", "passed");
});
QUnit.test("set style with object", function(assert) {
  var str = "";
  var test = min$("li").css({ display:"block" });
  str += typeof test;
  str += (test.length && test.addClass) ? "true" : "false";
  assert.equal(str, "objecttrue", "passed");
});
QUnit.test("chaining sanity check", function(assert) {
  var str = "";
  var test = min$("li").addClass("foo").removeClass("foo");
  str += typeof test;
  str += (test.length && test.addClass) ? "true" : "false";
  str += min$("li.foo").length;
  assert.equal(str, "objecttrue0", "passed");
});

