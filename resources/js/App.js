$(function(){
	var mapPlaceholder = $('<div></div>');
	$('body').append(mapPlaceholder);
	var map = new Civ.Map(mapPlaceholder);
	map.setItems({
		size: 72,
		rows: 20,
		cols: 20
	});
	map.setItems({
		size: 72,
		rows: 10,
		cols: 20
	});
});
