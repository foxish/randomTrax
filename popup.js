// Adapt as you please! But do not remove this header
// Creative-Commons Attribution License (http://creativecommons.org/licenses/by/3.0/)
// Developer: Anirudh R (http://anirudhr.com/about.php) 

var bgp = chrome.extension.getBackgroundPage();//all function calls to background page are done thru thsi variable
var duration;  //ununsed as of now
var genreEl; //genre element
  
  document.addEventListener('DOMContentLoaded', function () {//wait till DOM loads before referencing any elements
  document.getElementById('play').addEventListener('click', playAction);//event listener for play button
  document.getElementById('next').addEventListener('click', nextAction);//event listener for next button
  document.getElementById('prev').addEventListener('click', prevAction);//event listener for prev button
  document.getElementById('shutdown').addEventListener('click', shutdownAction);//event listener for shutdown button
  duration = document.getElementById('duration');//not in use
  
  if(bgp.isTurnedOn)
  document.getElementById('mainwrap').style.display = "block";
  else
  document.getElementById('mainwrap').style.display = "none";
  
    
  changeImage(bgp.playing);//to change image to playing/paused icon
  bgp.updatePopup();//fetches & updates different pieces of info to be displayed
  restoreSettings();//sessionStorage contains search terms and last used genre
  
	if(bgp.myList == null)
		bgp.hideControls(true)//if no songs, why show controls! dumbass :P
	else if(bgp.myList.length <= 0)
		bgp.hideControls(true)//if no songs, why show controls! dumbass :P
	
	
  document.getElementById('tips').innerHTML = bgp.tipArray[getRandomIntR(1, parseInt(bgp.tipArray[0]))];//populate tips 
  
  //genre listener
  genreEl = document.getElementById("genre");
  genreEl.onchange = function() {
	genreChange();
  }
  
  //search listener
  document.getElementById("search").onchange = function() {
			if(bgp.playing)
				 playAction(); //will pause if track in progress 
			var search = document.getElementById("search").value;
			localStorage["search"] = search;
			if(search != ""){
				document.getElementById("genre").disabled = true;//if search terms are present, disable genre select
				bgp.qv = search;
				bgp.genresv = "";
				bgp.offsetv = 0;
				bgp.initRequest();//reinitialize
			}
			else{
				document.getElementById("genre").disabled = false;//no search term, enable genre select
				genreChange();
			}
  }  
});




function genreChange(){
	localStorage["search"] = "";
	bgp.qv = "";
	var genre = document.getElementById("genre").value;
	localStorage["genre"] = genre;
    bgp.genresv = genre;
	bgp.initRequest();//reinitialize
}
/*var intervalID = window.setInterval(repeat, 1000);
function repeat(){
	try{
		duration.innerHTML = bgp.getTotal() + "%";
	}catch(exception){}
}
*/
function playAction(){
	bgp.play();
	changeImage(bgp.playing);
}
function nextAction(){
    bgp.next();
	changeImage(bgp.playing);

}
function prevAction(){
    bgp.prev();
	changeImage(bgp.playing);
}

function shutdownAction(){
    if(bgp.isTurnedOn){
		bgp.isTurnedOn = false;
		document.getElementById('mainwrap').style.display = "none"
		bgp.killAudio();
		}
	else{
		bgp.isTurnedOn = true;
		bgp.initRequest();
		document.getElementById('mainwrap').style.display = "block"
	}
		
		

}


function changeImage(isPlaying){
	if(isPlaying)
	document.getElementById('play').setAttribute("src", "pause.png");
	else
	document.getElementById('play').setAttribute("src", "play.png");
}

function restoreSettings(){
if(typeof localStorage["search"] !== 'undefined'){
  document.getElementById("search").value =  localStorage["search"];
  if(localStorage["search"].trim()!="")
	document.getElementById("genre").disabled = true;
  }
  else
  document.getElementById("search").value = "";
    
	
if(typeof localStorage["genre"] !== 'undefined')
  document.getElementById("genre").value =  localStorage["genre"];
  else
  document.getElementById("genre").value = "Trance";
  

}

function getRandomIntR (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}