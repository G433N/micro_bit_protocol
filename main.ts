// Input shape: reciver_id:sender_id:message
// or constat length id
function read_message (_message: string) {
    if (!(7 == _message.length)) {
        return []
    }
    reciver_id = parseFloat(_message.substr(0, 2))
    sender_id = parseFloat(_message.substr(2, 2))
    message_int = parseFloat(_message.substr(4, 3))
    if (true) {
        return [reciver_id, sender_id, message_int]
    }
    return []
}
// Array length = 3
// "reciver_id",
// "sender_id",
// "message"
function send_message (message_data: number[]) {
    if (!(message_data.length == 3)) {
        return
    }
    message_str_string = []
    for (let value of message_data) {
        message_str_string.unshift(convertToText(value))
    }
    message_str_string.reverse()
    message_str_string[0] = add_zeros_to_str(message_str_string[0], 1)
    message_str_string[1] = add_zeros_to_str(message_str_string[1], 1)
    message_str_string[2] = add_zeros_to_str(message_str_string[2], 2)
    result_str = ""
    for (let value2 of message_str_string) {
        result_str = "" + result_str + value2
    }
    radio.sendString(result_str)
}
input.onButtonPressed(Button.A, function () {
    if (STATE == "INIT") {
        Endpoint = true
        basic.showString("ENDPOINT")
    }
})
function Init_Radio (_name: string, _value: number, _serialnumber: number) {
    if (_name == "PAIR") {
        radio.sendValue("HS", _serialnumber)
        temp_id = _value + 1
    } else if (_name == "HS" && _value == control.deviceSerialNumber()) {
        id = temp_id
        if (Endpoint) {
            Switch_State("ENDPOINT")
        } else {
            Switch_State("PAIR")
        }
    }
    basic.showNumber(id)
}
function Pair () {
    radio.sendValue("PAIR", id)
    basic.pause(2000)
}
function Switch_State (_state: string) {
    STATE = _state
    basic.showString(_state)
}
function repeting_zeros (num: number) {
    zero_str = ""
    for (let index = 0; index <= num; index++) {
        zero_str = "0" + zero_str
    }
    return zero_str
}
radio.onReceivedString(function (receivedString) {
    if (STATE == "RELAY") {
        message_data = read_message(receivedString)
        dir = message_data[0] - message_data[1]
        message_data[0] = message_data[0] + dir
        message_data[1] = message_data[1] + dir
        send_message(message_data)
    } else if (STATE == "ENDPOINT") {
    	
    }
})
input.onButtonPressed(Button.B, function () {
    if (Endpoint && STATE == "INIT") {
        if (id == -1) {
            id = 0
        }
        Switch_State("PAIR")
    }
})
function Pair_Radio (_name: string, _value: number, _serialnumber: number) {
    if (_name == "HS" && _value == control.deviceSerialNumber()) {
        radio.sendValue("HS", _serialnumber)
        if (Endpoint) {
            Switch_State("ENDPOINT")
        } else {
            Switch_State("RELAY")
        }
    }
    basic.showNumber(id)
}
radio.onReceivedValue(function (name, value) {
    if (STATE == "INIT") {
        Init_Radio(name, value, radio.receivedPacket(RadioPacketProperty.SerialNumber))
    } else if (STATE == "PAIR") {
        Pair_Radio(name, value, radio.receivedPacket(RadioPacketProperty.SerialNumber))
    }
})
function add_zeros_to_str (text: string, len: number) {
    return "" + repeting_zeros(len - text.length) + text
}
let dir = 0
let message_data: number[] = []
let zero_str = ""
let temp_id = 0
let Endpoint = false
let STATE = ""
let result_str = ""
let message_str_string: string[] = []
let message_int = 0
let sender_id = 0
let reciver_id = 0
let id = 0
let character_list = [
"A",
"B",
"B",
"D",
"E",
"F",
"G",
"H",
"I",
"J",
"K",
"L",
"M",
"N",
"O",
"P",
"Q",
"R",
"S",
"T",
"U",
"V",
"W",
"X",
"Y",
"Z",
"1",
"2",
"3",
"4",
"5",
"6",
"7",
"8",
"9",
"0"
]
let base_ten_list = [
5,
67,
70,
22,
1,
43,
25,
40,
4,
53,
23,
49,
8,
7,
26,
52,
77,
16,
13,
2,
14,
41,
17,
68,
71,
76,
161,
134,
125,
122,
121,
202,
229,
238,
241,
242
]
radio.setGroup(169)
radio.setTransmitSerialNumber(true)
id = -1
Switch_State("INIT")
basic.forever(function () {
    if (STATE == "PAIR") {
        Pair()
    }
})
