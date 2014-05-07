/*
---
description: WebSocket Class

license: MIT-style

authors: Olivier Gasc (gasc.olivier@gmail.com)

requires:
- Array
- Options
- Events
- JSON (optional)

provides: [MooWebSocket]
...
*/


var MooWebSocket = new Class({
    Implements: [Options, Events],

    cnx: null,
    address: '',

    options: {
        logging:        false,
        json:           false,
        autoConnect:    true,

        events: {
            onConnect:  function()  { this.log('Connecting to server', this.address); },
            onOpen:     function()  { this.log('Connected to server'); },
            onMessage:  function(e) { this.log('Data recieved from server', e.data); },
            onClose:    function(e) { this.log('Disconnected from server', e.reason); },
            onLog:      function()  { if (console && typeof(console.info) === 'function') console.info(arguments); }
        }
    },

    initialize: function(address, options) {
        this.setOptions(options);

        this.address = address;

        this.addEvents(this.options.events);

        if (this.options.autoConnect)
            this.connect();

        return this;
    },

    getStatus: function() {
        return this.cnx ? this.cnx.readyState : false;
    },

    setType: function(type) {
        if (this.cnx && this.cnx.readyState === this.cnx.OPEN)
            this.cnx.binaryType = ['blob', 'arraybuffer', 'arraybufferview'].contains(type) ? type : 'blob';

        return this;
    },

    log: function() {
        if (this.options.logging)
            this.fireEvent('onLog', arguments);

        return this;
    },

    send: function(data) {
        if (this.cnx && this.cnx.readyState === this.cnx.OPEN)
            this.cnx.send((this.options.json && JSON && this.cnx.binaryType === 'blob') ? JSON.encode(data) : data);

        return this;
    },

    connect: function() {
        if (this.cnx === null || (this.cnx && this.cnx.readyState > this.cnx.OPEN)) {
            this.fireEvent('onConnect');

            if (WebSocket) {
                this.cnx = new WebSocket(this.address);

                this.cnx.onopen =       function() { this.fireEvent('onOpen'); }.bind(this);
                this.cnx.onmessage =    function(e) { this.fireEvent('onMessage', e); }.bind(this);
                this.cnx.onclose =      function(e) { this.fireEvent('onClose', e); }.bind(this);
            } else
                this.log('failed to find a WebSocket implementation');
        }

        return this;
    },

    disconnect: function() {
        if (this.cnx)
            this.cnx.close();

        return this;
    }
});