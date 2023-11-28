function load_audio() {
	var features = [], type = "audio/", url = "";

	if (APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_type'] == "L") {
		url = CHANNEL_DATA_ARRAY['channels'][THIRD_PAGE_SELECTED_INDEX]['url'];
	}

	if ((url.toLowerCase()).indexOf(".m3u") < 0) features = ['current', 'progress', 'duration', 'tracks'];

	if ((url.toLowerCase()).indexOf(".m3u") > -1) type += "hls";
	else type += "mp3";

	console.log(type, url);
	$(".audio_container").addClass('active').show();

	// Add audio player
	add_focus("audioSection", "audio_container");
	SN.focus("audioSection");

	$("#audio_container").html('<audio controls id="audioPlayer" style="max-width:100%;" poster="" preload="none" class="audio_box" height="38px"><source src="" type="' + type + '" id="audioURL"></audio>');

	$("#audioURL").attr('src', url);

	MEDIA_OBJ = new MediaElementPlayer("audioPlayer", {
		stretching: "auto",
		pluginPath: 'player/',
		features: features,
		clickToPlayPause: true,
		//loop: true,
		//defaultSeekForwardInterval:function(media) {return (media.duration + MEDIA_FORWARD_INTERVAL);},
		//defaultSeekBackwardInterval:function(media) {return (media.duration - MEDIA_REWIND_INTERVAL);},
		success: function (media) {
			AUDIO_PLAYER = media;
			media.load();
			media.play();

			media.addEventListener('progress', function () {
				//console.log("3333333333333");
			});

			media.addEventListener('error', function (e) {
				console.log("error.............");

				retry_error_popup();
				media.pause();
			});

			media.addEventListener('ended', function (e) {
				console.log("end audio..............." + e.message);
				closeAudio();
			});

			media.addEventListener('timeupdate', function (e) {

			});

			media.addEventListener('play', function (e) {
				console.log("Play Audio");
				$('#play_pause_button_' + THIRD_PAGE_SELECTED_INDEX).removeClass('play_icon').addClass('pause_icon');
			});

			media.addEventListener('pause', function (e) {
				console.log("Pause Audio");
				$('#play_pause_button_' + THIRD_PAGE_SELECTED_INDEX).removeClass('pause_icon').addClass('play_icon');
			});

			media.addEventListener('canplay', function (e) {
				PLAY_AUDIO = true;
			});
		}
	});
}

var closeAudio = function (keyCode) {
	console.log("close audio");
	PLAY_AUDIO = false;
	SELECTED_AUDIO = '';
	AUDIO_PLAYER.pause();
	AUDIO_PLAYER = "";
	$("#audio_container").html('');
	$("#audio_container").hide();
	$(".audio_container").removeClass('active');
	$(".play_icon, .pause_icon").removeClass('pause_icon').addClass('play_icon');

	if (keyCode != 461) {
		$(".subcat_container").addClass("active").css("display", "flex");
		SN.focus("subcatList");
	}
};

function forward_audio() {
	if ($(".audio_container").hasClass("active")) {
		AUDIO_PLAYER.setCurrentTime(AUDIO_PLAYER.getCurrentTime() + MEDIA_FORWARD_INTERVAL);
	}
}

function rewind_audio() {
	if ($(".audio_container").hasClass("active")) {
		AUDIO_PLAYER.setCurrentTime(AUDIO_PLAYER.getCurrentTime() - MEDIA_REWIND_INTERVAL);
	}
}

function play_pause_audio() {
	if (PLAY_AUDIO) {
		console.log("Play/pause Audio");
		if (AUDIO_PLAYER != "") {
			if (AUDIO_PLAYER.paused) AUDIO_PLAYER.play();
			else AUDIO_PLAYER.pause();
		}
	}
}