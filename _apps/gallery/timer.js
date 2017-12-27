export class Timer {
    constructor(time, cbk, autostart) {
        this.time = time || 1000
        this._cbk = cbk
        this._hdl = null
        if(autostart) this.start()
    }

    start() {
        if(this._hdl)
            clearTimeout(this._hdl)
        this._hdl = setTimeout(this._cbk, this.time)
    }

    cancel() {
        if(this._hdl) {
            clearTimeout(this._hdl)
            this._hdl = null
        }
    }

    restart() {
        this.cancel()
        this.start()
    }
}

export class IntervalTimer extends Timer {
    start() {
        if(this._hdl)
            clearInterval(this._hdl)

        this._hdl = setInterval(this._cbk, this.time)
    }

    cancel() {
        if(this._hdl) {
            clearInterval(this._hdl)
            this._hdl = null
        }
    }

}

export class AnimationTimer extends Timer {
    start() {
        this._startTime = null
        const func = (timestamp) => {
            if(this._startTime === null) this._startTime = timestamp
            if(timestamp - this._startTime <= this.time) {
                this._cbk((timestamp - this._startTime) / this.time, timestamp)
                window.requestAnimationFrame(func)
            } else {
                this._endCbk()
            }
        }
        window.requestAnimationFrame(func)
    }

    stop() {
        this._startTime = this.time + 1
    }

    onEnd(cbk) {
        this._endCbk = cbk
    }

    restart() {
        this.stop()
        this.start()
    }
}