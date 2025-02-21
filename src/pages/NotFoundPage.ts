export default class NotFoundPage {
    main: HTMLElement = document.querySelector("main") as HTMLElement
    router: Record<string, any>

    constructor(router: Record<string, any>) {
        this.router = router
    }

    init() {
        this.main.textContent = "такой старницы нет"
    }

    exit() {
        this.main.innerHTML = ""
    }
}