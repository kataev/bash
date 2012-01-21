/**
 * Created by PyCharm.
 * User: bteam
 * Date: 18.01.12
 * Time: 20:07
 * To change this template use File | Settings | File Templates.
 */
(function (paginated) {

    paginated.Collection = Backbone.Collection.extend({
        initialize:function (args) {
            _.bindAll(this, 'parse', 'pageInfo', 'setPage');
            typeof(options) != 'undefined' || (options = {});
            this.page = args.page || 1;
            typeof(this.perPage) != 'undefined' || (this.perPage = 10);
            this.url = args.url;
            this.perPage = args.perPage;
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
            options.url = this.url + '?' + $.param({page:this.page, perPage:this.perPage});
            return Backbone.Collection.prototype.fetch.call(this, options);
        },
        parse:function (resp) {
            this.page = resp.page;
            this.perPage = resp.perPage;
            this.total = resp.total;
            return resp.models;
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
        setPage:function (page) {
            this.page = page;
            this.fetch();
            return false;
        }
    });

    paginated.Views.View = Backbone.View.extend({
        initialize:function (args) {
            _.bindAll(this, 'render');
            this.collection.bind('fetched', this.render);
            this.collection.view = this;
            if (_.isString(args.template)) this.template = _.template(args.template);
            else this.template = args.template;
        },

        render:function () {
            var pageInfo = this.collection.pageInfo()
            $(this.el).html(this.template(pageInfo));
        }

    });


    window.Paginated = paginated;

})(namespace.module("paginated"));