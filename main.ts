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
    for (let value2 of message_data) {
        message_str_string.unshift(convertToText(value2))
    }
    message_str_string.reverse()
    message_str_string[0] = add_zeros_to_str(message_str_string[0], 1)
    message_str_string[1] = add_zeros_to_str(message_str_string[1], 1)
    message_str_string[2] = add_zeros_to_str(message_str_string[2], 2)
    result_str = ""
    for (let value22 of message_str_string) {
        result_str = "" + result_str + value22
    }
    radio.sendString(result_str)
}
input.onButtonPressed(Button.A, function () {
    if (STATE == "INIT") {
        endpoint = true
        basic.showString("E")
    } else if (STATE == "ENDPOINT") {
        add_input("1")
    }
})
function Init_Radio (_name: string, _value: number, _serialnumber: number) {
    if (_name == "PAIR") {
        radio.sendValue("HS", _serialnumber)
        temp_id = _value + 1
    } else if (_name == "HS" && _value == control.deviceSerialNumber()) {
        id = temp_id
        if (endpoint) {
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
    basic.showString(_state.charAt(0))
}
function repeting_zeros (num: number) {
    zero_str = ""
    for (let index2 = 0; index2 <= num; index2++) {
        zero_str = "0" + zero_str
    }
    return zero_str
}
function base_ten_to_character (base_ten: number) {
    index_of_base_ten = -1
    index_of_base_ten = base_ten_list.indexOf(base_ten)
    if (index_of_base_ten == -1) {
        return "-1"
    }
    return character_list[index_of_base_ten]
}
function add_input (input_value: string) {
    if (input_list.length <= 5) {
        input_list.unshift(input_value)
        plot_lights_binary()
    }
}
input.onButtonPressed(Button.AB, function () {
    if (STATE == "ENDPOINT") {
        if (id == 0) {
            dir = 1
        } else {
            dir = -1
        }
        send_message([id + 1, id, base_three_to_base_ten(input_list)])
        reset_screen()
    }
})
function reset_screen () {
    input_list = []
    is_showing_binary_lights = true
    basic.clearScreen()
}
radio.onReceivedString(function (receivedString) {
    if (STATE == "RELAY") {
        message_data = read_message(receivedString)
        dir = message_data[0] - message_data[1]
        message_data[0] = message_data[0] + dir
        message_data[1] = message_data[1] + dir
        basic.showString("" + (base_ten_to_character(message_data[2])))
        send_message(message_data)
    } else if (STATE == "ENDPOINT") {
        message_data = read_message(receivedString)
        basic.showString("" + (base_ten_to_character(message_data[2])))
    }
})
input.onButtonPressed(Button.B, function () {
    if (endpoint && STATE == "INIT") {
        if (id == -1) {
            id = 0
        }
        Switch_State("PAIR")
    } else if (STATE == "ENDPOINT") {
        add_input("2")
    }
})
function plot_lights_binary () {
    if (is_showing_binary_lights == true) {
        if (input_list[0] == "1") {
            led.plotBrightness(input_list.length - 1, 2, 100)
        } else {
            led.plotBrightness(input_list.length - 1, 2, 255)
        }
    } else {
        plot_lights_array()
        is_showing_binary_lights = true
    }
}
input.onGesture(Gesture.Shake, function () {
    if (STATE == "ENDPOINT") {
        reset_screen()
    }
})
function base_three_to_base_ten (base_three_input_array: any[]) {
    base_ten_number = 0
    for (let index = 0; index <= base_three_input_array.length - 1; index++) {
        base_ten_number = base_ten_number + base_three_input_array[index] * 3 ** index
    }
    return base_ten_number
}
function Pair_Radio (_name: string, _value: number, _serialnumber: number) {
    if (_name == "HS" && _value == control.deviceSerialNumber()) {
        radio.sendValue("HS", _serialnumber)
        if (endpoint) {
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
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (STATE == "ENDPOINT") {
        if (is_showing_binary_lights == true) {
            returned_character = base_ten_to_character(base_three_to_base_ten(input_list))
            if (returned_character == "-1") {
                basic.showLeds(`
                    . # # # .
                    # # . . #
                    # . # . #
                    # . . # #
                    . # # # .
                    `)
            } else {
                basic.showString(returned_character)
            }
            is_showing_binary_lights = false
        } else {
            plot_lights_binary()
        }
    }
})
function plot_lights_array () {
    basic.clearScreen()
    list_index = 0
    for (let value of input_list) {
        if (value == "1") {
            led.plotBrightness(input_list.length - list_index - 1, 2, 100)
        } else {
            led.plotBrightness(input_list.length - list_index - 1, 2, 255)
        }
        list_index += 1
    }
}
let list_index = 0
let returned_character = ""
let base_ten_number = 0
let message_data: number[] = []
let is_showing_binary_lights = false
let dir = 0
let input_list: string[] = []
let index_of_base_ten = 0
let zero_str = ""
let temp_id = 0
let STATE = ""
let result_str = ""
let message_str_string: string[] = []
let message_int = 0
let sender_id = 0
let reciver_id = 0
let base_ten_list: number[] = []
let character_list: string[] = []
let endpoint = false
let id = 0
radio.setGroup(169)
radio.setTransmitSerialNumber(true)
id = -1
endpoint = false
Switch_State("INIT")
character_list = [
"A",
"B",
"C",
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
base_ten_list = [
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
basic.forever(function () {
    if (STATE == "PAIR") {
        Pair()
    }
})
