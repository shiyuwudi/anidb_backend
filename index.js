var dgram = require('dgram');
var constants = require("./consts");
const express = require('express');
const app = express()
const port = constants.server.port;
var lastSendTime = -1;
var TIME_TO_WAIT_UNTIL_NEXT_PACKET = 10000; // ms

function _sendMsg(msg) {
    return new Promise((resolve, reject) => {
        var udp_client = dgram.createSocket('udp4'); 
        // 接收消息
        udp_client.on('message', function (msg,rinfo) {
            console.log(`receive message from ${rinfo.address}:${rinfo.port}：${msg}`);
            resolve(msg + "");
            udp_client.close();
        });

        // socket closed
        udp_client.on('close',function(){
            console.log('udp client closed.');
        })

        // 错误处理
        udp_client.on('error', function () {
            console.log('some error on udp client.');
            udp_client.close();
        })
        var SendLen = msg.length;
        udp_client.send(msg, 0, SendLen, constants.anidb.port, constants.anidb.host);
    });
}

async function sendMsg(params) {
    const now = Date.now();
    const timePassed = now - lastSendTime;
    if (timePassed > TIME_TO_WAIT_UNTIL_NEXT_PACKET) {
        const respStr = await _sendMsg(params);
        lastSendTime = now;
        return {
            result: respStr,
        };
    } else {
        return makeError(1, `too fast, try after ${TIME_TO_WAIT_UNTIL_NEXT_PACKET - timePassed}ms`);
    }
}

function makeError(code, msg) {
    return {
        error: {
            timestamp: Date.now(),
            code,
            msg,
        },
    };
}

app.get('/updated', async (req, res) => {
    const msg = 'UPDATED entity=1&age=30';
    let r;
    try {
        r = await sendMsg(msg);
    } catch (error) {
        r = makeError(2, error);
    }
    res.send(r);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))