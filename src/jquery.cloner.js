/**
 * jQuery Cloner
 * v1.0.0
 *
 * @param  {Object} $
 * @param  {Object} document
 * @return
 */
(function ($, document) {

	var Cloner = {
        init: function (options, elem) {
        	var self = this;
            self.elem = elem;
            self.$elem = $(self.elem);
            self.options = $.extend({}, $.fn.cloner.options, options);
            self.$container = self.$elem;
            self.$clonables = self.$container.find(self.options.clonable);
            self.$closeButton = self.$container.find(self.options.closeButton);

            self.$closeButton.hide();

            this.debug("--------------------------------");
            this.debug("[Cloner]: initialized");

            return self;
        },

        toggle: function (options, self) {
            var self = this;
            self.$clonables = self.$container.find(self.options.clonable); // Important: redo the clonables search here, so we know its the latest count
            var clonables = self.$clonables;
            var index = clonables.length;
            var $last = clonables.last();
            var $clone = $last.clone();

            self.debug("LAST", clonables);
            self.debug("[Cloner]: firing `beforeToggle` method");
            self.options.beforeToggle($clone, index, self);
            self.debug("[Cloner]: beforeToggle method end");


            self.debug("[Cloner]: firing `toggle` method");

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
            self.debug("[Cloner]: clonables => ", clonables);
            $clone.find(self.options.focusableElement).focus();

            self.debug("[Cloner]: `toggle` method end");


            self.debug("[Cloner]: firing `afterToggle` method");
            self.options.afterToggle($clone, index, self);
            self.debug("[Cloner]: `afterToggle` method end");

            return true;
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

            addButton = $(self.elem).find(self.options.addButton);
            addButton.click(function (e) {
                cloner.toggle(self.options, self);
            });

            cloner.remove(function (self) {
                $(document).on("click", self.options.closeButton, function (e) {
                    $(this).parents(self.options.clonable).remove();
                });
                return true;
            });

        });
    };

    $.fn.cloner.options = {
        clonableContainer: '.clonable-block',
        clonable: '.clonable',
        addButton: '.clonable-button-add',
        closeButton: '.clonable-button-close',
        focusableElement: 'input:first',
        clearValueOnClone: true,
        debug: false,

        beforeToggle: function (clone, index, self) {},
        afterToggle: function (clone, index, self) {},
    };
    $('[data-toggle=cloner]').cloner();

})(jQuery, document);