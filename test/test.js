QUnit.test("min$ valid function", function(assert) {
  assert.equal(typeof min$, "function", "min$ valid function passed");
});

// Query elements

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


// Events - on

QUnit.test("Events: on", function(assert) {
  assert.expect(1);
  min$("#button").on("click", function() {
    assert.ok(true, "Events: on - passed");
  });
  // using jquery to trigger the click, so we're not testing min$ trigger yet!
  jQuery("#button").trigger("click");
});

QUnit.test("Events: on.namespace", function(assert) {
  assert.expect(1);
  min$("#button").on("click.namespace", function() {
    assert.ok(true, "Events: on.namespace - passed");
  });
  // using jquery to trigger the click, so we're not testing min$ trigger yet!
  jQuery("#button").trigger("click.namespace");
});

// Events - trigger

QUnit.test("Events: trigger", function(assert) {
  assert.expect(1);
  min$("#button").on("click", function() {
    assert.ok(true, "Events: trigger - passed");
  });
  min$("#button").trigger("click");
});

// Events - custom

QUnit.test("Events: custom", function(assert) {
  assert.expect(1);
  min$(document).on("foo", function() {
    assert.ok(true, "Events: custom - passed");
  });
  min$(document).trigger("foo");
});

// Events - off

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

var index_test_html = '<ol><li><a href="#">a</a></li><li><a href="#">b</a></li><li id="index_test"><a href="#">c</a></li></ol>';

QUnit.test("Index: passing a node", function(assert) {
  document.getElementById("target").innerHTML = index_test_html;
  var node = document.getElementById("index_test");
  var pos = min$("#target ol > li").index(node);
  document.getElementById("target").innerHTML = "";
  assert.equal(pos, 2, "Index: passing a node - passed");
});

QUnit.test("Index: passing a min$ collection", function(assert) {
  document.getElementById("target").innerHTML = index_test_html;
  var node = min$("#index_test");
  var pos = min$("#target ol > li").index(node);
  document.getElementById("target").innerHTML = "";
  assert.equal(pos, 2, "Index: passing a min$ collection - passed");
});

QUnit.test("Index: nothing passed", function(assert) {
  document.getElementById("target").innerHTML = index_test_html;
  var pos = min$("#target ol > li").index();
  document.getElementById("target").innerHTML = "";
  assert.equal(pos, 0, "Index: nothing passed - passed");
});

QUnit.test("Index: no match", function(assert) {
  document.getElementById("target").innerHTML = index_test_html;
  var node = min$("#fail");
  var pos = min$("#target ol > li").index(node);
  document.getElementById("target").innerHTML = "";
  assert.equal(pos, -1, "Index: no match - passed");
});

// CSS class functions

QUnit.test("CSS class functions: add", function(assert) {
  min$("ul > li").addClass("testClass");
  assert.equal(min$('ul > li.testClass').length, 3, "CSS class functions: add - passed");
});

QUnit.test("CSS class functions: remove", function(assert) {
  min$("ul > li.removeClass").removeClass("removeClass");
  assert.equal(min$('ul > li.removeClass').length, 0, "CSS class functions: remove - passed");
});

QUnit.test("CSS class functions: hasClass, class present", function(assert) {
  assert.equal(min$("#list_item_1").hasClass("hasClass"), true, "CSS class functions: hasClass, class present - passed");
});

QUnit.test("CSS class functions: hasClass, class not present", function(assert) {
  assert.equal(min$("#list_item_2").hasClass("hasClass"), false, "CSS class functions: hasClass, class present - passed");
});
