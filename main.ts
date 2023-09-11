input.onButtonPressed(Button.A, function () {
    if (STATE == "INIT") {
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
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
}
function Pair () {
    basic.pause(2000)
    radio.sendValue("PAIR", id)
}
function Switch_State (_state: string) {
    STATE = _state
    basic.showString(_state)
}
input.onButtonPressed(Button.B, function () {
    if (STATE == "INIT") {
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
}
radio.onReceivedValue(function (name, value) {
    if (STATE == "INIT") {
        Init_Radio(name, value, radio.receivedPacket(RadioPacketProperty.SerialNumber))
    } else if (STATE == "PAIR") {
        Pair_Radio(name, value, radio.receivedPacket(RadioPacketProperty.SerialNumber))
    } else {
    	
    }
})
function Init () {
	
}
let temp_id = 0
let Endpoint = false
let STATE = ""
let id = 0
radio.setGroup(154)
radio.setTransmitSerialNumber(true)
id = -1
Switch_State("INIT")
basic.forever(function () {
    if (STATE == "INIT") {
        Init()
    } else if (STATE == "PAIR") {
        Pair()
    } else {
    	
    }
})
