var canvas_width = 500, canvas_height = 500
var radius_base = 150
var radius_handle = 72
var radius_shaft = 120
var range = canvas_width / 2 - 10
var step = 18
var joystick = {x: 0, y: 0}
var click_state = 0
var ratio = 0.5

function init(){
                canvas_width = Math.round(canvas_width * ratio)
                canvas_height = Math.round(canvas_height * ratio)
                radius_base = Math.round(radius_base * ratio)
                radius_handle = Math.round(radius_handle * ratio)
                radius_shaft = Math.round(radius_shaft * ratio)
                range = Math.round(range * ratio)
                step = Math.round(step * ratio)

                var canvas = document.getElementById('remote')
                canvas.width = canvas_width
                canvas.height = canvas_height

                canvas.addEventListener('touchstart', mouse_down)
                canvas.addEventListener('touchend', mouse_up)
                canvas.addEventListener('touchmove', mouse_move)
                canvas.addEventListener('mousedown', mouse_down)
                canvas.addEventListener('mouseup', mouse_up)
                canvas.addEventListener('mousemove', mouse_move)

                var ctx = canvas.getContext('2d')
                ctx.translate(canvas_width / 2, canvas_height / 2)
                ctx.shadowBlur = 20
                ctx.shadowColor = 'LightGray'
                ctx.lineCap = 'round'
                ctx.lineJoin = 'round'
                update_view()
}

function key_press(k, event) {
    var oEvent = document.createEvent('KeyboardEvent')

    // Chromium Hack
    Object.defineProperty(oEvent, 'keyCode', {
                get : function() {
                    return this.keyCodeVal
                }
    })
    Object.defineProperty(oEvent, 'which', {
                get : function() {
                    return this.keyCodeVal
                }
    })

    if (oEvent.initKeyboardEvent) {
        oEvent.initKeyboardEvent(event, true, true, document.defaultView, false, false, false, false, k, k)
    } else {
        oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, k, 0)
    }

    oEvent.keyCodeVal = k

    if (oEvent.keyCode !== k) {
        console.log("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")")
    }

    document.dispatchEvent(oEvent)
}

function send_data(){
                var x = joystick.x, y = joystick.y
                var joystick_range = range - radius_handle
                x = Math.round(x * 50 / joystick_range) + 50
                y = Math.round(-(y * 50 / joystick_range)) + 50
                if(x < 25){
                    key_press(37, "keydown")
                } else 
                if(x > 75){
                    key_press(39, "keydown")
                } else {
                    key_press(39, "keyup")
                    key_press(37, "keyup")
                }
                if(y < 25){
                    key_press(40, "keydown")
                } else 
                if(y > 75){
                    key_press(38, "keydown")
                } else {
                    key_press(40, "keyup")
                    key_press(38, "keyup")
                }
}

function update_view(){
                var x = joystick.x, y = joystick.y

                var canvas = document.getElementById('remote')
                var ctx = canvas.getContext('2d')

                ctx.clearRect(-canvas_width / 2, -canvas_height / 2, canvas_width, canvas_height)

                ctx.lineWidth = 3
                ctx.strokeStyle = 'gray'
                ctx.fillStyle = 'LightGray'
                ctx.beginPath()
                ctx.arc(0, 0, range, 0, 2 * Math.PI)
                ctx.stroke()
                ctx.fill()

                ctx.strokeStyle = 'black'
                ctx.fillStyle = 'hsl(0, 0%, 35%)'
                ctx.beginPath()
                ctx.arc(0, 0, radius_base, 0, 2 * Math.PI)
                ctx.stroke()
                ctx.fill()

                ctx.strokeStyle = 'red'

                var lineWidth = radius_shaft
                var pre_x = pre_y = 0
                var x_end = x / 5
                var y_end = y / 5
                var max_count  = (radius_shaft - 10) / step
                var count = 1

                while(lineWidth >= 10){
                    var cur_x = Math.round(count * x_end / max_count)
                    var cur_y = Math.round(count * y_end / max_count)
                    ctx.lineWidth = lineWidth
                    ctx.beginPath()
                    ctx.lineTo(pre_x, pre_y)
                    ctx.lineTo(cur_x, cur_y)
                    ctx.stroke()

                    lineWidth -= step
                    pre_x = cur_x
                    pre_y = cur_y
                    count++
                }

                var x_start = Math.round(x / 3)
                var y_start = Math.round(y / 3)
                lineWidth += step

                ctx.beginPath()
                ctx.lineTo(pre_x, pre_y)
                ctx.lineTo(x_start, y_start)
                ctx.stroke()

                count = 1
                pre_x = x_start
                pre_y = y_start

                while(lineWidth < radius_shaft){
                    var cur_x = Math.round(x_start + count * (x - x_start) / max_count)
                    var cur_y = Math.round(y_start + count * (y - y_start) / max_count)
                    ctx.lineWidth = lineWidth
                    ctx.beginPath()
                    ctx.lineTo(pre_x, pre_y)
                    ctx.lineTo(cur_x, cur_y)
                    ctx.stroke()

                    lineWidth += step
                    pre_x = cur_x
                    pre_y = cur_y
                    count++
                }

                var grd = ctx.createRadialGradient(x, y, 0, x, y, radius_handle)
                for(var i = 85; i >= 50; i -= 5){
                    grd.addColorStop((85 - i) / 35, 'hsl(0, 100%, ' + i + '%)')
                }

                ctx.fillStyle = grd
                ctx.beginPath()
                ctx.arc(x, y, radius_handle, 0, 2 * Math.PI)
                ctx.fill()
}

function process_event(event){
                var pos_x, pos_y
                if(event.offsetX){
                    pos_x = event.offsetX - canvas_width / 2
                    pos_y = event.offsetY - canvas_height / 2
                } else
                if(event.layerX){
                    pos_x = event.layerX - canvas_width / 2
                    pos_y = event.layerY - canvas_height / 2
                } else {
                    pos_x = (Math.round(event.touches[0].pageX - event.touches[0].target.offsetLeft)) - canvas_width / 2
                    pos_y = (Math.round(event.touches[0].pageY - event.touches[0].target.offsetTop)) - canvas_height / 2
                }

                return {x: pos_x, y: pos_y}
}

function mouse_down(){
                event.preventDefault()

                var pos = process_event(event)

                var delta_x = pos.x - joystick.x
                var delta_y = pos.y - joystick.y

                var dist = Math.sqrt(delta_x * delta_x + delta_y * delta_y)

                if(dist > radius_handle){
                    return
                }

                click_state = 1

                var radius = Math.sqrt(pos.x * pos.x + pos.y * pos.y)

                if(radius < (range - radius_handle)){
                    joystick = pos
                    send_data()
                    update_view()
                }
}

function mouse_up(){
                event.preventDefault()
                click_state = 0
}

function mouse_move(){
                event.preventDefault()

                if(!click_state){
                    return
                }

                var pos = process_event(event)

                var radius = Math.sqrt(pos.x * pos.x + pos.y * pos.y)

                if(radius < (range - radius_handle)){
                    joystick = pos
                    send_data()
                    update_view()
                }
}
window.onload = init 
