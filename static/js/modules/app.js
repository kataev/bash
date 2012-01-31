/**
 * Created by PyCharm.
 * User: bteam
 * Date: 21.01.12
 * Time: 17:02
 * To change this template use File | Settings | File Templates.
 */
//var bootstrap;
(function (app) {
    app.Collection = new Paginated.Collection({url:'/quote', perPage:7, model:namespace.module("Quotes").Model});

    bootstrap = function(data){
        var models = app.Collection.parse(data)
        app.Collection.reset(models)
        app.Collection.trigger('fetched')
    }

    app.View = new Paginated.Views.View({collection:app.Collection, el:$('#navigation'), template:$('#pagination-template').html()});

    app.Collection.bind('fetched',function(){
        $('#main').empty()
        this.each(function (quote) {
            var view = new Quotes.Views.Quote({model:quote})
            view.render()
            $('#main').append(view.el);
            this.bind('change_page', view.remove, view)
        }, this);
    })
})(namespace.app);