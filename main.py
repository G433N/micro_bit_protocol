def on_button_pressed_a():
    global Endpoint
    if STATE == "INIT":
        music.play(music.tone_playable(262, music.beat(BeatFraction.WHOLE)),
            music.PlaybackMode.UNTIL_DONE)
        Endpoint = True
input.on_button_pressed(Button.A, on_button_pressed_a)

def Init_Radio(receivedString: str, serialNumber: str):
    if receivedString == "PAIR":
        basic.show_string(serialNumber)
def Pair():
    pass

def on_received_string(receivedString2):
    if STATE == "INIT":
        Init_Radio(receivedString2, "abc")
    elif STATE == "PAIR":
        pass
    else:
        pass
radio.on_received_string(on_received_string)

def on_button_pressed_b():
    global STATE
    if STATE == "INIT":
        STATE = "PAIR"
input.on_button_pressed(Button.B, on_button_pressed_b)

def Init():
    pass
Endpoint = False
STATE = ""
radio.set_group(154)
radio.set_transmit_serial_number(True)
id2 = -1
STATE = "INIT"

def on_forever():
    if STATE == "INIT":
        Init()
    elif STATE == "PAIR":
        Pair()
    else:
        pass
basic.forever(on_forever)
