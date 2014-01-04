/**
 * @author Levi Lansing
 *
 * Copyright 2013 Levi Lansing
 * Licensed under the MIT license
 *
 */
(function($) {

	// manually set up additional selectors when the dom is loaded
	$(function() {
		$.observer.registerEvents($('.clickable'), 'click');
	});

	// or modify the configuration before $.ready to easily register live selectors
	$.observer.configuration.liveSelectors.mousemove = '.mouseTracking';


	// creating a class for the demo to show how contexts work
	function Demo() {
		this.$info = $('#info');
		this.demo2Counter = 0;

		// register for some events
		$.observer.listenForEvents(this, {
			onDemoChange: this.demoChange,
			onDemo1ButtonClick: this.demo1,
			onDemo1LinkClick: this.demo1,
			onDemo1InputChange: this.demo1,
			onDemo1CheckboxChange: this.demo1,
			onDemo2Click: function(event, element) {
				// as an example, you can register inline functions also
				// notice the context of this is still the demo object
				this.$info.text(event.type);
				alert('Dynamically created link #' + $(element).data('count') + ' was clicked');
			},
			onDemo2CreateClick: this.demo2Create,
			onDemo3ClickableClick: this.demo3Clickable,
			onDemo3RegisterClick: this.demo3Register,
			onDemo3UnregisterClick: this.demo3Unregister
		});
	}

	/**
	 * @param {jQuery.Event} event the jQuery event object
	 * @param {Element} element the target dom element
	 */
	Demo.prototype.demoChange = function(event, element) {
		this.$info.text(event.type);
		var demo = $(element).val();
		$('.demoPage').fadeOut(200);
		$('#demoPage' + demo).fadeIn(200);
	};

	/**
	 * @param {jQuery.Event} event the jQuery event object
	 * @param {Element} element the target dom element
	 */
	Demo.prototype.demo1 = function(event, element) {
		this.$info.text(event.type);
		alert('Element with tag "' + element.tagName + '" was ' + (event.type == 'change' ? 'changed' : 'clicked'));
	};

	/**
	 * @param {jQuery.Event} event the jQuery event object
	 * @param {Element} element the target dom element
	 */
	Demo.prototype.demo2Create = function(event, element) {
		this.$info.text(event.type);
		$('button[name="demo2Open"]').hide();
		$('button[name="demo2Close"]').show();

		this.demo2Counter++;
		$('#demo2Content').append($('<a href="#demo2" data-count="' + this.demo2Counter + '">Click this dynamically added link (#' + this.demo2Counter + ')</a><br />'));
	};

	/**
	 * @param {jQuery.Event} event the jQuery event object
	 * @param {Element} element the target dom element
	 */
	Demo.prototype.demo3Clickable = function(event, element) {
		this.$info.text(event.type);
		$(element).toggleClass('selected');
	};

	/**
	 * @param {jQuery.Event} event the jQuery event object
	 * @param {Element} element the target dom element
	 */
	Demo.prototype.demo3Register = function(event, element) {
		$.observer.listenForEvent(this, 'onDemo3Mousemove', this.mousemove);
	};

	/**
	 * @param {jQuery.Event} event the jQuery event object
	 * @param {Element} element the target dom element
	 */
	Demo.prototype.demo3Unregister = function(event, element) {
		$.observer.stopListeningForEvent(this, 'onDemo3Mousemove');
	};

	/**
	 * @param {jQuery.Event} event the jQuery event object
	 * @param {Element} element the target dom element
	 */
	Demo.prototype.mousemove = function(event, element) {
		this.$info.text(event.type);
		var offset = $(element).offset();
		$(element).text('(' + (event.pageX - Math.round(offset.left)) + ', ' + (event.pageY - Math.round(offset.top)) + ')');
	};

	$(function() {
		window.demo = new Demo();
	});

})(jQuery);
