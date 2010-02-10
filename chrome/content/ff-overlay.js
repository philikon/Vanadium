vanadium.onFirefoxLoad = function(event) {
  document.getElementById("contentAreaContextMenu")
          .addEventListener("popupshowing", function (e){ vanadium.showFirefoxContextMenu(e); }, false);
};

vanadium.showFirefoxContextMenu = function(event) {
  // show or hide the menuitem based on what the context menu is on
  document.getElementById("context-vanadium").hidden = gContextMenu.onImage;
};

window.addEventListener("load", vanadium.onFirefoxLoad, false);
