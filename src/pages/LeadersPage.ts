import { store } from "../libs/PageX"

export default class LeadersPage {
    main: HTMLElement = document.querySelector("main") as HTMLElement
    router: Record<string, any>
    ui: Record<string, any> = store.st.ui
    box!: HTMLElement 

    constructor(router: Record<string, any>) {
        this.router = router
        store.st.header.focus(0)
    }

    init() {
        this.ui.add(".leadersBox", {
            display: 'grid',
            width: "100%",
            height: "100%",
            alignItems: 'center',
            gridTemplateAreas: 
            `"top place"
             "top status"`,
            gap: "1vw",
            gridTemplateRows: "1fr 1fr",
            gridTemplateColumns: "1fr 1fr",
        })
        this.ui.add("@media screen and (max-width: 800px)", {
            "main .leadersBox": {
                gridTemplateAreas: 
                `"top"
                 "place"
                 "status"`,
                gap: "1vh",
                gridTemplateRows: "1fr",
                gridTemplateColumns: "1fr",
            }
        })
        this.box = document.createElement("div")
        this.box.classList.add("leadersBox")
        this.main.appendChild(this.box)
        
        this.initTop()
        this.initPlace()
        this.initStatus()
    }
    
    initTop() {
        this.ui.add(".top-box", {
            gridArea: "top",
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
            borderRadius: "12px",
            border: "1px solid white",
        })
        const topBox = document.createElement("div")
        topBox.classList.add("top-box")
        
        
        this.ui.add(".top-header", {
            
        }) 
        const topHeader = document.createElement("div")
        topHeader.classList.add("top-header")
        topBox.appendChild(topHeader)
        
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
            
            const dataSpan = document.createElement("span")
            dataSpan.classList.add("user-data")
            dataSpan.textContent = data.value
            userBox.appendChild(dataSpan)
            
            list.appendChild(userBox)
        }
        
        // якобы полаем данные из сервера
        
        
        this.box.appendChild(topBox)
    }
    
    initPlace() {
        this.ui.add(".place-box", {
            gridArea: "place",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            borderRadius: "12px",
            border: "1px solid white",
        })
        const placeBox = document.createElement("div")
        placeBox.classList.add("place-box")
        
        this.ui.add(".place-header", {
            
        })
        const placeHeader = document.createElement('div')
        placeBox.appendChild(placeHeader)
        placeHeader.classList.add("place-header")
        
        this.ui.add(".place-content", {
            
        })
        const placeContent = document.createElement('div')
        placeBox.appendChild(placeContent)
        placeContent.classList.add("place-content")
        
        this.box.appendChild(placeBox)
    }
    
    initStatus() {
        this.ui.add(".status-box", {
            gridArea: "status",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            borderRadius: "12px",
            border: "1px solid white",
        })
        const statusBox = document.createElement("div")
        statusBox.classList.add("status-box")
        
        this.ui.add(".status-header", {
            
        })
        const statusHeader = document.createElement('div')
        statusBox.appendChild(statusHeader)
        statusHeader.classList.add("status-header")
        
        this.ui.add(".status-content", {
            
        })
        const statusContent = document.createElement('div')
        statusBox.appendChild(statusContent)
        statusContent.classList.add("status-content")
        
        this.box.appendChild(statusBox)
    }

    exit() {
        this.main.innerHTML = ""
    }
}