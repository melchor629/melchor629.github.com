keys =
  backspace: 8
  tab: 9
  enter: 13
  'return': 13
  shift: 16
  '⇧': 16
  control: 17
  ctrl: 17
  '⌃': 17
  alt: 18
  option: 18
  '⌥': 18
  pause: 19
  capslock: 20
  esc: 27
  space: 32
  pageup: 33
  pagedown: 34
  end: 35
  home: 36
  left: 37
  L: 37
  '←': 37
  up: 38
  U: 38
  '↑': 38
  right: 39
  R: 39
  '→': 39
  down: 40
  D: 40
  '↓': 40
  insert: 45
  'delete': 46
  '0': 48
  '1': 49
  '2': 50
  '3': 51
  '4': 52
  '5': 53
  '6': 54
  '7': 55
  '8': 56
  '9': 57
  a: 65
  b: 66
  c: 67
  d: 68
  e: 69
  f: 70
  g: 71
  h: 72
  i: 73
  j: 74
  k: 75
  l: 76
  m: 77
  n: 78
  o: 79
  p: 80
  q: 81
  r: 82
  s: 83
  t: 84
  u: 85
  v: 86
  w: 87
  x: 88
  y: 89
  z: 90
  '⌘': 91
  command: 91
  kp_0: 96
  kp_1: 97
  kp_2: 98
  kp_3: 99
  kp_4: 100
  kp_5: 101
  kp_6: 102
  kp_7: 103
  kp_8: 104
  kp_9: 105
  kp_multiply: 106
  kp_plus: 107
  kp_minus: 109
  kp_decimal: 110
  kp_divide: 111
  f1: 112
  f2: 113
  f3: 114
  f4: 115
  f5: 116
  f6: 117
  f7: 118
  f8: 119
  f9: 120
  f10: 121
  f11: 122
  f12: 123
  equal: 187
  '=': 187
  comma: 188
  '': 188
  minus: 189
  '-': 189
  period: 190
  '.': 190

strForKey = (key) ->
    for k of keys
        return k if keys[k] is key

class Sequence
    constructor: (@str) ->
        @seq = @str.split ' '
        @keys = []
        for i in @seq
            @keys.push keys[i]

    then: (doneCbk) ->
        @doneCbk = doneCbk

    match: (keys) ->
        for i in [0..@keys.length-1]
            return false if keys[i] isnt @keys[i]
        true

    startsWith: (keys) ->
        for i in [0..keys.length-1]
            return false if keys[i] isnt @keys[i]
        true

class Cheet
    constructor: ->
        @seqs = []
        @matchingSeqs = []
        @keysPressed = []

    add: (seqStr) ->
        s = new Sequence(seqStr)
        @seqs.push(s)
        s

    keydown: (key) ->
        @keysPressed.push key

        @matchingSeqs = []
        for seq in @seqs
            @matchingSeqs.push(seq) if seq.startsWith(@keysPressed)

        if @matchingSeqs.length > 0
            @onnext(key, @matchingSeqs[0].seq[@keysPressed.length - 1]) if @onnext

        if @matchingSeqs.length is 0
            @reset()
        else if @matchingSeqs.length is 1
            if @matchingSeqs[0].match(@keysPressed)
                @done(@matchingSeqs[0])

    done: (seq) ->
        @matchingSeqs = []
        @keysPressed = []
        @ondone(seq) if @ondone
        seq.doneCbk() if seq.doneCbk

    reset: () ->
        @matchingSeqs = []
        @keysPressed = []
        @onfail() if @onfail

window.Sequence = Sequence
window.cheet = new Cheet()

$(window).keydown (e) ->
    window.cheet.keydown e.keyCode

$(window).blur ->
    window.cheet.reset()
