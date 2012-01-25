// Use an IIFE...
// (http://benalman.com/news/2010/11/immediately-invoked-function-expression/)
// to assign your module reference to a local variable, in this case Example.
//
// Change line 16 'Example' to the name of your module, and change line 38 to
// the lowercase version of your module name.  Then change the namespace
// for all the Models/Collections/Views/Routers to use your module name.
//
// For example: Renaming this to use the module name: Project
//
// Line 16: (function(Project) {
// Line 38: })(namespace.module("project"));
//
// Line 18: Project.Model = Backbone.Model.extend({
//
(function (Quotes) {
    var monthNamesShort = ['Янв','Фев','Мар','Апр','Май','Июн', 'Июл', 'Авг','Сен','Окт','Ноя','Дек']

    Quotes.Model = Backbone.Model.extend({
        urlRoot:'/quote'
    });

    Quotes.Views.Quote = Backbone.View.extend({
        template:_.template($('#quote-template').html()),
        tagName:'div',
        className:'quote row',
        events:{
            'click .plus':'vote',
            'click .minus':'vote'
        },
        initialize:function (args) {
            var user_id = this.model.get('author').social_auth[0].uid;
            this.author = Users.get({id:user_id})
            if (!this.author) {
                this.author = Users.add({id:user_id});
            }
            this.author.bind('change', this.author_change, this);
        },
        render:function () {
            $(this.el).attr('id', 'quote_' + this.model.get('id'));
            var data = this.model.toJSON();
            var d = new Date(data.datetime);
            var m = monthNamesShort[d.getMonth()]+'. ' + d.getDate() + ', ' + d.getFullYear();
            data.datetime = m
            $(this.el).html(this.template(data));
            this.votes(this.model.get('vote_set'))
            this.author_change()
            this.$('[rel=twipsy]').twipsy()
        },
        author_change:function (user) {
            var m = this.author.toJSON();
            if (_.isArray(m)) {
                m = m[0]
            }
            this.$('img').attr('src', m.profile_image_url)
            if (m.status) {
                this.$('.status').attr('title', m.status.text || 'Twitter status')
            }
        },
        vote:function (e) {
            var url = '/quote/' + this.model.get('id');
            if ($(e.target).hasClass('plus')) {
                url += '/plus'
            }
            else {
                url += '/minus'
            }
            $.ajax({url:url, type:'POST', context:this}).success(this.votes).error(function (err) {
                this.$('.plus,.minus').attr('disabled', 'disabled')
            })
        },
        votes:function (data) {
            if (!data.length) {
                return
            }
            var v = _(data).reduce(function (memo, vote) {
                memo[vote.vote ? 'plus' : 'minus'].push(vote.user.username);
                return memo
            }, {plus:[], minus:[]});

            _(v).each(function (a, key) {
                var node = this.$('button.' + key)
                var str = _(a).reduce(
                    function (s, v) {
                        return s += v + ', '
                    }, '').slice(0, -2);
                if (node.data().twipsy) {
                    node.data().twipsy.options.fallback = str;
                }
                else {
                    node.twipsy({fallback:str})
                }

            }, this);
            var count = this.$('.count')
            count.html(v.plus.length - v.minus.length)
            str = v.plus.length + ' : ' + v.minus.length;
            if (count.data().twipsy) {
                node.data().twipsy.options.fallback = str
            }
            else {
                count.twipsy({fallback:str})
            }
        }

    });

    window.Quotes = Quotes;

})(namespace.module("Quotes"));
