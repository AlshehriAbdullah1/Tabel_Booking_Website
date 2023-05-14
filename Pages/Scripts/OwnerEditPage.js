let logoPic = document.getElementById("Logo");
let inputLogo = document.getElementById("upload-Logo");

inputLogo.onchange = function() {
    logoPic.src = URL.createObjectURL(inputLogo.files[0]);
}