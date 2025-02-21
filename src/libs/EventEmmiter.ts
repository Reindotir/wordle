export class AppEvent {
    [key: string]: any
    type: string
    prevented: boolean
    dispatched: boolean
    
    constructor(type: string, detail: { [key: string]: unknown}) {
        this.type = type
        Object.assign(this, detail)
        
        this.prevented = false
        this.dispatched = false

        for (const key in detail) {
            if (typeof detail[key] === "function" && detail[key] instanceof Function) {
                (this as any)[key] = detail[key].bind(this)
            }
        }
    }
    
    prevent() {
        this.prevented = true
    }
    
    dispatch() {
        this.dispatched = true
    }
}

export class EventEmmiter {
    Event: new (...args: any[]) => any = AppEvent
    listeners: Array<Record<string, any>> = []
    events: Record<string, any> = {}

    on(name: string, callback: Function, option: Record<string, any> = {}): Function {
        if (!this.events[name]) this.events[name] = []

        this.events[name].push({
            callback: callback,
            option: option,
        })

        return () => {
            this.off(name, callback, option)
        }
    }

    off(name: string, callback?: Function, option?: Record<string, any>) {
        if (!Array.isArray(this.events[name])) return

        let listenersIdx: Array<number> = []
        
        this.events[name].forEach((listener, idx) => {
            if (listener.callback === callback) {
                listenersIdx.push(idx)
            }
        })

        if (option) {
            listenersIdx = listenersIdx.filter((idx) => {
                const listener = this.events[name][idx]
                if (listener.option === option) {
                    return true
                }
                return false
            })
        }

        listenersIdx.forEach((idx) => {
            this.events[name].splice(idx, 1)
        })
    }

    emit(name: string, details: Record<any, any> = {}, ...args: any[]): AppEvent {
        const listeners = this.events[name] || []
        
        const event = new this.Event(name, details)

        const toDelete: Array<any> = []
        
        for (const listener of listeners) {
            listener.callback(event, ...args)
            
            const conf = listener.option
            if (conf) {
                if (conf.once === true) {
                    toDelete.push({name: name, 
                        callback: listener.callback, 
                        conf: conf
                    })
                }
            }
            
            if (event.dispatched) {
                break
            }
        }

        toDelete.forEach((listener) => {
            this.off(listener.name,
                listener.callback,
                listener.conf
            )
        })
        
        return event
    }
}