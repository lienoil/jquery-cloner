/**
 * jQuery Cloner
 * v1.3.4
 *
 * @param  {Object} $
 * @param  {Object} document
 * @return
 */
(function ($, document) {

    'use strict';

	var Cloner = {
        init: function (options, elem) {
            /**
             * Store Cloner to a variable
             *
             * @type Object
             */
        	var self = this;
            self.elem = elem;
            self.$elem = $(self.elem);
            self.options = $.extend({}, $.fn.cloner.options, options);
            self.$container = self.$elem;
            self.$clonables = self.$container.closestChild(self.options.clonable);
            self.$closeButton = self.$container.closestChild(self.options.closeButton);

            /**
             * Add class to distinguish the `original clonables`.
             * This will be helpful later when removing clones.
             *
             */
            self.$clonables.addClass(self.options.sourceName);

            /**
             * Hide All first instance of the closeButton
             * per Clonable Block.
             *
             */
            self.$closeButton.first().hide();

            this.debug("--------------------------------");
            this.debug("[Cloner]: initialized");

            return self;
        },

        toggle: function (options, self) {
            this.debug("start click--------------------------------");

            /**
             * Define variables for use
             * for this method.
             *
             */
            var clonables = self.$clonables;
            var index = clonables.length;
            var $last = clonables.last();
            var $clone = $last.clone(true); // true - clone even the bound events on the element

            /**
             * Check if the `data-clone-number` attribute is present.
             * If not the attribute is not found, then this adds it.
             * Spoiler Alert: This step is not important, really. But it might be! If you let it!
             *
             * @param  !$last[0].hasAttribute('clone-number') check if attribute is present.
             * @return Boolean
             */
            if (!$last[0].hasAttribute('data-clone-number')) {
                $last.attr('data-clone-number', index);
            }

            /**
             * Used .attr, because for some reason
             * using .data doesn't work. maybe because .data
             * is not getting the latest changes?
             *
             * Also, used the `+` sign to parse as int
             *
             */
            var cloneNumber = +$last.attr('data-clone-number');

            /**
             * Toggle class, flagging this as a replicant, I mean a clone.
             *
             */
            $clone.removeClass(self.options.sourceName).addClass(self.options.cloneName);

            self.$last = $last;
            self.$clone = $clone;
            self.cloneNumber = cloneNumber;

            /**
             * If we are decrementing,
             * stop when limitCloneNumbers == true and
             * clone's clone-number is decrementable.
             *
             */
            if (self.options.limitCloneNumbers && self.$clone.hasClass(self.options.clonableCloneNumberDecrement) && self.cloneNumber === 1) {
                return true;
            }

            /**
             * First, Let's check the `data-clone-number`,
             * If it a number greater than 1, then
             * it means we should be decrementing.
             *
             */
            if (self.cloneNumber == 1) {
                this.cloneNumberHandler(self.cloneNumber, self.$clone, 'increment');
            } else if (self.cloneNumber > 1) {
                this.cloneNumberHandler(self.cloneNumber, self.$clone, 'decrement');
            }

            /**
             * Perform the `beforeToggle` method.
             *
             */
            self.debug("[Cloner]: start `beforeToggle` method");
            self.options.beforeToggle($clone, index, self);
            self.debug("[Cloner]: end `beforeToggle` method");

            /**
             * Perform the start of `toggle` method.
             *
             */
            self.debug("[Cloner]: start `toggle` method");

            if (self.options.clearValueOnClone) {
                $clone.find('input, select').val('');
                $clone.find('textarea').text('');
            }

            /**
             * Show the Close button.
             *
             */
            $clone.closestChild(self.options.closeButton).show();

            /**
             * Perform the incrementations
             * and/or decrementations.
             *
             */
            this.increment($clone, index, self);
            this.decrement($clone, index, self);

            /**
             * Perform values reset.
             *
             */
            this.nestedClonesHandler($clone, index, self);

            self.debug("[Cloner]: start clone append");

            /**
             * -------------------------------------
             * THIS IS IT
             * -------------------------------------
             * This is the magic line that adds the
             * cloned element next to the last instance
             * of the element on the DOM.
             *
             */
            $last.after($clone);

            self.debug("[Cloner]: end clone append");

            /**
             * Focus on the element specified.
             *
             */
            $clone.find(self.options.focusableElement).focus();

            self.debug("[Cloner]: end `toggle` method");

            /**
             * Perform the `afterToggle` method.
             *
             */
            self.debug("[Cloner]: start `afterToggle` method");
            self.options.afterToggle($clone, index, self);
            self.debug("[Cloner]: end `afterToggle` method");

            this.debug("end click--------------------------------");

            return true;
        },

        cloneNumberHandler: function (cloneNumber, $clone, type) {
            if (type == 'increment') {
                /**
                 * Increment data-clone-number
                 * If the attribute do not exist, create.
                 *
                 */
                $clone.attr('data-clone-number', cloneNumber + 1);
            } else if (type == 'decrement') {
                /**
                 * Decrement data-clone-number
                 * If the attribute do not exist, create.
                 *
                 */
                $clone.attr('data-clone-number', cloneNumber - 1);
            }
        },

        increment: function ($clone, index, self) {
            /**
             * Instance of the Cloner Object
             *
             * @type Object
             */
            var r = this;

            /**
             * All valid incrementables
             *
             * @type Object
             */
            var incrementables = $clone.find('[class*="'+self.options.incrementName+'"]').filter(function (i, e) {
                return $(e).closest(self.options.clonable).get(0) == $clone.get(0);
            });

            /**
             * The clone ID of the current Clone.
             *
             * @type int
             */
            var _i = $clone[0].hasAttribute('clone-number') ? $clone.data('clone-number') : index;

            r.debug("[Cloner]: start increment | Clone number: " + _i + " | Index: " + index);

            incrementables.each(function () {
                var classes = $(this).attr('class').split(' ');
                for (var i = classes.length - 1; i >= 0; i--) {
                    var reg = new RegExp(self.options.incrementName, "g");
                    if (reg.test(classes[i])) {
                        var attr = classes[i].split(self.options.incrementName);
                        attr = attr[1].replace('-', '');
                        switch (attr) {
                            case 'value':
                                var old_val = $(this).val();
                                var new_val = old_val.replace(/-?\d+/g, function (n) { return ++n; });
                                $(this).val(new_val);
                                break;

                            case 'html':
                                var old_val = $(this).html();
                                var new_val = old_val.replace(/-?\d+/g, function (n) { return ++n; });
                                $(this).html(new_val);
                                break;

                            case 'text':
                                var old_val = $(this).text();
                                var new_val = old_val.replace(/-?\d+/g, function (n) { return ++n; });
                                $(this).text(new_val);
                                break;

                            case 'for':
                            case 'id':
                            case 'class':
                            default:
                                if (!$(this)[0].hasAttribute(attr)) {
                                    break;
                                }

                                var old_val = $(this).attr(attr);
                                var new_val = old_val.replace(/-?\d+/g, function (n) { return ++n; });

                                $(this).attr(attr, new_val);
                                break;
                        }
                    }
                }

                r.debug("[Cloner]: incrementing values... | Clone Number: " +_i);

            });

            r.debug("[Cloner]: end increment ");
        },

        decrement: function ($clone, index, self) {
            /**
             * Instance of the Cloner Object
             *
             * @type Object
             */
            var r = this;

            /**
             * All valid decrementables
             *
             * @type Object
             */
            var decrementables = $clone.find('[class*="'+self.options.decrementName+'"]').filter(function (i, e) {
                return $(e).closest(self.options.clonable).get(0) == $clone.get(0);
            });

            /**
             * The clone ID of the current Clone.
             *
             * @type int
             */
            var _i = $clone[0].hasAttribute('clone-number') ? $clone.data('clone-number') : index;

            r.debug("[Cloner]: start increment | Clone number: " + _i + " | Index: " + index);

            decrementables.each(function () {
                var classes = $(this).attr('class').split(' ');
                for (var i = classes.length - 1; i >= 0; i--) {
                    var reg = new RegExp(self.options.decrementName, "g");
                    if (reg.test(classes[i])) {
                        var attr = classes[i].split(self.options.decrementName);
                        attr = attr[1].replace('-', '');
                        switch (attr) {
                            case 'value':
                                var old_val = $(this).val();
                                var new_val = old_val.replace(/-?\d+/g, function (n) { return --n; });
                                $(this).val(new_val);
                                break;

                            case 'html':
                                var old_val = $(this).html();
                                var new_val = old_val.replace(/-?\d+/g, function (n) { return --n; });
                                $(this).html(new_val);
                                break;

                            case 'text':
                                var old_val = $(this).text();
                                var new_val = old_val.replace(/-?\d+/g, function (n) { return --n; });
                                $(this).text(new_val);
                                break;

                            case 'for':
                            case 'id':
                            case 'class':
                            default:
                                var old_val = $(this).attr(attr);
                                var new_val = old_val.replace(/-?\d+/g, function (n) { return --n; });
                                $(this).attr(new_val);
                                break;
                        }
                    }
                }

                r.debug("[Cloner]: incrementing values... | Clone Number: " +_i);

            });

            r.debug("[Cloner]: end increment ");
        },

        nestedClonesHandler: function ($clone, index, self) {
            /**
             * Remove all Nested Clones' clone.
             * This will revert the nested clone to it's original elements.
             *
             */
            if (self.options.removeNestedClonablesOnClone) {
                var nestedClonables = $clone.closestChild(self.options.clonable);
                nestedClonables.not("." + self.options.sourceName).remove();
            }

            return self;
        },

        destroy: function () {
        	this.destroy();
        	this.element.unbind( this.eventNamespace )
		    this.bindings.unbind( this.eventNamespace );
        },

        remove: function (callback) {
            var self = this;
            self.$clonables = self.$container.find(self.options.clonable); // Important: redo the clonables search here, so we know its the latest count
            callback(self);
            return true;
        },

        debug: function ($d) {
            var self = this;
        	if (self.options.debug) console.log($d);
        },
    };

    $.fn.cloner = function (options) {
        var cloner = Object.create(Cloner);

        return this.each(function () {
            var self = cloner.init(options, this);

            var addButton = self.$elem.closestChild(self.options.addButton);

            $(addButton).on('click', function (e) {
                // Important: redo the clonables search here, so we know its the latest count
                // Also it is crucial to make the `addButton` the starting point in finding the `clonables`
                // This makes multiple instance possible, coupled with the custom `closesChild` method.
                self.$clonables = $(this).closest(self.options.clonableContainer).closestChild(self.options.clonable);

                cloner.toggle(self.options, self);
                e.preventDefault();
            });

            cloner.remove(function (self) {
                $(document).on("click", self.options.closeButton, function (e) {
                    $(this).closest(self.options.clonable).remove();
                });
                return true;
            });

        });
    };

    /**
     * jquery.closestchild 0.1.1
     *
     * Author: Andrey Mikhaylov aka lolmaus
     * Email: lolmaus@gmail.com
     *
     */
    $.fn.closestChild = function (selector) {
        var $children, $results;

        $children = this.children();

        if ($children.length === 0) {
            return $();
        }

        $results = $children.filter(selector);

        if ($results.length > 0) {
            return $results;
        } else {
            return $children.closestChild(selector);
        }
    };

    $.fn.cloner.options = {
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

        clonableCloneNumberDecrement: 'clonable-clone-number-decrement',

        incrementName: 'clonable-increment',
        decrementName: 'clonable-decrement',

        beforeToggle: function (clone, index, self) {},
        afterToggle: function (clone, index, self) {},
    };

    $(document).find('[data-toggle=cloner]').each(function () {
        $(this).cloner(Object.assign({}, $(this).data('options') || {}));
    })

})(jQuery, document);
