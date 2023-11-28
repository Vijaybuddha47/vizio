window.MAIN_FEED_URL =  "http://cms.dittytv.com/public/api/getappfeed";

// App Name
window.APP_NAME = "DittyTV";
window.APP_DATA_ARRAY = [];
window.SUBCAT_DATA_ARRAY = [];
window.CHANNEL_DATA_ARRAY = [];

//Error messages
window.REQUEST_TIMEOUT = 90; // In second
window.NET_CONNECTION_ERR = "Please check your Internet connection and try again.";
window.APP_EXIT_MSG = "Are you sure you want to exit?";
window.PLAYER_ERR = "The content is currently unavailable. Please check back later.";
window.DATA_PARSE_ERR = "Data Parse Error"
window.NO_RECORD_MSG = "";

// Forward/Backward interval
window.MEDIA_FORWARD_INTERVAL = 15;
window.MEDIA_REWIND_INTERVAL = 10;

// Menus' related common variable
window.SELECTED_MENU_INDEX = 0;
window.FOCUSED_MENU_INDEX = 0;
// Category related common variable
window.FIRST_PAGE_FOCUSED_INDEX = 0;
window.FIRST_PAGE_SELECTED_INDEX = 0;
// Category related common variable
window.SECOND_PAGE_FOCUSED_INDEX = 0;
window.SECOND_PAGE_SELECTED_INDEX = 0;
// Channels related common variable
window.THIRD_PAGE_FOCUSED_INDEX = 0;
window.THIRD_PAGE_SELECTED_INDEX = 0;

// Caph previous depth
window.TAB_INDEX = 0;

// Player's related common variable
window.AD_URL = "";
window.AD_PLAY = false;
window.VIDEO_PLAYER = "";
window.AUDIO_PLAYER = "";
window.MEDIA_OBJ = "";
window.SELECTED_AUDIO = '';
window.PLAY_AUDIO = false;
window.PLAY_VIDEO = false;

window.TIME_STATMP = 0;
window.PAGE_COUNTER = 1;
window.LOAD_NEXT_PAGE = 0;
window.ITEM_COUNTER = 0;
window.PER_PAGE_LIMITPER_PAGE_LIMIT = 20;

window.APP_LAUNCH_FLAG = true;

window.TOKEN = "";

// For marquee
window.IS_POD_TEXT_LEN = 345; // If text length is greater then it then marquee running
window.AOD_MARQUEE_TIMEOUT_FLAG = 0; // It is use for clear timeout for marquee 
window.MARQUEE_TIMEOUT_INTERVAL = 2000; // this time interval that restart marquee after given seconds.

//For google vast tag ads
window.INLINE_COUNTER = 0;
window.WRAPER_COUNTER = 0;
window.VAST_ADS_COUNTER = 0;
window.VAST_TAG_ARR = [];
window.PLAY_VAST_TAG = false;