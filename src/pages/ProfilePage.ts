export default class ProfilePage {
    main: HTMLElement = document.querySelector("main") as HTMLElement
    router: Record<string, any>

    constructor(router: Record<string, any>) {
        this.router = router
    }

    init() {
        this.main.textContent = "профиль пользователя"
    }

    exit() {
        this.main.innerHTML = ""
    }
}