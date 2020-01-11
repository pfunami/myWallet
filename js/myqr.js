const video = $("#camera");     // === document.querySelector("#camera");
const canvas = $("#picture");    // === document.querySelector("#picture");
const ctx = canvas.getContext("2d");

/** カメラ設定 */
const constraints = {
    audio: false,
    video: {
        width: 300,
        height: 200,
        facingMode: "user"   // フロントカメラを利用する
    }
};

/**
 * カメラを<video>と同期
 */
navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = (e) => {
            video.play();

            // QRコードのチェック開始
            checkPicture();
        };
    })
    .catch((err) => {
        console.log(err.name + ": " + err.message);
    });


/**
 * QRコードの読み取り
 */
function checkPicture() {
    // カメラの映像をCanvasに複写
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // QRコードの読み取り
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    //----------------------
    // 存在する場合
    //----------------------
    if (code) {
        // 結果を表示
        // setQRResult("#result", code.data);  // 文字列
        defRec(code.data);
        drawLine(ctx, code.location);       // 見つかった箇所に線を引く

        // video と canvas を入れ替え
        video.style.display = 'none';
        video.pause();
        canvas.style.display = 'inline';
        setTimeout(() => {
            loadnextpag();
        }, 1500);
    }
    //----------------------
    // 存在しない場合
    //----------------------
    else {
        // 0.3秒後にもう一度チェックする
        setTimeout(() => {
            checkPicture();
        }, 300);
    }
}

function loadnextpag() {
    document.querySelector('#myNavigator').pushPage('page4.html', {data: {title: '送金額を決定する'}});
}

/**
 * 発見されたQRコードに線を引く
 *
 * @param {Object} ctx
 * @param {Object} pos
 * @param {Object} options
 * @return {void}
 */
function drawLine(ctx, pos, options = {color: "blue", size: 5}) {
    // 線のスタイル設定
    ctx.strokeStyle = options.color;
    ctx.lineWidth = options.size;

    // 線を描く
    ctx.beginPath();
    ctx.moveTo(pos.topLeftCorner.x, pos.topLeftCorner.y);         // 左上からスタート
    ctx.lineTo(pos.topRightCorner.x, pos.topRightCorner.y);       // 右上
    ctx.lineTo(pos.bottomRightCorner.x, pos.bottomRightCorner.y); // 右下
    ctx.lineTo(pos.bottomLeftCorner.x, pos.bottomLeftCorner.y);   // 左下
    ctx.lineTo(pos.topLeftCorner.x, pos.topLeftCorner.y);         // 左上に戻る
    ctx.stroke();
}

/**
 * QRコードの読み取り結果を表示する
 *
 * @param {String} id
 * @param {String} data
 * @return {void}
 */
function setQRResult(id, data) {
    $(id).innerHTML = escapeHTML(data);
}

/**
 * jQuery style wrapper
 *
 * @param {string} selector
 * @return {Object}
 */
function $(selector) {
    return (document.querySelector(selector));
}

/**
 * HTML表示用に文字列をエスケープする
 *
 * @param {string} str
 * @return {string}
 */
function escapeHTML(str) {
    let result = "";
    result = str.replace("&", "&amp;");
    result = str.replace("'", "&#x27;");
    result = str.replace("`", "&#x60;");
    result = str.replace('"', "&quot;");
    result = str.replace("<", "&lt;");
    result = str.replace(">", "&gt;");
    result = str.replace(/\n/, "<br>");

    return (result);
}