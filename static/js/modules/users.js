/**
 * Created by PyCharm.
 * User: bteam
 * Date: 19.01.12
 * Time: 0:44
 * To change this template use File | Settings | File Templates.
 */
(function (Users) {

    Users.Model = Backbone.Model.extend({
        initialize:function(args){
            this.url = "https://api.twitter.com/1/users/show.json?user_id=" + args.id;
        }
    });

    Users.Collection = Backbone.Collection.extend({
        model:Users.Model,
        user_add:function(){
            console.log('add')
        }
    });




    window.Users = new Users.Collection;

    window.Users.bind("add", function(model) {
        model.fetch({dataType:'jsonp'})
    });

})(namespace.module("Users"));