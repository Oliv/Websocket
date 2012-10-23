Websocket
===========

A javascript Mootools plugin for WebSockets handling

How to use
----------

Syntax :

    var ws = new MooWebSocket('ws://urloftheserverorip.com:port', {
        logging:        false,  // to enable logging
        json:           false,  // to use JSON encoding before sending data
        autoConnect:    true,   // to connect automatically the server

        events: {
            onConnect:  function()  { this.log('Connecting to server', this.address); }, // Do something during connexion
            onOpen:     function()  { this.log('Connected to server'); }, // Do something after the webSocket onopen event
            onMessage:  function(e) { this.log('Data recieved from server', e.data); }, // Do something after recieving data from server
            onClose:    function(e) { this.log('Disconnected from server', e.reason); }, // Do something after the webSocket onclose event
            onLog:      function()  { if (console && typeof(console.info) === 'function') console.info(arguments); } // Custom logging function
        }
    });