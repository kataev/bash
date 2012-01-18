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
        urlRoot:'/quote'
    });
    Quotes.Collection = Backbone.Collection.extend({
        model:Quotes.Model,
        url:'/quote'
    });

    Quotes.quotes = new Quotes.Collection;


    Quotes.Router = Backbone.Router.extend({
        routes:{
            "quote/:id":"quote",
            "add":"add",
            '':'index'
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
            var v = new Quotes.Views.Quote({collection:Quotes.quotes,el:$('#main')})
            v.render()
        }
    });

    Quotes.Views.Quote = Backbone.View.extend({
        initialize:function(){
            this.collection.view = this
            this.collection.bind('add',this.add,this)
        },
        template:"/static/js/templates/quote.html",
        tagName:'div',
        className:'quote',
        render:function () {
            console.log('render')
            $(this.el).empty()
            namespace.fetchTemplate(this.template, function (tmpl) {
                this.collection.each(this.add,this)
            }, this);
        },
        add:function(quote){
            namespace.fetchTemplate(this.template, function (tmpl) {
                $(this.el).prepend(tmpl(quote.toJSON()));
            }, this);

        }
    })


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
