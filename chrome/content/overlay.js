var Vanadium = {

    init: function() {
        window.removeEventListener("DOMContentLoaded", this, false);

        this.tabbrowser = document.getElementById('content');
        this.tabbrowser.addEventListener('TabSelect', this, false);
        this.tabbrowser.addEventListener('TabOpen', this, false);

        this.toolbar = document.getElementById('vanadium-toolbar');
        this.toolbar.setAttribute("collapsed", "true");
    },

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

    isAppTab: function(uri) {
        return (uri.host == "mail.google.com"); //XXX
    },

    onTabSelect: function(event) {
        var uri = event.originalTarget.linkedBrowser.currentURI;
        //TODO: only need to do this if we're switching from non-app to app tab
        if (this.isAppTab(uri)) {
            this.showVanadium(true);
        } else {
            this.showVanadium(false);
        }
    },

    onTabOpen: function(event) {
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
        if (!this.isAppTab(this.tabbrowser.currentURI)) {
            return;
        }

        var plugin = new GMailPlugin(this.tabbrowser.contentDocument);
        plugin.search.value = query;
        this.pressEnter(plugin.search);
    },

    onButton: function(buttontype) {
        if (!this.isAppTab(this.tabbrowser.currentURI)) {
            return;
        }

        var plugin = new GMailPlugin(this.tabbrowser.contentDocument);
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

function GMailPlugin(document) {
    var iframe = document.getElementById('canvas_frame');

    /* First link of that class should be 'Inbox' */
    this.home = iframe.contentDocument.getElementsByClassName('n0')[0];
    /* It's id=":r3" for pre-Buzz GMail (e.g. Google Apps) */
    this.compose = iframe.contentDocument.getElementById(':r2');
    this.reply = iframe.contentDocument.getElementsByClassName('hE')[0];
    /* It's id="rd" for pre-Buzz GMail (e.g. Google Apps) */
    this.search = iframe.contentDocument.getElementById(':rc');
}

window.addEventListener("DOMContentLoaded", Vanadium, false);
