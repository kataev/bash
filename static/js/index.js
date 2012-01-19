// Change *namespace* to your namespace!
// This contains the module definition factory function, application state,
// events, and the router.
this.namespace = {
    // Assist with code organization, by breaking up logical components of code
    // into modules.
    module:function () {
        // Internal module cache.
        var modules = {};

        // Create a new module reference scaffold or load an existing module.
        return function (name) {
            // If this module has already been created, return it.
            if (modules[name]) {
                return modules[name];
            }

            // Create a module and save it under this name
            return modules[name] = { Views:{} };
        };
    }(),

    // This is useful when developing if you don't want to use a
    // build process every time you change a template.
    //
    // Delete if you are using a different template loading method.
    fetchTemplate:function (path, done, context) {
        window.JST = window.JST || {};

        // Should be an instant synchronous way of getting the template, if it
        // exists in the JST object.
        if (JST[path]) {
            return done.call(context, JST[path]);
        }

        // Fetch it asynchronously if not available from JST
        return $.get(path, function (contents) {
            var tmpl = _.template(contents);
            JST[path] = tmpl;

            done.call(context, tmpl);
        });
    },

    // Keep active application instances namespaced under an app object.
    app:_.extend({}, Backbone.Events)
};

// Treat the jQuery ready function as the entry point to the application.
// Inside this function, kick-off all initialization, everything up to this
// point should be definitions.
jQuery(function ($) {

    // Shorthand the application namespace
    var app = namespace.app;

    // Include the example module
    var Quote = namespace.module("Quotes");

    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({
        routes:{
            "":"index",
            ":hash":"index"
        },
        index:function (hash) {

        }
    });

    // Define your master router on the application namespace and trigger all
    // navigation from this instance.
    app.router = new Router();

    // Trigger the initial route and enable HTML5 History API support
    Backbone.history.start({ pushState:true });

    app.Collection = new Paginated.Collection({baseUrl:'/quotes', model:Quotes.Model, page:window.location.href.split('page/')[1]});
    app.Collection.fetch()

    app.View = new Paginated.Views.View({collection:app.Collection, el:$('#navigation')});
//    app.View.render()


    $('#add button.btn.primary').bind('click', function (e) {
        e.preventDefault();
        var text = $('#add textarea').val()

        $.ajax({url:'/quote', type:'POST', context:this, data:{text:text}})
            .success(function (data) {
                $('#add-modal').modal('hide')
                $('#add textarea').val('')
            })
    });

    // All navigation that is relative should be passed through the navigate
    // method, to be processed by the router.  If the link has a data-bypass
    // attribute, bypass the delegation completely.
    $(document).on("click", "a:not([data-bypass])", function (evt) {
        // Get the anchor href and protcol
        var href = $(this).attr("href");
        var protocol = this.protocol + "//";

        // Ensure the protocol is not part of URL, meaning its relative.
        if (href.slice(protocol.length) !== protocol) {
            // Stop the default event to ensure the link will not cause a page
            // refresh.
            evt.preventDefault();

            // This uses the default router defined above, and not any routers
            // that may be placed in modules.  To have this work globally (at the
            // cost of losing all route events) you can change the following line
            // to: Backbone.history.navigate(href, true);
            app.router.navigate(href, true);
        }
    });
});


function collection(data) {
    namespace.module("Quotes").quotes.reset(data);
}