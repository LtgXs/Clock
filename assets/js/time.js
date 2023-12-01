$(document).ready(function() {
	var modehour, modeseconds;
	var manuallyRefreshed = false;

	function updateTime() {
		var d = new Date((new Date).getTime());

		var time = d.getTime();
		var h = d.getHours();
		var m = d.getMinutes();
		var s = d.getSeconds();

		var ampm = modehour ? "" : (h < 12 ? " AM" : " PM");

		if (h > 12 && !modehour) {
			h = h - 12;
		}

		if (h == 0 && !modehour) {
			h = 12;
		}

		if (m < 10) {
			m = "0"+m;
		}

		if (s < 10) {
			s = "0"+s;
		}

		var month = d.getMonth();
		var day = d.getDate();
		var year = d.getFullYear();
		var weekday = d.getDay();

		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

		var output = ""+days[weekday]+", "+months[month] + " "+day+", "+year+"";

		$('#time-title').html(h + ":" + m + (modeseconds ? ":" + s : "") + ampm);
		$('#time-subtitle').html(output);
	}


	setInterval(function() {
		updateTime();
	}, 1000);

	setInterval(function() {
		// Allow a manual refresh, resetting wallpaperPropertyListener's applyUserProperties.
		manuallyRefreshed = false;
	}, (1000 * 60 * 5));

});
