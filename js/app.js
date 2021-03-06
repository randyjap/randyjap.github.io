var wrapper = document.getElementById("signature-pad");
var signatureHeaderWrapper = document.getElementById("signature-pad--header");
var clearButton = signatureHeaderWrapper.querySelector("[data-action=clear]");
var changeColorButton = signatureHeaderWrapper.querySelector("[data-action=change-color]");
var undoButton = signatureHeaderWrapper.querySelector("[data-action=undo]");
var toggleAnswerButton = signatureHeaderWrapper.querySelector("[data-action=toggle-answer]");
var answer = document.getElementById("answer");
var question = document.getElementById("question");
var canvas = wrapper.querySelector("canvas");
var signaturePad = new SignaturePad(canvas, {
  // It's Necessary to use an opaque color when saving image as JPEG;
  // this option can be omitted if only saving as PNG or SVG
  backgroundColor: 'rgb(255, 255, 255, 0)'
});

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
// function resizeCanvas() {
//   // When zoomed out to less than 100%, for some very strange reason,
//   // some browsers report devicePixelRatio as less than 1
//   // and only part of the canvas is cleared then.
//   var ratio =  Math.max(window.devicePixelRatio || 1, 1);

//   // This part causes the canvas to be cleared
//   canvas.width = canvas.offsetWidth * ratio;
//   canvas.height = canvas.offsetHeight * ratio;
//   canvas.getContext("2d").scale(ratio, ratio);

//   // This library does not listen for canvas changes, so after the canvas is automatically
//   // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
//   // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
//   // that the state of this library is consistent with visual state of the canvas, you
//   // have to clear it manually.
//   signaturePad.clear();
// }
function resizeCanvas() {
	var cachedWidth;
	var cachedImage;

	if(canvas.offsetWidth !== cachedWidth){ //add
		if (typeof signaturePad != 'undefined') { // add
			cachedImage = signaturePad.toDataURL("image/png");
		}
		cachedWidth = canvas.offsetWidth;   //add
		// When zoomed out to less than 100%, for some very strange reason,
		// some browsers report devicePixelRatio as less than 1
		// and only part of the canvas is cleared then.
		var ratio = Math.max(window.devicePixelRatio || 1, 1);
		canvas.width = canvas.offsetWidth * ratio;
		canvas.height = canvas.offsetHeight * ratio;
		canvas.getContext("2d").scale(ratio, ratio);
		if (typeof signaturePad != 'undefined') {
			// signaturePad.clear(); // remove
			signaturePad.fromDataURL(cachedImage); // add
		}
	}
}

// On mobile devices it might make more sense to listen to orientation change,
// rather than window resize events.
window.onresize = resizeCanvas;
resizeCanvas();

function download(dataURL, filename) {
  var blob = dataURLToBlob(dataURL);
  var url = window.URL.createObjectURL(blob);

  var a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
}

// One could simply use Canvas#toBlob method instead, but it's just to show
// that it can be done using result of SignaturePad#toDataURL.
function dataURLToBlob(dataURL) {
  // Code taken from https://github.com/ebidel/filer.js
  var parts = dataURL.split(';base64,');
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

clearButton.addEventListener("click", function (event) {
  signaturePad.clear();
});

undoButton.addEventListener("click", function (event) {
  var data = signaturePad.toData();

  if (data) {
    data.pop(); // remove the last dot or line
    signaturePad.fromData(data);
  }
});

changeColorButton.addEventListener("click", function (event) {
  var red = "rgb(255, 0, 0)";
  var black = "rgb(0, 0, 0)";
  if (signaturePad.penColor == red) {
    signaturePad.penColor = black;
  } else {
    signaturePad.penColor = red;
  }
});

toggleAnswerButton.addEventListener("click", function (event) {
  if (answer.style.display == 'none') {
    answer.style.display = 'block';
    question.style.display ='none'
    canvas.style.display ='none'
  } else {
    answer.style.display = 'none';
    question.style.display ='block'
    canvas.style.display ='block'
  }
});