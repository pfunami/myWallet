if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    ethereum.enable();
    web3.version.getNetwork((error, result) => {
        console.log('Network ID: ' + result)
    });
    var account = "0xc289e22143536db9e0556d87e45dc17cf3f84acd";

    web3.eth.getAccounts((error, result) => {
        account = result[0];
        console.log('Your accounts: ' + account);
    });

    let addr = "0x3E95e8D63644B766303e9E43c243faFfFB8BDB98";
    let abi = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "_supply",
                    "type": "uint256"
                },
                {
                    "name": "_name",
                    "type": "string"
                },
                {
                    "name": "_symbol",
                    "type": "string"
                },
                {
                    "name": "_decimals",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];

    let contract = web3.eth.contract(abi).at(addr);
    let now_balance = -1;

    let receiver;

    function sep(num) {
        return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    }

    let checkBalance = function () {
        contract.balanceOf.call(account, (error, balance) => {
            let b = balance;
            $('#balance').text(sep(balance) + " TEC");
            $('#yen').text(sep(balance / 0.2) + " 円")
            if (now_balance == -1) {
                now_balance = b;
            }
            if (b != now_balance) {
                if (b > now_balance) {
                    getToast.toggle();
                } else if (b < now_balance) {
                    sendToast.toggle();
                }
            }
            now_balance = balance;
        });
    };
    setInterval(checkBalance, 1000);

    let transaction = function () {
        let val = web3.toWei($('#inputEth').val(), "ether");

        contract.transfer.sendTransaction("0x937be33cc76117b967d33966099c81b2d1a9a383", val, {
            from: "0xc289e22143536db9e0556d87e45dc17cf3f84acd",
            gas: 3000000
        }, (error, result) => {
            console.log('Transaction Hash : ' + result);
        });
    };

    $('#send').on('click', function () {
        var modal = document.querySelector('ons-modal');
        modal.show();
        transaction();
        checkBalance();
        modal.hide();
    });

}

document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'page1') {
        page.querySelector('#se').onclick = function () {
            document.querySelector('#myNavigator').pushPage('page2.html', {data: {title: 'QRコードを読み取る'}});
        };
        page.querySelector('#re').onclick = function () {
            document.querySelector('#myNavigator').pushPage('page3.html', {data: {title: 'マイコード'}});
        };
    } else if (page.id !== 'page1') {
        page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    }
});

function writeQr(canvas, data) {
    $('#myinfo').text("あなたのアドレス：" + account);
    return new Promise((res, rej) => {
        QRCode.toCanvas(canvas, data, {
            margin: 2,
            scale: 10
        }, (err, tg) => !err ? res(tg) : rej(err));
    });
}
