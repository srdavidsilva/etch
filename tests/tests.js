var selectElementContents = function(el) {
    if (window.getSelection && document.createRange) {
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (document.selection && document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.select();
    }
}

var TestModel = Backbone.Model.extend({
    defaults: {
      blarg: 'bloop'
    }
});

var TestView = Backbone.View.extend({
    events: {
        'mousedown': 'editableClick'
    },

    editableClick: etch.editableInit
})

var myTestText = 'This is some test text.';

var testView, testModel;

module('DOM aware tests', {
    setup: function() {
      var $div = $('<div class="test-text editable" contentEditable="true" button-class="all">'+myTestText+'</div>');
      $('body').append($div);
      selectElementContents($div[0]);
      testModel = new TestModel;
      testView = new TestView({model: testModel, el: $div});    
    },

    teardown: function() {
        $('.test-text').remove();
        testView = testModel = undefined;
    }
});

test("Text Selection", function() {
    equal(document.getSelection().focusNode.data, myTestText, 'The selected text matched');
});

test("Text Format Bold", function() {
    var whatever = etch.views.Editor.prototype.toggleBold(new Event('click'))
    equal(document.getSelection().focusNode.parentElement.outerHTML, '<b>'+myTestText+'</b>', 'Bold tag applied correctly')
});

test('Create/Remove Editor Panel', function() {
    equal(0, $('.etch-editor-panel').length, 'There are 0 editor panels before mousedown in editable');
    $('.test-text').trigger('mousedown');
    equal(1, $('.etch-editor-panel').length, 'There are 1 editor panels after mousedown in editable');
    $('body').trigger('mousedown');
    equal(0, $('.etch-editor-panel').length, 'There are 0 editor panels after mousedown outside of editable');
});

test('Change Button Class', function() {
    $('.test-text').trigger('mousedown');
    equals(etch.buttonClasses.all, testModel.get('buttons'), 'Editor buttons were set correctly');
});

test("a basic test example", function() {
    ok( true, "this test is fine" );
    var value = "hello";
    equals( value, "hello", "We expect value to be hello" );
});

test("Our first QUnit test - asserting results", function(){
    // ok( boolean, message )
    ok( true, "the test succeeds");
    ok( false, "the test fails");
    // equal( actualValue, expectedValue, message )
    equal( myTestText, "Hello Backbone.js", "The value expected is Hello Backbone.js!");
});
