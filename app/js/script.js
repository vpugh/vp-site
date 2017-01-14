var color = ['#ff9600', '#8ac641', '#00c7ff'];
	var selectedColor = color[Math.floor(Math.random()*color.length)];
	if (selectedColor == '#ff9600') {
		var afterColor = 'orange';
	} else if (selectedColor == '#8ac641') {
		var afterColor = 'green';
	} else {
		var afterColor = 'blue';
	}
	$('body').addClass(afterColor);