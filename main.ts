// Input shape: reciver_id:sender_id:message
// or constat length id
function read_message (_message: string) {
    return ["reciver_id", "sender_id", "message"]
}
// Array length = 3
// "reciver_id",
// "sender_id",
// "message"
function send_message (message_data: any[]) {
    radio.sendString("")
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
radio.onReceivedString(function (receivedString) {
    if (STATE == "RELAY") {
        let list: number[] = []
        message_data = read_message(receivedString)
        basic.showString("Do shit here")
        send_message(list)
    }
})
input.onButtonPressed(Button.B, function () {
    if (STATE == "INIT") {
        if (Endpoint) {
            if (id == -1) {
                id = 0
            }
            Switch_State("PAIR")
        }
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
let message_data: string[] = []
let temp_id = 0
let Endpoint = false
let STATE = ""
let id = 0
radio.setGroup(154)
radio.setTransmitSerialNumber(true)
id = -1
Switch_State("INIT")
basic.forever(function () {
    if (STATE == "PAIR") {
        Pair()
    }
})
