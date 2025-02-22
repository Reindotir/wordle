export default class LeadersPage {
    main: HTMLElement = document.querySelector("main") as HTMLElement
    router: Record<string, any>
    ui: Record<string, any> = store.st.ui
    box!: HTMLElement 

    constructor(router: Record<string, any>) {
        this.router = router
    }

    init() {
        this.ui.add(".leadersBox", {
            
        })
        this.box = document.createElement("div")
        this.box.classList.add("leadersBox")
        main.appendChild(this.box)
        
        this.initTop()
        this.initPlace()
        this.initStatus()
    }
    
    initTop() {
        this.ui.add(".top-box", {
            
        })
        const topBox = document.createElement("div")
        topBox.classList.add("top-box")
        
        this.ui.add('.top-list', {
            
        })
        const list = document.createElement("div")
        topBox.appendChild(list)
        list.classList.add("top-list")
        
        this.ui.add(".user-box", {
            
        })
        this.ui.add(".user-name", {
            
        }) 
        this.ui.add('.user-data', {
            
        })
        const newUser = (data) => {
            const userBox = document.createElement("div")
            userBox.classList.add("user-box")
            
            const name = document.createElement("span")
            name.classList.add('user-name')
            name.textContent = data.name
            userBox.appendChild(name)
            
            const data = document.createElement("span")
            data.classList.add("user-data")
            data.textContent = data.value
            userBox.appendChild(data)
            
            list.appendChild(userBox)
        }
        
        
    }
    
    initPlace() {
        
    }
    
    initStatus() {
        
    }

    exit() {
        this.main.innerHTML = ""
    }
}