var Vanadium = {

    plugins: {},

    init: function() {
        window.removeEventListener("DOMContentLoaded", this, false);

        this.tabbrowser = document.getElementById('content');
        this.tabbrowser.addEventListener('TabSelect', this, false);
        this.tabbrowser.addEventListener('TabOpen', this, false);

        this.toolbar = document.getElementById('vanadium-toolbar');
        this.toolbar.setAttribute("collapsed", "true");
    },

    /* Plugin "API" */

    register: function(factory, host) {
        this.plugins[host] = factory;
    },

    getPlugin: function() {
        var factory = this.plugins[this.tabbrowser.currentURI.host];
        if (factory !== undefined) {
            factory = new factory(this.tabbrowser.contentDocument);
        }
        /* This might return undefined, and we're perfectly fine with that. */
        return factory;
    },

    havePlugin: function() {
        return (this.tabbrowser.currentURI.host in this.plugins);
    },

    /* Event handlers */

    handleEvent: function(event) {
        switch (event.type) {
        case 'DOMContentLoaded':
            this.init();
            return;
        case 'TabSelect':
            this.onTabSelect(event);
            return;
        case 'TabOpen':
            this.onTabOpen(event);
            return;
        }
    },
    
    onTabSelect: function(event) {
        this.showVanadium(this.havePlugin());
    },

    onTabOpen: function(event) {
        //TODO we should really see what's being loaded and then decide
        this.showVanadium(false);
    },

    showVanadium: function(show) {
        var navbar = document.getElementById('nav-bar');
        navbar.setAttribute("collapsed", show);
        this.toolbar.setAttribute("collapsed", !show);

        //XXX what does this do and is it really necessary?
        document.persist(this.toolbar.id, 'collapsed');
        document.persist(navbar.id, 'collapsed');
    },

    onSearch: function(query) {
        var plugin = this.getPlugin();
        if (plugin === undefined) {
            return;
        }
        plugin.search.value = query;
        this.pressEnter(plugin.search);
    },

    onButton: function(buttontype) {
        var plugin = this.getPlugin();
        if (plugin === undefined) {
            return;
        }
        var toclick = plugin[buttontype];
        if (toclick === undefined) {
            return;
        }
        this.clickOn(toclick);
    },

    /* Simulate a simple click on an element */
    clickOn: function(element) {
        var event = element.ownerDocument.createEvent('MouseEvent');
        event.initMouseEvent(
            'click',
            true,                        // canBubble
            true,                        // cancelable
            element.ownerDocument.defaultView,        // view (e.g. window)
            1,                           // click count
            0, 0, 0, 0,                  // coordinates
            false, false, false, false,  // key modifiers
            0,                           // button
            null);                       // target
        element.dispatchEvent(event);
    },

    /* Simulate pressing the return key on an element */
    pressEnter: function(element) {
        var event = element.ownerDocument.createEvent('KeyboardEvent');
        event.initKeyEvent(
            'keypress',
            true,                        // canBubble
            true,                        // cancelable
            element.ownerDocument.defaultView,        // view (e.g. window)
            false, false, false, false,  // key modifiers
            KeyEvent.DOM_VK_RETURN,      // keycode
            0);                          // charCode
        element.dispatchEvent(event);
    }

};
window.addEventListener("DOMContentLoaded", Vanadium, false);


function GMailPlugin(document) {
    var iframe = document.getElementById('canvas_frame');
    if (iframe === undefined) {
        return;
    }

    document = jQuery(iframe.contentDocument);
    this.home = document.find('a[title~=Inbox]')[0];
    /* It's id=":r3" for pre-Buzz GMail (e.g. Google Apps) */
    this.compose = document.find('#\\:r2')[0];
    /* There might be many "Reply" links in a conversation, let's just
       take the last one. */
    this.reply = document.find('.hE:last')[0];
    /* It's id="rd" for pre-Buzz GMail (e.g. Google Apps) */
    this.search = document.find('#\\:rc')[0];
}
Vanadium.register(GMailPlugin, "mail.google.com");


function TwitterPlugin(document) {
    document = jQuery(document);
    this.home = document.find('#home_tab > a')[0];
    this.compose = document.find('#direct_messages_tab > a')[0];
    this.search = document.find('#sidebar_search_q')[0];
}
Vanadium.register(TwitterPlugin, "twitter.com");


function FacebookPlugin(document) {
    document = jQuery(document);
    this.home = document.find('#pageLogo > a')[0];
    this.compose = document.find('#navigation_item_messages > a')[0];
    //XXX doesn't work yet
    this.search = document.find('#q')[0];
}
Vanadium.register(FacebookPlugin, "www.facebook.com");
