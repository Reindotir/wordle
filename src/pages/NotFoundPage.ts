export default class NotFoundPage {
    main: HTMLElement = document.querySelector("main") as HTMLElement
    router: Record<string, any>

    constructor(router: Record<string, any>) {
        this.router = router
    }

    init() {
        this.main.textContent = "Чел, ты ошибся страницей."
        setTimeout(() => {
            //this.router.navigate("/")
            console.log(this.router)
        }, 3000)
    }

    exit() {
        this.main.innerHTML = ""
    }
}