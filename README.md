# Observer.js

A simple and effective event observer plugin for jQuery. Implement the observer pattern in your javascript with a few lines of code.

Usage:

```javascript
$.observer.listenForEvents(this, {
	eventName: function(arg1, arg2, ...) {
		// handle a named event
		// return true from any listener to stop other others from receiving the event
	},
	onSomeHREFClick: function(event, element) { 
		// handle the click event for a <a href="#someHREF"></a>
		// you do not need to call event.preventDefault(), this happens automatically if a handler exists
	},
	onSomeElementIdClick: function(event, element) {
		// handle a click event for a registered element
		// such as <button id="someElementId"></button>
	},
	onElementNameChange: function(event, element) {
		// handle the change event
	},
	onElementNameFocus: function(event, element) {
		// handle the focus event 
	}
});

// trigger a named event
$.observer.trigger('eventName', [arg1, arg2, ...]);

// register an event on a jQuery collection
$.observer.registerEvents($('.someClass'), 'focus');

// register a custom named event on a jQuery collection
$.observer.registerEvents($('#someId,#someOtherId'), 'focus', 'iGotFocus');

```

## jQuery Events in the DOM

By default, Observer registers the following jQuery events as a $.on() live event registration:


| Selector                | jQuery Event |
| ----------------------- | ------------ |
| a, button               | click        |
| input, select, textarea | change       |

Adding any of these elements to the DOM at any time will automatically register their click or change events.


## jQuery Event Naming Scheme
jQuery based events are automatically named by the element's attributes:

**on** + (element's **#href** *or* **name** *or* **id** in that order) + **jQueryEventName**

Example:

```html
<a href="#example" id="link1">Link 1</a>
<a href="http://github.com/" id="link2">Link 2</a>
<select name="example3" id="uniqueId_1"> ... </select>
<a>Link 3</a>
```


* Clicking link 1 triggers: **onExampleClick**
* Clicking link 2 triggers: **onLink2Click**
* Changing the select option triggers: **onExample3Change**
* Clicking link 3 does not trigger an event (no href, name, or id supplied)

## Overriding the defaults
To disable the automatic live registration of common form elements and links, change the configuration before the document is ready:

```javascript
$.observer.configuration.liveSelectors = [];
```
Then you can register your own live or non-live selectors as desired.

## Stop Listening
Event listeners are registered with a target and an event name. To stop listening for events, use the following:

```javascript
// Unregister the current context/object for a specific event
$.observer.stopListeningForEvent(this, 'eventName');

// Unregister all events the current context/object has registered for
$.observer.stopListening(this);

```

## Unregistering jQuery Events
Currently jQuery events cannot be unregistered. You can however use `$('selector').remove()` and then re-add the element to the DOM to remove all event listeners, including observer created ones (assuming live registration is not configured for that element).
