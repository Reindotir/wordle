import 

export class App {
    constructor(option) {
        this.op = {
            autoInit: true,
        }

        Object.assign(this.op, option)

        if (this.op.autoInit) this.init()
    }

    init() {
        this.initDesign()
        this.initContent() 
    }

    initDesign() {

    }

    initContent() {

    }
}