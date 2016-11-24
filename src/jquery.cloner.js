/**
 * jQuery Cloner
 * v1.1.0
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
            this.debug("start click--------------------------------");
            self.$clonables = $(document).find(self.options.clonableContainer + " " + self.options.clonable); // Important: redo the clonables search here, so we know its the latest count
            var clonables = self.$clonables;
            var index = clonables.length;
            var $last = clonables.last();
            self.$last = $last;
            var $clone = $last.clone();

            self.debug("[Cloner]: start `beforeToggle` method");
            self.options.beforeToggle($clone, index, self);
            self.debug("[Cloner]: end `beforeToggle` method");


            self.debug("[Cloner]: start `toggle` method");

            if (self.options.clearValueOnClone) {
                $clone.find('input, select').val('');
                $clone.find('textarea').text('');
            }
            // $clone.find('input[name="attr['+(index - 1)+'][key]"], select[name="attr['+(index - 1)+'][key]"]').attr('name', 'attr['+index+'][key]');
            $clone.find(self.options.closeButton).show();

            // This is it
            // insert it after the last
            $clone.find(self.options.closeButton).show();
            this.increment($clone, index, self);
            this.decrement($clone, index, self);
            self.debug("[Cloner]: start clone append");
            $last.after($clone);
            self.debug("[Cloner]: end clone append");
            $clone.find(self.options.focusableElement).focus();

            self.debug("[Cloner]: end `toggle` method");


            self.debug("[Cloner]: start `afterToggle` method");
            self.options.afterToggle($clone, index, self);
            self.debug("[Cloner]: end `afterToggle` method");
            this.debug("end click--------------------------------");

            return true;
        },

        decrement: function ($clone, index, self) {
            var r = this;
            var decrementables = self.$container.find('[class*="'+self.options.decrementName+'"]');
            var _i_ = $clone.data('clone-number');
            r.debug("[Cloner]: start decrement | Clone number: " + _i_ + " | Index: " + index);
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
                                var old_num = +old_val.match(/\d/g).join("") - 1;
                                $(this).val(old_val.replace(/\d+/, old_num));
                                break;

                            case 'html':
                                var old_val = $(this).html();
                                var old_num = +old_val.match(/\d/g).join("") - 1;
                                $(this).html(old_val.replace(/\d+/, old_num));
                                break;

                            case 'text':
                                var old_val = $(this).text();
                                var old_num = +old_val.match(/\d/g).join("") - 1;
                                $(this).text(old_val.replace(/\d+/, old_num));
                                break;

                            case 'for':
                            case 'id':
                            case 'class':
                            default:
                                var old_val = $(this).attr(attr);
                                var old_num = +old_val.match(/\d/g).join("") - 1;
                                $(this).attr(attr, old_val.replace(/\d+/, old_num));
                                break;
                        }
                    }
                }
                r.debug("[Cloner]: decrementing values... | Clone Number: " +_i_);
            });
            r.debug("[Cloner]: end decrement ");
        },

        increment: function ($clone, index, self) {
            var r = this;
            $clone.attr('data-clone-number', self.$last.data('clone-number') + 1);
            var incrementables = $clone.find('[class*="'+self.options.incrementName+'"]');
            var _i_ = $clone.data('clone-number');
            r.debug("[Cloner]: start increment | Clone number: " + _i_ + " | Index: " + index);
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
                                var old_num = +old_val.match(/\d/g).join("") + 1;
                                $(this).val(old_val.replace(/\d+/, old_num));
                                break;

                            case 'html':
                                var old_val = $(this).html();
                                var old_num = +old_val.match(/\d/g).join("") + 1;
                                $(this).html(old_val.replace(/\d+/, old_num));
                                break;

                            case 'text':
                                var old_val = $(this).text();
                                var old_num = +old_val.match(/\d/g).join("") + 1;
                                $(this).text(old_val.replace(/\d+/, old_num));
                                break;

                            case 'for':
                            case 'id':
                            case 'class':
                            default:
                                var old_val = $(this).attr(attr);
                                var old_num = +old_val.match(/\d/g).join("") + 1;
                                $(this).attr(attr, old_val.replace(/\d+/, old_num));
                                break;
                        }
                    }
                }
                r.debug("[Cloner]: incrementing values... | Clone Number: " +_i_);
            });
            r.debug("[Cloner]: end increment ");
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

        incrementName: 'clonable-increment',
        decrementName: 'clonable-decrement',

        beforeToggle: function (clone, index, self) {},
        afterToggle: function (clone, index, self) {},
    };
    $('[data-toggle=cloner]').cloner();

})(jQuery, document);