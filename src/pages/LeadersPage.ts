export default class LeadersPage {
    main: HTMLElement = document.querySelector("main") as HTMLElement
    router: Record<string, any>

    constructor(router: Record<string, any>) {
        this.router = router
    }

    init() {
        this.main.textContent = "страница лидеров"
    }

    exit() {
        this.main.innerHTML = ""
    }
}