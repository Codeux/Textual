/* ********************************************************************* 
       _____        _               _    ___ ____   ____
      |_   _|___  _| |_ _   _  __ _| |  |_ _|  _ \ / ___|
       | |/ _ \ \/ / __| | | |/ _` | |   | || |_) | |
       | |  __/>  <| |_| |_| | (_| | |   | ||  _ <| |___
       |_|\___/_/\_\\__|\__,_|\__,_|_|  |___|_| \_\\____|

 Copyright (c) 2010 — 2014 Codeux Software & respective contributors.
     Please see Acknowledgements.pdf for additional information.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the Textual IRC Client & Codeux Software nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 SUCH DAMAGE.

 *********************************************************************** */

/* Internal state. */
Textual = {
	nicknameDoubleClickTimer: null,

	/* Callbacks for each WebView in Textual. — Self explanatory. */
	
	/* These callbacks are limited to the context of this view. The view can represent either 
	the console, a channel, or a private message. See viewInitiated() for information about 
	determining which view this view represents. */
	
	/* 
	 viewInitiated():

		@viewType:		Type of view being represented. Server console, channel, query, etc. 
						Possible values: server, channel, query. — query = private message.
		@serverHash:	A unique identifier to differentiate between each server a view may represent.
		@channelHash:	A unique identifier to differentiate between each channel a view may represent.
		@channelName:	Name of the view. Actual channel name, nickname for a private message, or blank for console.
	*/
	viewInitiated: function(viewType, serverHash, channelHash, channelName) {},

	newMessagePostedToView: 				function(lineNumber) {},
	
	historyIndicatorAddedToView:	 		function() {},
	historyIndicatorRemovedFromView: 		function() {},
	
	topicBarValueChanged: 					function(newTopic) {},
	
	viewContentsBeingCleared: 				function() {},
	viewFinishedLoading: 					function() {},
	viewFinishedReload: 					function() {},
	viewFontSizeChanged:					function(bigger) {},
	viewPositionMovedToBottom:				function() {},
	viewPositionMovedToHistoryIndicator: 	function() {},
	viewPositionMovedToLine: 				function(lineNumber) {},
	viewPositionMovedToTop: 				function() {},
	
	/* This function is not called by Textual itself but by WebKit. It is appended
	to <body> as the function to call during onload phase. It is used by the newer
	templates to replace viewDidFinishLoading as the function responsible for 
	fading out the loading screen. It is defined here so style's that do not
	implement it do not error out. */
	viewBodyDidLoad:						function() {},
	
	/* Allows a style to respond to the user switching between light and
	dark mode. */
	sidebarInversionPreferenceChanged:		function() {},

	/* *********************************************************************** */

    /* 
        handleEvent allows a style to receive status information about several
        actions going on behind the scenes. The following event tokens are 
        currently supported. 
        
        serverConnected                 - Server associated with this view has connected.
        serverConnecting                - Server associated with this view is connecting.
        serverDisconnected              - Server associated with this view has disconnected.
        serverDisconnecting             - Server associated with this view is disconnecting.
        channelJoined                   - Channel associated with this view has been joined.
        channelParted                   — Channel associated with this view has been parted.
        channelMemberAdded              — Member added to the channel associated with this view.
        channelMemberRemoved            — Member removed from the channel associated with this view.
        
		THESE EVENTS ARE PUSHED WHEN THEY OCCUR. When a style is reloaded by Textual or
        the end user, these events are not sent again. It is recommended to use a feature
        of WebKit known as sessionStorage if these events are required to be known between
        reloads. When a reload occurs to a style, the entire HTML and JavaScript is replaced
        so the previous style will actually have no knowledge of the new one unless it is 
        stored in a local database.  
    */
    handleEvent:                            function(eventToken) {}, 

	/* *********************************************************************** */

	/* 
		Textual provides the ability to store values within a key-value store which is shared 
		amongst all views. The values stored within this key-value store are maintained within
		the preferences file of Textual within its sandbox and will exist even if the style is
		renamed, removed, or replaced. 
		
		To opt-in to using a key-value store, add a string value to the styleSettings.plist file 
		of a style with the name of it being "Key-value Store Name" — the value of this additional
		key should be whatever the name the key-value stored should be saved under. Preferably,
		it would be named whatever the style is, but a different one can be picked so that multiple
		variants of a style can share the same values. 
		
		When setting a value of undefined or null, the specified key is removed from the store. 
		Any other value is automatically converted by WebKit to match the following data types:
		
		    JavaScript              ObjC
		    ----------              ----------
		    number          =>      NSNumber
		    boolean         =>      CFBoolean
		    string          =>      NSString
		    object          =>      id
		    
		    ObjC                    JavaScript
		    ----                    ----------
		    CFBoolean       =>      boolean
		    NSNumber        =>      number
		    NSString        =>      string
		    NSArray         =>      array object
		    WebScriptObject =>      object
		    
		 When the value of a setting is retrieved, undefined will be returned if key is not found.
	*/

	// app.styleSettingsRetrieveValue(key)				— Retrieve value of /key/ from the key-value store.
	// app.styleSettingsSetValue(key, value)			— Set /value/ to /key/ in the key-value store.

	/* This function is invoked when a style setting has changed. It is invoked on all WebViews 
	including the one that was responsible for changing the original value. */
	styleSettingDidChange:                            function(changedKey) { },

	/* *********************************************************************** */

    /* The following API calls can be called at any time. */
    
	// app.logToConsole(<input>)        - Log a message to the Mac OS console.
	
	// app.serverIsConnected()          - Boolean if associated server is connected.
	// app.channelIsJoined()            — Boolean if associated channel is joined.
	// app.channelMemberCount()         — Number of members on the channel associated with this view.
   
	// app.serverChannelCount()         — Number of channels part of the server associated with this view.
	//                                    This number does not count against the status of the channels.
	//                                    They can be joined or all parted. It is only a raw count.
  
    // app.sidebarInversionIsEnabled()  - Boolean if sidebar colors are inverted.

	// app.channelName()				— Channel name of associated channel. Can be an actual channel name,
	//									  a nickname for a private message, or blank for the console.

	// app.serverAddress()				— Actual server address (e.g. verne.freenode.net) of the associated
	//									  server. This value is not available until raw numeric 005 is posted.

	// app.localUserNickname()			— Nickname of the local user.
	// app.localUserHostmask()			— Hostmask of the local user obtained during join.
	
	/* The app.printDebugInformation* calls documented below also call newMessagePostedToView() which means calling
	them from within newMessagePostedToView() will create an infinite loop. If needed inside newMessagePostedToView(),
	then check the line type of the new message and do not respond to line types with the value "debug" */
	
	// app.printDebugInformationToConsole(message)		— Show a debug message to the user in the server console. 
	//													  This is the equivalent of a script using the /debug command.

	// app.printDebugInformation(message)				— Show a debug message to the user in the associated channel.

	/* *********************************************************************** */

	/* JavaScript <-> Objective-C bridge (only for Advanced users)

	Textual includes its own homemade bridge similar to the Objective-C -performSelector: method provided on objects
	which can be invoked from within JavaScript.

	The two functions related to this bridge are:
		app.performBridgedSelector(object, selector, ...)
		app.performBridgedSelectorWithString(object, selector, ...)

	performBridgedSelector() is the function which will be used in 99% of use cases. The first argument of this function
	is one of two things. A string or an Objective-C object (not JavaScript created object) returned from a previous call
	to performBridgedSelector(). When a string is given for the /object/ value, then the value of that string is assumed to
	be a class name which Textual will automatically translate. For example, "NSObject" would represent the class NSObject.

	Because /object/ treats strings as class names, performing a selector on a string itself is not possible with
	performBridgedSelector(). Instead, when invoking a selector on a string, call performBridgedSelectorWithString()
	which will treat the /object/ value as an actual object and not do class lookup.

	/selector/ (string) is the method that will be invoked on /object/

	----------------------

	Everything that follows /object/ and /selector/ are the arguments supplied to /selector/ — Textual enforces strict
	checking when invoking a method with arguments. If the number of arguments supplied doe not match the number expected,
	then an error is returned and nothing happens.

	By default, both functions use lose type checking for arguments. This basically means that when the method is invoked
	in Objective-C, the translation of numbers from JavaScript to WebKit uses the type "double" as that is what WebKit
	gives us by default. However, arguments can be cast using a specific set of types. Casting is the preferred method of
	specifying arguments because 99% of the Objective-C code in Textual uses integers.

	Casting is performed by specifying a JavaScript object as an argument in the following format:

		{type: "<type symbol>", value: "<object value>"}

	Both values of this object are strings. The first value, "type", is one of the following tokens:

		 Token			        Cast Type
		-------                -----------
		   i					  long (NSInteger)
		   l					  long long
		   f					  float
		   d					  double (WebKit's default)

	----------------------

	In most cases, Textual relies on WebKit to handle the translation of Objective-C return types into their JavaScript
	counterparts. Here are a few example of translated values:

		ObjC                    JavaScript
		----                    ----------
	 	 BOOL			 =>      boolean
		 NSNumber        =>      number
		 NSString        =>      string
		 NSArray         =>      array object
		 id				 =>      objective-c object

	The result value of some types are undefined and the behavior of these is not well understood.

	----------------------

	In summary, here are a few examples:

		app.performBridgedSelector("TPCPreferences", "invertSidebarColors")

		var masterController = app.performBridgedSelector("NSObject", "masterController");
		var mainWindow = app.performBridgedSelector(masterController, "mainWindow")
		var selectedClient = app.performBridgedSelector(mainWindow, "selectedClient");
		app.performBridgedSelector(selectedClient, "name");

		var masterController = app.performBridgedSelector("NSObject", "masterController");
		var mainWindow = app.performBridgedSelector(masterController, "mainWindow")
		var selectedChannel = app.performBridgedSelector(mainWindow, "selectedChannel");
		app.performBridgedSelector(selectedChannel, "setDockUnreadCount:", {type: "i", value: "1"});
		app.performBridgedSelector("TVCDockIcon", "updateDockIcon")

		app.performBridgedSelector("100", "integerValue"); // Would return error that "100" is not a class
		app.performBridgedSelectorWithString("100", "integerValue"); // Would return error that "100" is not a class
	*/

	/* *********************************************************************** */
	/*																		   */
	/* DO NOT EDIT ANYTHING BELOW THIS LINE FROM WITHIN A STYLE. 			   */
	/*																		   */
	/* *********************************************************************** */
	
	scrollToBottomOfView: function()
	{
		document.body.scrollTop = document.body.scrollHeight;
		
		Textual.viewPositionMovedToBottom();
	},

	/* Loading screen. */
	
	fadeInLoadingScreen: function(bodyOp, topicOp)
	{
		/* fadeInLoadingScreen is the old API name and makes no sense since we are
		not bringing the loading screen into view, we are removing it. So it is 
		being faded "out" not "in" */

		Textual.fadeOutLoadingScreen(bodyOp, topicOp);
	},
	
	fadeOutLoadingScreen: function(bodyOp, topicOp)
	{
		/* Reserved element IDs. */
		var bhe = document.getElementById("body_home");
		var tbe = document.getElementById("topic_bar");
		var lbe = document.getElementById("loading_screen");

		lbe.style.opacity = 0.00;
		bhe.style.opacity = bodyOp;

		if (tbe != null) {
			tbe.style.opacity = topicOp;
		}
		
		/* The fade time for the loading screen depends on the CSS of the actual
		style, but there is no reason it should take more than five (5) seconds.
		We will wait that amount of time before setting the overlay to hidden. 
		Setting it to hidden makes it not copiable after it is not visible. */
		
		setTimeout(function() {
			lbe.style.display = "none";
		}, 5000);
	},

	/* Resource management. */

	includeStyleResourceFile: function(file)
	{
		if (/loaded|complete/.test(document.readyState)) {
			var css = document.createElement("link");
			
			css.href = file;
			css.media = "screen";
			css.rel = "stylesheet";
			css.type = "text/css";
			
			document.getElementsByTagName("HEAD")[0].appendChild(css);
		} else {
			document.write('<link href="' + file + '" media="screen" rel="stylesheet" type="text/css" />'); 
		}
	},
	
	includeScriptResourceFile: function(file)
	{
		if (/loaded|complete/.test(document.readyState)) {
			var js = document.createElement("script");
			
			js.src  = file;
			js.type = "text/javascript";
			
			document.getElementsByTagName("HEAD")[0].appendChild(js);
		} else {
			document.write('<script type="text/javascript" src="' + file + '"></scr' + 'ipt>'); 
		}
	},
	
	/* Contextual menu management and other resources.
	 We do not recommend anyone try to override these. */
	
	openChannelNameContextualMenu: function() 
	{ 
		app.setChannelName(event.target.innerHTML); 
	},

	openURLManagementContextualMenu: function() 
	{
		app.setURLAddress(event.target.innerHTML); 
	},

	openInlineNicknameContextualMenu: function() 
	{
		app.setNickname(event.target.innerHTML); 
	}, // Conversation Tracking
	
	openStandardNicknameContextualMenu: function() 
	{
		app.setNickname(event.target.getAttribute("nickname"));
	},

	nicknameMaybeWasDoubleClicked: function(e)
	{
		if (Textual.nicknameDoubleClickTimer) {
			clearTimeout(Textual.nicknameDoubleClickTimer);
			
			Textual.nicknameDoubleClickTimer = null;
				
			Textual.nicknameDoubleClicked(e);
		} else {
			Textual.nicknameDoubleClickTimer = setTimeout(function() {
				Textual.nicknameDoubleClickTimer = null;

				Textual.nicknameSingleClicked(e);
			}, 250);
		}
	},

	nicknameSingleClicked: function(e)
	{
		// API does not handle this action by default…
	},
	
	nicknameDoubleClicked: function(e) 
	{
		Textual.openStandardNicknameContextualMenu();

		app.nicknameDoubleClicked();
	},
	
	channelNameDoubleClicked: function() 
	{
		Textual.openChannelNameContextualMenu();

		app.channelNameDoubleClicked();
	},
	
	inlineNicknameDoubleClicked: function() 
	{
		Textual.openInlineNicknameContextualMenu();

		app.nicknameDoubleClicked();
	},

    topicDoubleClicked: function() 
	{
        app.topicDoubleClicked();
    },
	
	toggleInlineImage: function(object, onlyPerformForShiftKey)
	{
		/* We only want certain actions to happen for shift key. */
		if (onlyPerformForShiftKey) {
			if (window.event.shiftKey === false) {
				return true;
			}
		}
	
		/* toggleInlineImage() is called when an onclick event is thrown on the associated
		link anchor of an inline image. If the last mouse down event was related to a resize,
		then we return false to stop link from opening. Else, we pass the event information 
		to the internals of Textual itself to determine whether to cancel the request. */
		
		if (typeof InlineImageLiveResize !== 'undefined') {
			if (InlineImageLiveResize.previousMouseActionWasForResizing === false) {
				app.toggleInlineImage(object);
			}
		} else {
			app.toggleInlineImage(object);
		}
		
		return false;
	},
	
	didToggleInlineImageToHidden: function(imageElement)
	{
		/* Do something here? */
	},
	
	didToggleInlineImageToVisible: function(imageElement)
	{
		var realImageElement = imageElement.querySelector("a .image");
	
		realImageElement.addEventListener("mousedown", InlineImageLiveResize.onMouseDown, false);
	},
}
