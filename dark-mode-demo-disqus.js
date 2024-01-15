
var GdarkSW; // Global variable to refer to the light/dark switch element

document.addEventListener('DOMContentLoaded', function () {

	// Set the initial state of the check-box
	setCheckBox();

	// Set the initial state of the reset button
	resetButton();

	// add an event listener to the toggle check-box which will detect user click
	// so that if the check-box is clicked, the code will be run to switch the theme
	try {
		GdarkSW = document.getElementById('Theme-switcher');
		GdarkSW.addEventListener('click', function (e) { switchTheme(); }, false );
	} catch (e) {
		// alert(e + ' line: ' + e.lineNumber + ' File: ' + e.fileName);
	}

	// Add listener to detect change in system dark mode setting, and if so calls the SystemThemeChanged function
	// If the system does not support matchMedia, there will be no trigger event.
	try {
		window.matchMedia('(prefers-color-scheme: dark)').addListener(SystemThemeChanged);
	} catch (e) {
		// alert(e + ' line: ' + e.lineNumber + ' File: ' + e.fileName);
	}

	// We have a button to reset the mode to the system setting rather than user override
	// This adds a listener to the button to detect a click and call the function resetTheme
	try {
		document.getElementById('ResetTheme').addEventListener('click', function () { resetTheme(); }, false );
	} catch (e) {
		// alert(e + ' line: ' + e.lineNumber + ' File: ' + e.fileName);
	}

	// If you have Disqus comments on the site, this is one method of implementing dark mode that will show correctly for Disqus comments
	// Different methods can be used, the important thing is to reload Disqus upon a change of light/dark mode
	// If you do not have Disqus, you can leave out this part
	try {
		document.getElementById('CmtBtn1').addEventListener('click', function () { showDisqus(); }, false );
		document.getElementById('CmtBtn2').addEventListener('click', function () { hideDisqus(); }, false );
	} catch (e) {
		// alert(e + ' line: ' + e.lineNumber + ' File: ' + e.fileName);
	}

});
// End of document ready function


// Function to set check-box
function setCheckBox(){
	try {
		// only cases where we are with dark display are if in system mode and prefers dark or when the use them is dark
		// for these cases we set the check-box to unchecked, otherwise checked
		GdarkSW.checked = true;
		if (Gtheme === 'dark'){ GdarkSW.checked = false; }
		// if we get an error in retrieving matchMedia, defaults to system light mode
		if(Gtheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches){
		 GdarkSW.checked = false;
		}
	} catch (e) {
		// alert(e + ' line: ' + e.lineNumber + ' File: ' + e.fileName);
	}
}

	// Function to setup the reset button
function resetButton() {
	if (Gtheme === 'system') {
		document.getElementById('ResetTheme').classList.add('grayed');
		document.getElementById('ResetTheme').classList.add('disabled');
	}
	else{
		document.getElementById('ResetTheme').classList.remove('grayed');
		document.getElementById('ResetTheme').classList.remove('disabled');
	}
}

// Function to reset the mode to the system default
function resetTheme() {
	// we need to know whether to reload Disqus, before change Gtheme was either 'light' or 'dark', so keep a note of this
	var themeBefore = Gtheme;
	localStorage.removeItem('LStheme');
	Gtheme = 'system';
	document.documentElement.removeAttribute('id');
	document.documentElement.setAttribute('id', 'Pdark');
	// make check-box switch display correctly
	setCheckBox();

	// reset the reset button
	resetButton();

	// we need to know whether to reload Disqus
	// before change Gtheme was either 'light' or 'dark'
	try {
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
		 if (themeBefore === "dark") {return false;} // do nothing
		} else {
		 if (themeBefore === "light") {return false;} // do nothing
		}
	} catch (e) {
		// alert(e + ' line: ' + e.lineNumber + ' File: ' + e.fileName);
	}
	// if we are here then display has changed, so reload Disqus comments if they are open
	if (document.getElementById('CmtBox').classList.contains('unhideTip')) {
		loadDisqus();
	}
}

// Function for if there is a system change
// if system-wide light/dark changed then need to set check-box if page is in system mode rather than user mode
function SystemThemeChanged() {
	if (Gtheme === 'system') {
	 setCheckBox();
	 if (document.getElementById('CmtBox').classList.contains('unhideTip')) {loadDisqus();}
	}
}

// DARK & LIGHT THEME SWITCHER
function switchTheme(e) {
	try {
		switch (Gtheme) {
		 case 'system':
				// get system dark mode setting
				if (!window.matchMedia) {
				 // if matchMedia method is not supported, the default is light mode, so we switch to dark.
				 Gtheme = 'dark';
				} else {
				 if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
						// if the system not set to dark, we switch to dark
						Gtheme = 'dark';
				 } else {
						Gtheme = 'light';
				 }
				}
				break;
		 case 'light': // change to dark if it is in light mode
				Gtheme = 'dark';
				break;
		 case 'dark': // change to light if it is in dark mode
				Gtheme = 'light';
				break;
		 default:
				// change to light is the default
				Gtheme = 'light';
		}

		resetButton();

		// now setup according to what we have set Gtheme as
		// set the local storage so subsequent site pages will load as the correct mode
		if (Gtheme === 'light') {
		 document.documentElement.removeAttribute('id');
		 localStorage.setItem('LStheme', 'light');
		} else {
		 document.documentElement.setAttribute('id', 'Dark');
		 localStorage.setItem('LStheme', 'dark');
		}

		// If the Disqus comments are showing, we need to reload them
		if (document.getElementById('CmtBox').classList.contains('unhideTip')) {
		 loadDisqus();
		}
	} catch (e) {
		// alert(e + ' line: ' + e.lineNumber + ' File: ' + e.fileName);
	}
}

// Functions for dealing with the Disqus comments
function showDisqus() {
	showHidex2('CmtBox', 'CmtBtnShow');
	loadDisqus();
}

function hideDisqus() {
	showHidex2('CmtBox', 'CmtBtnShow');
}

function loadDisqus() {
	var disqus_shortname = 'languageandlogic';
	// var d = document;
	var s = document.createElement('script');
	s.src = 'https://languageandlogic.disqus.com/embed.js';
	s.setAttribute('data-timestamp', +new Date());
	(document.head || document.body).appendChild(s);
}

// function for general show or hide, takes two arguments, and optional parameters
// also used to alternate dual buttons to prevent display problems on mobile
function showHidex2(divID1, divID2, divID3) {
	if (divID1 == null) { divID1 = ''; } //to make this an optional parameter in ES6 we can use just function showHidex2(divID1,divID2, divID3='')
	if (divID2 == null) { divID2 = ''; }
	if (divID3 == null) { divID3 = ''; }
	if (divID1 !== '') { showHide(divID1); }
	if (divID2 !== '') { showHide(divID2); }
	if (divID3 !== '') { showHide(divID3); }
}

// function for general show or hide
function showHide(divID) {
	var myDiv;
	if ((myDiv = document.getElementById(divID))) {
		// if null, try does nothing
		try {
		 if (myDiv.classList.contains('hideTip')) {
				myDiv.classList.remove('hideTip');
				myDiv.classList.add('unhideTip');
		 } else {
				myDiv.classList.remove('unhideTip');
				myDiv.classList.add('hideTip');
		 }
		} catch (e) {
		 // alert(e + ' line: ' + e.lineNumber + ' File: ' + e.fileName);
		}
		}
}