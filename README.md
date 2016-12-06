# jQuery Cloner
A jQuery plugin to clone HTML content

## Getting Started
This guide will help you install and use jQuery Cloner. See deployment for notes on how to deploy this plugin on frontend development on a live website.

### Installation
via bower:
```
bower install jquery-cloner
```

via npm:
```
npm install jquery-cloner
```

or download or clone (pun!) on [GitHub](https://github.com/lioneil/jquery-cloner).


### Usage
jQuery Cloner relies on classes and attributes to work.

A simple sample markup:

```html
<!-- initialize jQuery-Cloner via the `data-toggle=cloner` attribute -->
<div class="clonable-block" data-toggle="cloner">
    <div class="clonable" data-clone-number="1">
        <label for="attr_1" class="clonable-increment-for">Attribute <span class="clonable-increment-html">1</span></label>
		<input id="attr_1" class="clonable-increment-id clonable-increment-name" type="text" name="attr[0]">
		<button type="button" class="clonable-button-close">Delete</button>
    </div>
    <button class="clonable-button-add" type="button">Add Attributes</button>
</div>

<!-- jQuery is, of course, a dependency -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<!-- Our main man here -->
<script src="jquery-cloner/dist/jquery-cloner.min.js"></script>
```
In the example above, the ```data-toggle="cloner"``` will automatically initialize our HTML.

Manual initialization, then, is as easy as:

```
// main.js
(function ($) {
    $('#my-clonable-block').cloner();
})(jQuery);
```
### Options
The plugin have options you can modify. Below is the list of options with their default values:

```
$('#my-clonable-block').cloner({
    clonableContainer: '.clonable-block',
    clonable: '.clonable',
    addButton: '.clonable-button-add',
    closeButton: '.clonable-button-close',
    focusableElement: ':input:visible:enabled:first',

    clearValueOnClone: true,
    removeNestedClonablesOnClone: true,
    limitCloneNumbers: true,

    debug: false,

    cloneName: 'clonable-clone',
    sourceName: 'clonable-source',

    incrementName: 'clonable-increment',
    decrementName: 'clonable-decrement',
});
```

**clonableContainer** - The class that should contain all our clonable elements, including the Add Button

**clonable** - The class of the clonable element. This is the html chunk that will be repeated.

**addButton** - The class of the button that will fire the `toggle` method, prompting the cloning action.

**closeButton** - The class of the button that will fire the `remove` method, prompting to remove the clonable element. *Important*: this element should be inside a `clonable` element.

**focusableElement** - The attribute or input tag inside a newly cloned `clonable` to place the cursor over.

**clearValueOnClone** - The plugin will clone the last instance of the `clonable` class. This option will toggle to remove or retain all previous input values.

**removeNestedClonablesOnClone** - Toggle to remove all clone instances of the `clonableContainer`.

**limitCloneNumbers** - Will only work for decrementing `clonables`.

**debug** - Switch `console.log`ging on/off.

**incrementName** - this option will increment all values inside a `clonable`. It uses suffixes (html, value, and any attribute like class, id, etc.) to know which integers will be incremented.
Take the below as an example:

```
<input id="attr_1" class="clonable-increment-id clonable-increment-name" type="text" name="attr[0]">
```

In this example, we have classes of `clonable-increment`s with suffixes `-id` and `-name` which corresponds with the `input tag's` `id=attr_1` and `name="attr[0]"`. Performing a clone, therefore will result in


```
<input id="attr_1" class="clonable-increment-id clonable-increment-name" type="text" name="attr[0]">
<input id="attr_2" class="clonable-increment-id clonable-increment-name" type="text" name="attr[1]">
```
It does this using `regex`.

**decrementName** - The reverse of increment.

**beforeToggle** - this is a function callback you can hook into before the `cloning` action is fired. It accepts parameters `$clone`( the clone of the last `clonable`), `index` (the `clonables`' length), and `self` (a catch-all reference of the jQuery-Cloner itself). An example use case:
```
$('#my-clonable-block').cloner({
    beforeToggle: function ($clone, i, self) {
        // console.log(self);
		var $container = self.$container;
		if ($clone.find('input:last').val() == "") {
		    $container.css({border:'1px solid red'});
		} else {
			$container.css({border:'none'});
		}
    },
});
```

**afterToggle** - this will fire after the `cloning` action is triggered.


### Deployment
Copy the /dist/\*.js folder to your project


### Versioning
The project uses SemVer for versioning. For the versions available, see the tags on this repository.


### Authors
* John Lioneil Dionisio

See also the list of [contributors](#) who participated in this project.


### License
[MIT License](https://raw.githubusercontent.com/lioneil/jquery-cloner/master/LICENSE)



### Acknowledgment
* Andrey Mikhaylov (aka lolmaus) for his [jquery.closestchild](https://github.com/lolmaus/jquery.closestchild)
* Everyone over at [stackoverflow](http://stackoverflow.com/tags/jquery), and other various resources.
* to the Muses of Inspiration