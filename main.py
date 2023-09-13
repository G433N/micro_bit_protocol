# Input shape: reciver_id:sender_id:message
# or constat length id
def read_message(_message: str):
    return ["reciver_id", "sender_id", "message"]
# Array length = 3
# "reciver_id",
# "sender_id",
# "message"
def send_message(message_data: List[any]):
    radio.send_string("")

def on_button_pressed_a():
    global Endpoint
    if STATE == "INIT":
        Endpoint = True
        basic.show_string("ENDPOINT")
input.on_button_pressed(Button.A, on_button_pressed_a)

def Init_Radio(_name: str, _value: number, _serialnumber: number):
    global temp_id, id2
    if _name == "PAIR":
        radio.send_value("HS", _serialnumber)
        temp_id = _value + 1
    elif _name == "HS" and _value == control.device_serial_number():
        id2 = temp_id
        if Endpoint:
            Switch_State("ENDPOINT")
        else:
            Switch_State("PAIR")
    basic.show_number(id2)
def Pair():
    radio.send_value("PAIR", id2)
    basic.pause(2000)
def Switch_State(_state: str):
    global STATE
    STATE = _state
    basic.show_string(_state)

def on_received_string(receivedString):
    global message_data2
    if STATE == "RELAY":
        list2: List[number] = []
        message_data2 = read_message(receivedString)
        basic.show_string("Do shit here")
        send_message(list2)
radio.on_received_string(on_received_string)

def on_button_pressed_b():
    global id2
    if Endpoint and STATE == "INIT":
        if id2 == -1:
            id2 = 0
        Switch_State("PAIR")
input.on_button_pressed(Button.B, on_button_pressed_b)

def Pair_Radio(_name2: str, _value2: number, _serialnumber2: number):
    if _name2 == "HS" and _value2 == control.device_serial_number():
        radio.send_value("HS", _serialnumber2)
        if Endpoint:
            Switch_State("ENDPOINT")
        else:
            Switch_State("RELAY")
    basic.show_number(id2)

def on_received_value(name, value):
    if STATE == "INIT":
        Init_Radio(name,
            value,
            radio.received_packet(RadioPacketProperty.SERIAL_NUMBER))
    elif STATE == "PAIR":
        Pair_Radio(name,
            value,
            radio.received_packet(RadioPacketProperty.SERIAL_NUMBER))
radio.on_received_value(on_received_value)

message_data2: List[str] = []
id2 = 0
temp_id = 0
Endpoint = False
STATE = ""
testing = read_message("0123456")
for value2 in testing:
    basic.show_string("" + (value2))

def on_forever():
    pass
basic.forever(on_forever)
