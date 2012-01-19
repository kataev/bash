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

    Quotes.Model = Backbone.Model.extend({
        urlRoot:'/quote',
        url:function () {
            var base = this.urlRoot;
            if (this.isNew()) return base;
            return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
        }
    });

    Quotes.Router = Backbone.Router.extend({
        routes:{
            "quote/:id":"quote",
            "add":"add",
            '':'index',
            'page/:page':'page'
        },
        quote:function (id) {
            console.log('quote', id)
        },
        add:function () {
            console.log('add')
            v = new Quotes.Views.Add
            v.render()
        },
        index:function () {
//            var v = new Quotes.Views.Quote({collection:Quotes.quotes,el:$('#main')})
//            v.render()
        },
        page:function (page) {

        }
    });



    Quotes.Views.Quote = Backbone.View.extend({
        template:"/static/js/templates/quote.html",
        tagName:'div',
        className:'quote row',
        events:{
            'click .plus':'vote',
            'click .minus':'vote'
        },
        initialize:function(args){
            var user_id = this.model.get('author').social_auth[0].uid
            this.author = Users.get({id:user_id})
            if (!this.author){
                this.author = Users.add({id:user_id});
            }
            this.author.bind('change',this.author_change,this);
        },
        render:function () {
            $(this.el).attr('id', 'quote_' + this.model.get('id'));
            namespace.fetchTemplate(this.template, function (tmpl) {
                $(this.el).html(tmpl(this.model.toJSON()));
                this.votes(this.model.get('vote_set'))
                this.author_change()
                this.$('[rel=twipsy]').twipsy()
            }, this);
        },
        author_change:function(user){
            var m = this.author.toJSON();
            if (_.isArray(m) ) { m = m[0]}
            this.$('img').attr('src',m.profile_image_url)
                if (m.status){
            this.$('.status').attr('title',m.status.text || 'Twitter status')
                }
        },
        vote:function (e) {
            var url = '/quote/' + this.model.get('id');
            if ($(e.target).hasClass('plus')) { url += '/plus' }
            else { url += '/minus' }
            $.ajax({url:url, type:'POST', context:this}).success(this.votes).error(function (err) {
                this.$('.plus,.minus').attr('disabled','disabled')
            })
        },
        votes:function (data) {
            if (!data.length) { return }
            var v = _(data).reduce(function (memo, vote) {
                memo[vote.vote ? 'plus' : 'minus'].push(vote.user.username);
                return memo
            }, {plus:[], minus:[]});

            _(v).each(function (a, key) {
                var node = this.$('button.' + key)
                var str = _(a).reduce( function (s, v) { return s += v + ', ' }, '').slice(0, -2);
                if (node.data().twipsy) { node.data().twipsy.options.fallback = str; }
                else { node.twipsy({fallback:str}) }

            }, this);
            var count = this.$('.count')
            count.html(v.plus.length-v.minus.length)
                str= v.plus.length+ ' : ' +v.minus.length;
            if (count.data().twipsy) { node.data().twipsy.options.fallback = str }
            else { count.twipsy({fallback:str}) }
        }

    });

    Quotes.Views.Add = Backbone.View.extend({
        template:"/static/js/templates/add.html",
        tagName:'div',
        className:'modal',
        events:{
            'click .add':'add'
        },
        render:function () {
            // Fetch the template, render it to the View element and call done.
            namespace.fetchTemplate(this.template, function (tmpl) {
                $(this.el).html(tmpl());
                $(this.el).modal({show:true, backdrop:true})
                $(this.el).bind('hidden', $.proxy(function () {
                    this.remove();
                }, this))
            }, this);
        },
        add:function () {
            var text = this.$('textarea').val();
            quote = Quotes.quotes.create({text:text});
//            quote.save()
            $(this.el).modal('hide')
            Backbone.history.navigate('', true);
        }
    });
    // This will fetch the tutorial template and render it.
    Quotes.Views.Tutorial = Backbone.View.extend({
        template:"/static/js/templates/example.html",

        render:function (done) {
            var view = this;

            // Fetch the template, render it to the View element and call done.
            namespace.fetchTemplate(this.template, function (tmpl) {
                view.el.innerHTML = tmpl();

                done(view.el);
            });
        }
    });


    window.Quotes = Quotes;


})(namespace.module("Quotes"));
