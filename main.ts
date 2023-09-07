input.onButtonPressed(Button.A, function () {
    if (STATE == "INIT") {
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        Endpoint = true
    }
})
function Init_Radio (_receivedString: string, _serialNumber: number) {
    if (_receivedString == "PAIR") {
        basic.showString("" + (_serialNumber))
    }
}
function Pair () {
    radio.sendString("PAIR")
}
function Switch_State (_state: string) {
    STATE = _state
    basic.showString(_state)
}
radio.onReceivedString(function (receivedString) {
    if (STATE == "INIT") {
        Init_Radio(receivedString, radio.receivedPacket(RadioPacketProperty.SerialNumber))
    } else if (STATE == "PAIR") {
    	
    } else {
    	
    }
})
input.onButtonPressed(Button.B, function () {
    if (STATE == "INIT") {
        Switch_State("PAIR")
    }
})
function Init () {
	
}
let Endpoint = false
let STATE = ""
radio.setGroup(154)
radio.setTransmitSerialNumber(true)
let id = -1
Switch_State("INIT")
basic.forever(function () {
    if (STATE == "INIT") {
        Init()
    } else if (STATE == "PAIR") {
        Pair()
    } else {
    	
    }
})
