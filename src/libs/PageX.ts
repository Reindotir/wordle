class AppEvent {
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

class EventEmmiter {
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



export class Store extends EventEmmiter {
    state: Record<any, any>
    st: Record<any, any>
    actions: Record<string, Function>
    
    constructor() {
        super()
        this.state = {}
        this.st = this.state
        this.actions = {}

        this.on("change", (e: AppEvent) => {
            let path = e.path
            if (!path) return
            
            // доделаешь
        })
    }
    
    getModule(path: string, obj: Record<string, any> = this.state): any {
        if (!path) return
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    }
    
    setState<T extends Record<string, any>>(newState: T, module: Record<any, any> | string = this.state): void {
        let path = ''
        if (typeof module === "string") {
            path = module
            module = this.getModule(module)
        }
        
        const event = this.emit("change", {
            path: path,
            module: module,
            newState: newState,
        })
        if (event.prevented) return
        newState = event.newState
        
        Object.assign(module as T, newState)
    }

    setAction(name: string, callback: Function) {
        this.actions[name] = callback
    }

    delAction(name: string) {
        delete this.actions[name]
    }
    
    dispatch(actionName: string, data: Record<any, any>) {
        const action = this.actions[actionName]
        if (!action) return
        
        const res = action(data)
        if (Array.isArray(res)) {
            this.setState(res[0], res[1])
        } else if (typeof res === "object") {
            this.setState(res)
        }
    }
}

export const store = new Store()

export class Router extends EventEmmiter {
    op: Record<string, any>
    tree: Record<string, any> = {}
    straightTree: Record<string, any> = {}
    
    branch: Record<string, any> = {}
    oldBranch: Record<string, any> = {}
    
    initContext: Record<string, any> = {}
    exitContext: Record<string, any> = {}
    errorContext: Record<string, any> = {}

    _info: Record<any, any> = {
        version: "1.0.0",
    }
    
    constructor(op: Record<string, any> = {}) {
        super()
        this.op = {
            linkAttr: "data-link",
        }
        Object.assign(this.op, op)

        this.init()
    }

    init() {
        this.initCore()
        this.initWatcher()
        this.initHandler()
    }

    initCore() {
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement

            const link = target.closest("a")
            if (!link || !link.hasAttribute(this.op.linkAttr)) return
            if (this.emit("linkClick", {
                link: link,
                event: e,
            }).prevented) return
            e.preventDefault()

            let href = link.getAttribute("href")
            if (href) this.navigate(href)
        }, { capture: true })

        this.on("pathRegex", (e: AppEvent) => {
            e.path = "^" + e.path
                .replace(/\//g, '\\/')
                .replace(/\*/g, "[^/]*") 
            + "$"
        })
    }

    initWatcher() {
        window.addEventListener("hashchange", (e) => {
            this.emit("hashchange", { event: e })
        })

        window.addEventListener("popstate", (e) => {
            this.emit("popstate", { event: e })
        })
    }

    initHandler() {
        this.on("popstate", () => {
            this.navigate(location.pathname)
        })
    }

    add(selector: string, page: Function, option: Record<string, any> = {}) {
        const node = {
            page: page,
            conf: option.conf || {},
            sub: option.sub || {},
        }

        this.tree[selector] = node
        this.update()
    }

    remove(path: string): void {
        delete this.tree[path]
    }

    get path(): string {
        return window.location.pathname + window.location.search + window.location.hash
    }

    async navigate(path: string, data: Record<string, any> = {}): Promise<AppEvent> {
        const event = this.emit("navigate", {
            path: path,
            oldPath: this.path,
            data: data,
        })
        if (event.prevented) return event
        
        if (path.startsWith("#")) {
            window.location.hash = path
            return event
        }
        
        if (!path.startsWith("/")) path = window.location.pathname + path

        history.pushState(data, "", path)

        const branch = this.find(path)
        if (branch) this.render(branch)
        return event
    }
    
    async render(branch: Record<string, any>) {
        this.emit("progressUpdate", {
            percent: 1,
            text: "Render start",
        })
        
        this.errorContext = {}
        const newBranch: Record<string, any> = {}

        const keys1 = Object.keys(this.branch)
        const keys2 = Object.keys(branch)

        const toExit: Record<string, any> = {}
        const toInit: Record<string, any> = {}

        let i = 0
        while (i < keys1.length && i < keys2.length && keys1[i] === keys2[i]) {
            newBranch[keys1[i]] = branch[keys1[i]]
            i++
        }
        for (let j = i; j < keys1.length; j++) {
            toExit[keys1[j]] = this.branch[keys1[j]]
        }
        for (let j = i; j < keys2.length; j++) {
            toInit[keys2[j]] = branch[keys2[j]]
        }
        
        this.emit("progressUpdate", { percent: 20, text: "Found page" })
        if (!Object.keys(toExit).length && !Object.keys(toInit).length) {
            this.emit("progressUpdate", { percent: 50, text: "Reloading..."})
            this.reLoad()
            this.emit("progressUpdate", { percent: 100, text: "Reloading end"})
            return
        }
        
        this.exitContext = {}
        this.initContext = {}
        
        for (const key of Object.keys(toExit).reverse()) {
            const node = toExit[key]
            await this.exitPage(node.page)
        }

        this.emit("progressUpdate", { percent: 50, text: "Exit end"})
        let percentOfPage: number = 0
        let curePercent = 50
        if (Object.keys(toInit)) percentOfPage = 50 / Object.keys(toInit).length
        
        for (const key of Object.keys(toInit)) {
            const node = toInit[key]
            const insPage = await this.initPage(node.page, true)

            if (!insPage) {
                this.emit("renderFail", { 
                    branch: this.branch,
                    node: node, 
                    res: insPage,
                })
                break
            }
            
            newBranch[key] = {
                page: insPage,
                conf: node.conf,
            }
            
            curePercent += percentOfPage
            this.emit("progressUpdate", { percent: curePercent, text: "Rendering pages"})
        }

        this.oldBranch = this.branch
        this.branch = newBranch
        this.emit("progressUpdate", { percent: 100, text: "Render end" })
    }

    async reLoad() {
        this.errorContext = {}
        this.initContext = {}
        this.exitContext = {}
        
        for (const key of Object.keys(this.branch).reverse()) {
            const node = this.branch[key]

            await this.exitPage(node.page)
        }

        for (const key of Object.keys(this.branch)) {
            const node = this.branch[key]

            const insPage = await this.initPage(node.page.constructor)
            if (!insPage) {
                this.emit("renderFail", { 
                    branch: this.branch, 
                    node: node, 
                    res: insPage,
                })
                break
            }
            node.page = insPage
        }
    }
    
    find(path: string): Record<string, any> | null  {
        const branches: Array<any> = []
        for (const key in this.straightTree) {
            if (this.toRegex(key).test(path)) {
                branches.push(this.straightTree[key])
            }
        }

        let prior = 0
        let cureBranch = branches[0]
        for (const branch of branches) {
            let priorSum = 0
            for (const key in branch) {
                const node = branch[key]
                priorSum += node.conf.priority || 0
            }
            if (priorSum > prior) cureBranch = branch
        }
        
        if (cureBranch) return cureBranch
        return null
    }

    toRegex(path: string, callback?: (path: string) => string): RegExp {
        const event = this.emit("pathRegex", {
            path: path,
            callback: callback
        })

        let curePath = event.path 
        let res 
        if (callback) {
            res = callback(curePath)
        }
        if (typeof res === "string") curePath = res

        return new RegExp(curePath)
    }
    
    update() {
        const buildTree = (tree: Record<string, any>, basePath = "", parentPages = {}) => {
            const sTree: Record<string, any> = {}
    
            for (const path in tree) {
                const fullPath = basePath + path
                const { page, conf = {}, sub = {} } = tree[path]
    
                const newBranch = { ...parentPages, [path]: { page, conf } }
                sTree[fullPath] = newBranch
    
                Object.assign(sTree, buildTree(sub, fullPath, newBranch))
            }
    
            return sTree
        }
    
        this.straightTree = buildTree(this.tree)
    }

    getParams(params: string = ""): Record<string, any> {
        return Object.fromEntries(new URLSearchParams(params || window.location.search))
    }

    setParams(param: Record<string, string>): void
    setParams(param: string, value: string): void
    setParams(param: Record<string, string> | string, value?: string): void {
        const params = new URLSearchParams(window.location.search)

        if (typeof param === "string" && value !== undefined) {
            params.set(param, value)
        } else if (typeof param === "object") {
            for (const key in param) {
                params.set(key, param[key])
            }
        }

        history.pushState(history.state, "", `${location.pathname}?${params.toString()}${location.hash}`)
    }

    deleteParams(...keys: string[]) {
        const params = new URLSearchParams(window.location.search)

        keys.forEach((key) => {
            params.delete(key)
        })

        history.pushState(history.state, "", `${location.pathname}?${params.toString()}${location.hash}`)
    }

    replace(Params: Record<string, string>) {
        const params = new URLSearchParams(Params)

        history.pushState(history.state, "", `${location.pathname}?${params.toString()}${location.hash}`)
    }

    parseUrl(url: string) {
        const urlObj = new URL(url, window.location.origin)
    
        return {
            path: urlObj.pathname,
            search: Object.fromEntries(urlObj.searchParams.entries()),
            hash: urlObj.hash,
        }
    }
    
    async initPage(page: (new (...args: any[]) => any) | null | Function, getPage = false) {
        if (getPage && page) page = await this.getPage(page)
        if (!page) return null

        let ins: Record<string, any> | null = null
        try {
            ins = new page(this)
            if (ins && typeof ins.init === "function") {
                let res = ins.init()
                if (res instanceof Promise) await this.wait(res)
            }
        } catch(e) {
            console.error("Can't init page:", page)
            console.error("Error:", e)
        }
        
        return ins
    }
    
    async exitPage(page: Record<string, any>) {
        if (!page) return 
        try {
            if (typeof page.exit !== "function") return
            let res = page.exit()
            if (res instanceof Promise) await res 
        } catch (e) {
            console.error("Can't exit on page:", page)
            console.error("Error:", e)
        }
    }
    
    async wait(promise: Promise<any>, time: number = 5000) {
        const base = new Promise<void>((_, reject) => {
            setTimeout(() => {
                reject(new Error("Timeout error"))
            }, time)
        })
        return Promise.race([promise, base])
    }
    
    async getPage(page: (() => Promise<{ default: Function }>) | Function): Promise<Function | null> {
        if (this.isFn(page)) {
            try {
                let res = page()
                if (res instanceof Promise) res = (await res).default
                if (typeof res !== "function") {
                    throw new Error("Module doesnt has default property")
                } else {
                    return res
                }
            } catch(e) {
                console.error("Can't get module through lazy loading: " + e)
                console.error("Page: ", page)
            }
        }
        return page
    }
    
    isClass(el: any) {
        return typeof el === "function" &&
        Function.prototype.toString.call(el).startsWith("class")
    }
    
    isFn(el: any) {
        return typeof el === "function" &&
        !Function.prototype.toString.call(el).startsWith("сlass")
    }
}