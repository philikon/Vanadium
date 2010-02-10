var Vanadium = {

    init: function() {
        var tabbrowser = document.getElementById('content');
        tabbrowser.addEventListener('TabSelect', this, false);

        this.toolbar = document.getElementById('vanadium-toolbar');
        this.toolbar.setAttribute("collapsed", "true");
    },

    handleEvent: function(event) {
        switch (event.type) {
        case 'DOMContentLoaded':
            this.init();
            return;
        case 'TabSelect':
            Components.utils.reportError("tab select!");
            this.onTabSelect(event);
            return;
        }
    },

    onTabSelect: function(event) {
        var uri = event.originalTarget.linkedBrowser.currentURI;
        var navbar = document.getElementById('nav-bar');
        var vanadiumbar = document.getElementById('vanadium-toolbar');
        if (uri.host == "mail.google.com") {
            navbar.setAttribute("collapsed", "true");
            this.toolbar.setAttribute("collapsed", "false");
        } else {
            navbar.setAttribute("collapsed", "false");
            this.toolbar.setAttribute("collapsed", "true");
        }
    },
};

window.addEventListener("DOMContentLoaded", Vanadium, false);
