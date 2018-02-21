	var iFrame = document.createElement("iframe");
	var url =window.location.href;
	var bridgetFingerprint = localStorage.getItem('bridget-fingerprint');
	var bridgetUsername = localStorage.getItem('bridget-username');
	if(!bridgetFingerprint){
		var bridgetFingerprint = new Date().getTime() + Math.random();
		localStorage.setItem("bridget-fingerprint", bridgetFingerprint);   
	}
	iFrame.setAttribute("src", "http://bridget.com/bridget?bridget_url="+url+"&fingerPrint="+bridgetFingerprint);
	iFrame.setAttribute("frameBorder", 0);
	iFrame.style.width = "640px";
	iFrame.style.height = "480px";
	document.getElementById('bridget_container').appendChild(iFrame);
	document.getElementById('bridget_container').style.position="fixed";
	document.getElementById('bridget_container').style.bottom="0";
	document.getElementById('bridget_container').style.right="0";
	document.getElementById("bridget_container").style.zIndex = "10000";