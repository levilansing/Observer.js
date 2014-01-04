/**
 * @author Levi Lansing
 *
 * Copyright 2013 Levi Lansing
 * Licensed under the MIT license
 *
 * See readme for documentation and demo
 * https://github.com/levilansing/Observer/blob/master/README.md
 *
 * version 1.0.0
 */

(function($) {

	function Observer() {
		this.eventRegistration = {};
		this.configuration = {
			liveSelectorParent: 'body',
			liveSelectors: {
				click: 'a,button',
				change: 'input,select,textarea'
			}
		};

		var self = this;
		$(function() {
			var parent = $(self.configuration.liveSelectorParent);
			$.each(self.configuration.liveSelectors, function(event, selector) {
				self.registerLiveEvents(parent, selector, event);
			});
		});
	}

	$.observer = new Observer();

	/**
	 * Manually trigger an event by name
	 * @param {string} event
	 * @param {[]} params to pass to the event handlers
	 */
	Observer.prototype.triggerEvent = function(event, params) {
		if (event && this.eventRegistration[event]) {
			$.each(this.eventRegistration[event], function() {
				return !this[1].apply(this[0], params);
			});
		}
	};

	/**
	 * Register callbacks to listen for a set of events
	 * @param target the context of `this` for the callbacks
	 * @param {{}} handlerList object with event names as the keys and the handlers as the values
	 */
	Observer.prototype.listenForEvents = function(target, handlerList) {
		var self = this;
		$.each(handlerList, function(event, handler) {
			self.listenForEvent(target, event, handler);
		});
	};

	/**
	 * Register to listen for a single event
	 * @param target the context of `this` for the callbacks
	 * @param {string} event the name of the event we want to listen for
	 * @param {function()} handler
	 */
	Observer.prototype.listenForEvent = function(target, event, handler) {
		if (!this.eventRegistration[event]) {
			this.eventRegistration[event] = [];
		}
		this.eventRegistration[event].push([target, handler]);
	};

	/**
	 * Creates an event name from a jQuery DOM Element
	 * @param {jQuery} jQueryElement the dom element as a jQuery collection
	 * @param {string} jQueryEventName the name of the jQuery event
	 * @returns {string}
	 */
	function createEventName(jQueryElement, jQueryEventName) {
		var event = jQueryElement.attr('href');
		if (event && event.charAt(0) == '#') {
			event = event.slice(1);
		} else {
			event = jQueryElement.attr('name') || jQueryElement.attr('id');
		}

		if (!event) {
			return null;
		}

		event = 'on' + event.charAt(0).toUpperCase() + event.slice(1);

		jQueryEventName = jQueryEventName.toLowerCase();
		event += jQueryEventName.charAt(0).toUpperCase() + jQueryEventName.slice(1);

		return event;
	}

	/**
	 * Register events on a jQuery collection to trigger observer events
	 * if eventName is empty, an event name will be generated in the form:
	 *   'on' + (element #href|name|id) + jQueryEventName
	 *
	 * @param {jQuery} jQueryCollection a jQuery collection to create event handlers on
	 * @param {string|[]} jQueryEvent a jQuery event name or array of jQuery event names
	 * @param {string} [eventName] the observer name of the event (optional)
	 */
	Observer.prototype.registerEvents = function(jQueryCollection, jQueryEvent, eventName) {
		if ($.isArray(jQueryEvent)) {
			for (var i = 0; i < jQueryEvent.length; i++) {
				this.registerEvents(jQueryCollection, $.trim(jQueryEvent[i]), eventName);
			}
			return;
		}
		var self = this;
		jQueryCollection[jQueryEvent](function(e) {
			var event = eventName || createEventName($(this), jQueryEvent);
			if (self.eventRegistration[event]) {
				var element = this;
				$.each(self.eventRegistration[event], function() {
					// there is an event handler, cancel the native event
					e.preventDefault();
					// if event handler returns true, we should stop propagating
					return !this[1].call(this[0], e, element);
				});
			}
		});
	};

	/**
	 * Register live events (using $.on) on a jQuery collection using a selector
	 * if eventName is empty, an event name will be generated in the form:
	 *   'on' + (element #href|name|id) + jQueryEventName
	 *
	 * @param {jQuery} jQueryCollectionParent the parent to perform the selector on
	 * @param {string} jQuerySelector the selector representing the dom elements that should be registered
	 * @param {string|[]} jQueryEvent a jQuery event name or array of jQuery event names
	 * @param {string} [eventName] the observer name of the event (optional)
	 */
	Observer.prototype.registerLiveEvents = function(jQueryCollectionParent, jQuerySelector, jQueryEvent, eventName) {
		if ($.isArray(jQueryEvent)) {
			for (var i = 0; i < jQueryEvent.length; i++) {
				this.registerEvents(jQueryCollectionParent, $.trim(jQueryEvent[i]), eventName);
			}
			return;
		}
		var self = this;
		jQueryCollectionParent.on(jQueryEvent, jQuerySelector, function(e) {
			var event = eventName || createEventName($(this), jQueryEvent);
			if (self.eventRegistration[event]) {
				var element = this;
				$.each(self.eventRegistration[event], function() {
					// there is an event handler, cancel the native event
					e.preventDefault();
					// if event handler returns true, we should stop propagating
					return !this[1].call(this[0], e, element);
				});
			}
		});
	};

	/**
	 * Unregister oneself/stop listening for a specific event
	 * @param target the context that was used when registering to listen for the event
	 * @param {string} eventName the name of the event to stop listening for
	 */
	Observer.prototype.stopListeningForEvent = function(target, eventName) {
		if (!this.eventRegistration[eventName]) {
			return;
		}

		var reg = $.map(this.eventRegistration[eventName], function(registration) {
			if (registration[0] == target) {
				return null;
			}
			return [registration];
		});

		if (reg.length == 0) {
			delete this.eventRegistration[eventName];
		} else {
			this.eventRegistration[eventName] = reg;
		}
	};

	/**
	 * Unregister oneself/stop listening for any events
	 * @param target the context that was used when registering to listen for the events
	 */
	Observer.prototype.stopListening = function(target) {
		var self = this;
		$.each(this.eventRegistration, function(eventName, event) {
			var reg = $.map(event, function(registration) {
				if (registration.target == target) {
					return null;
				}
				return [registration];
			});
			if (reg.length == 0) {
				delete self.eventRegistration[eventName];
			} else {
				self.eventRegistration[eventName] = reg;
			}
		})
	};
})(jQuery);
