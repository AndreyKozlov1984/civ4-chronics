//The map class should just generate a set of hex items
window.Civ = window.Civ || {};
Civ.Map = function(el){
	this.el = el;
	this.createMarkup();
};
Civ.Map.prototype.createMarkup = function(){
	this.el.addClass('map-container');
}
