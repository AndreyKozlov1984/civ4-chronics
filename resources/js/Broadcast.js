window.Civ = window.Civ || {};
Civ.listeners = [];
Civ.broadcast = function(message){
    this.listeners.forEach(function(listener){
        listener(message);
    });
};
Civ.subscribe = function(type, callback,scope){
    scope = scope || window;
    this.listeners.push(function(message){
        if (message.type === type){
            callback.call(scope,message);
        }
    });
};
