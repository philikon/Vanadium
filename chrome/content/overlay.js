var Vanadium = {

    init: function() {
        this.tabbrowser = document.getElementById('content');
        this.tabbrowser.addEventListener('TabSelect', this, false);

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
        }
    },

    isAppTab: function(uri) {
        return (uri.host == "mail.google.com"); //XXX
    },

    onTabSelect: function(event) {
        var uri = event.originalTarget.linkedBrowser.currentURI;
        var navbar = document.getElementById('nav-bar');
        if (this.isAppTab(uri)) {
            //TODO: only need to do this if we're switching from non-app to app tab
            navbar.setAttribute("collapsed", "true");
            this.toolbar.setAttribute("collapsed", "false");
        } else {
            navbar.setAttribute("collapsed", "false");
            this.toolbar.setAttribute("collapsed", "true");
        }
        //XXX what does this do and is it really necessary?
        document.persist(this.toolbar.id, 'collapsed');
        document.persist(navbar.id, 'collapsed');
    },

    onButton: function(buttontype) {
        if (!this.isAppTab(this.tabbrowser.currentURI)) {
            return;
        }

        var iframe = this.tabbrowser.contentDocument.getElementById('canvas_frame');
        var toclick;
        switch (buttontype) {
        case "compose":
            toclick = iframe.contentDocument.getElementById(':r3');
            break;
        case "reply":
            toclick = iframe.contentDocument.getElementsByClassName('hE');
            toclick = toclick[0];
        }

        var event = iframe.contentDocument.createEvent('MouseEvents');
        event.initMouseEvent(
            'click',
            true,                        // canBubble
            true,                        // cancelable
            iframe.contentDocument.defaultView,        // view (e.g. window)
            1,                           // click count
            0, 0, 0, 0,                  // coordinates
            false, false, false, false,  // key modifiers
            0,                           // button
            null);                       // target
        toclick.dispatchEvent(event);
    },

};

window.addEventListener("DOMContentLoaded", Vanadium, false);
