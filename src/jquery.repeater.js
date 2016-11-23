/**
 * jQuery Repeater
 * v1.0.0
 *
 * @param  {Object} $
 * @param  {Object} document
 * @return
 */
(function ($, document) {

	var Repeater = {
        init: function (options, elem) {
        	var self = this;
            self.elem = elem;
            self.$elem = $(self.elem);
            self.options = $.extend({}, $.fn.repeater.options, options);
            self.$container = self.$elem;
            self.$repeatables = self.$container.find(self.options.repeatable);
            self.$closeButton = self.$container.find(self.options.closeButton);

            self.$closeButton.hide();

            this.debug("--------------------------------");
            this.debug("[Repeater]: initialized");

            return self;
        },

        toggle: function (options, self) {
            var self = this;
            self.$repeatables = self.$container.find(self.options.repeatable); // Important: redo the repeatables search here, so we know its the latest count
            var repeatables = self.$repeatables;
            var index = repeatables.length;
            var $last = repeatables.last();
            var $clone = $last.clone();

            self.debug("LAST", repeatables);
            self.debug("[Repeater]: firing `beforeToggle` method");
            self.options.beforeToggle($clone, index, self);
            self.debug("[Repeater]: beforeToggle method end");


            self.debug("[Repeater]: firing `toggle` method");

            if (self.options.clearValueOnClone) {
                $clone.find('input, select').val('');
                $clone.find('textarea').text('');
            }
            // $clone.find('input[name="attr['+(index - 1)+'][key]"], select[name="attr['+(index - 1)+'][key]"]').attr('name', 'attr['+index+'][key]');
            $clone.find(self.options.closeButton).removeClass('hidden-xs-up').show();

            // This is it
            // insert it after the last
            $clone.find(self.options.closeButton).show();
            $last.after($clone);
            self.debug("[Repeater]: repeatables => ", repeatables);
            $clone.find(self.options.focusableElement).focus();

            self.debug("[Repeater]: `toggle` method end");


            self.debug("[Repeater]: firing `afterToggle` method");
            self.options.afterToggle($clone, index, self);
            self.debug("[Repeater]: `afterToggle` method end");

            return true;
        },

        destroy: function () {
        	this.destroy();
        	this.element.unbind( this.eventNamespace )
		    this.bindings.unbind( this.eventNamespace );
        },

        remove: function (callback) {
            var self = this;
            self.$repeatables = self.$container.find(self.options.repeatable); // Important: redo the repeatables search here, so we know its the latest count
            callback(self);
            return true;
        },

        debug: function ($d) {
            var self = this;
        	if (self.options.debug) console.log($d);
        },
    };

    $.fn.repeater = function (options) {
        var repeater = Object.create(Repeater);

        return this.each(function () {
            var self = repeater.init(options, this);

            addButton = $(self.elem).find(self.options.addButton);
            addButton.click(function (e) {
                repeater.toggle(self.options, self);
            });

            repeater.remove(function (self) {
                $(document).on("click", self.options.closeButton, function (e) {
                    $(this).parents(self.options.repeatable).remove();
                });
                return true;
            });

        });
    };

    $.fn.repeater.options = {
        repeatableContainer: '.repeatable-block',
        repeatable: '.repeatable',
        addButton: '.repeatable-button-add',
        closeButton: '.repeatable-close-button',
        focusableElement: 'input:first',
        clearValueOnClone: true,
        debug: false,

        beforeToggle: function (clone, index, self) {},
        afterToggle: function (clone, index, self) {},
    };
    $('[data-toggle=repeater]').repeater();

})(jQuery, document);