define([
    'dojo/_base/declare',
    'dojo/query',
    'dojo/touch',
    'dojo/topic',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',

    'dojo/text!./templates/NavBar.html',

    'bootstrap/Collapse',
    'bootstrap/Dropdown',
    'bootstrap/Modal'
], function(declare, query, touch, topic, _WidgetBase, _TemplatedMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,

        postCreate: function() {
            this.inherited(arguments);
            this._attachEventHandlers();
        },

        _attachEventHandlers: function() {
            var _this = this;
            // change fish map
            query('.year-list li', this.domNode).on(touch.press, function(e) {
                e.preventDefault();
                topic.publish('year/set', {
                    year: e.target.text
                });
                _this._hideDropdownNav(e);
            });
            query('.fish-list li', this.domNode).on(touch.press, function(e) {
                e.preventDefault();
                topic.publish('fish/set', {
                    fish: e.target.text
                });
                _this._hideDropdownNav(e);
            });
                query('.summary-list li', this.domNode).on(touch.press, function(e) {
                e.preventDefault();
                topic.publish('summary/set', {
                    summary: e.target.text
                });
                _this._hideDropdownNav(e);
            });
            // change basemap
            query('.basemap-list li', this.domNode).on(touch.press, function(e) {
                e.preventDefault();
                topic.publish('basemap/set', {
                    basemap: e.target.text
                });
                _this._hideDropdownNav(e);
            });
            // show legend modal
            query('a[href="#legend"]', this.domNode).on(touch.press, function(e) {
                e.preventDefault();
                query('.legend-modal').modal('show');
                _this._hideDropdownNav(e);
            });
            // show about modal
            query('a[href="#about"]', this.domNode).on(touch.press, function(e) {
                e.preventDefault();
                query('.about-modal').modal('show');
                _this._hideDropdownNav(e);
            });
        },

        _hideDropdownNav: function(e) {
            // hide nav dropdown on mobile
            if (query('.navbar-collapse.in', this.domNode).length > 0) {
                e.stopPropagation();
                query('.navbar-toggle', this.domNode)[0].click();
            }
        }
    });
});