const video = document.querySelector("video");
let canv = document.querySelector("canvas");

const context = canv.getContext("2d");
setInterval(() => {
    context.drawImage(video, 0, 0, this.width, this.height);
    const imageData = context.getImageData(0, 0, this.width, this.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
        console.log("Found QR code", code, code.data);
    }
}, 500);