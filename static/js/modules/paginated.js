/**
 * Created by PyCharm.
 * User: bteam
 * Date: 18.01.12
 * Time: 20:07
 * To change this template use File | Settings | File Templates.
 */
(function (paginated) {

    paginated.Collection = Backbone.Collection.extend({

        baseUrl:'/quote',
        perPage:7,

        initialize:function (args) {
            _.bindAll(this, 'parse', 'url', 'pageInfo', 'nextPage', 'previousPage');
            typeof(options) != 'undefined' || (options = {});
            this.page = args.page || 1;
            typeof(this.perPage) != 'undefined' || (this.perPage = 10);
        },
        fetch:function (options) {
            typeof(options) != 'undefined' || (options = {});
            this.trigger("fetching");
            var self = this;
            var success = options.success;
            options.success = function (resp) {
                self.trigger("fetched");
                if (success) {
                    success(self, resp);
                }
            };
            return Backbone.Collection.prototype.fetch.call(this, options);
        },
        parse:function (resp) {
            this.page = resp.page;
            this.perPage = resp.perPage;
            this.total = resp.total;
            return resp.models;
        },
        url:function () {
            return this.baseUrl + '?' + $.param({page:this.page, perPage:this.perPage});
        },
        pageInfo:function () {
            var info = {
                total:this.total,
                page:this.page,
                perPage:this.perPage,
                pages:Math.ceil(this.total / this.perPage),
                prev:false,
                next:false
            };

            var max = Math.min(this.total, this.page * this.perPage);

            if (this.total == this.pages * this.perPage) {
                max = this.total;
            }

            info.range = [(this.page - 1) * this.perPage + 1, max];

            if (this.page > 1) {
                info.prev = this.page - 1;
            }

            if (this.page < info.pages) {
                info.next = this.page + 1;
            }

            return info;
        },
        nextPage:function () {
            if (!this.pageInfo().next) {
                return false;
            }
            this.page = this.page + 1;
            return this.fetch();
        },
        previousPage:function () {
            if (!this.pageInfo().prev) {
                return false;
            }
            this.page = this.page - 1;
            return this.fetch();
        }

    });

    paginated.Views.View = Backbone.View.extend({
        initialize:function () {
            _.bindAll(this, 'previous', 'next', 'render');
            this.collection.bind('refresh', this.render);
            this.collection.bind('reset', this.render);
            this.collection.view = this;
        },

        template:_.template($('#pagination-template').html()),
        events:{
            'click .prev:not(.disabled) a':'previous',
            'click .next:not(.disabled) a':'next'
        },
        render:function () {
            var pageInfo = this.collection.pageInfo()
            Backbone.history.navigate('/page/' + pageInfo.page, true)
            $(this.el).html(this.template(pageInfo));

            if (pageInfo.perPage - this.collection.length >= 2) {
                $('#main').addClass('not-full')
            }
            else {
                $('#main').removeClass('not-full')
            }

            $('#main').empty()
            var Quotes = namespace.module('Quotes')

            this.collection.each(function (quote) {
                var view = new Quotes.Views.Quote({model:quote})
                view.render()
                $('#main').append(view.el);
                this.bind('change_page', view.remove, view)
            }, this);
        },

        previous:function () {
            this.trigger("change_page");
            this.collection.previousPage();
            return false;
        },

        next:function () {
            this.trigger("change_page");
            this.collection.nextPage();
            return false;
        },

        set_page:function (page) {
            this.trigger("change_page");
            this.collection.page = page;
            this.collection.fetch();
            return false;
        }
    });


    window.Paginated = paginated;

})(namespace.module("paginated"));