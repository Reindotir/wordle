import { store } from "../libs/PageX"

export default class LeadersPage {
    main: HTMLElement = document.querySelector("main") as HTMLElement
    router: Record<string, any>
    ui: Record<string, any> = store.st.ui
    box!: HTMLElement 

    constructor(router: Record<string, any>) {
        this.router = router
        store.st.header.focus(0)
        document.title = "Wordle " + store.st.lang.leadersPageBtn
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
            gridTemplateRows: "45vh 45vh",
            gridTemplateColumns: "45vw 45vw",
        })
        this.ui.add("@media screen and (max-width: 800px)", {
            "main .leadersBox": {
                gridTemplateAreas: 
                `"top"
                 "place"
                 "status"`,
                gap: "1vh",
                gridTemplateRows: "auto",
                gridTemplateColumns: "85vw",
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
            flexDirection: "column",
            padding: "5px",
            backgroundColor: "rgba(var(--bg-nd), 0.8)",
        })
        const topBox = document.createElement("div")
        topBox.classList.add("top-box")
        
        
        this.ui.add(".top-header", {
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
            fontSize: "120%",
            fontWeight: "bold",
        }) 
        const topHeader = document.createElement("div")
        topHeader.classList.add("top-header")
        topHeader.textContent = store.st.lang.topList.header
        topBox.appendChild(topHeader)
        
        this.ui.add('.top-list', {
            backgroundColor: "rgba(var(--bg-st), 0.7)",
            width: "100%",
            maxHeight: "85vh",
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            borderRadius: "8px",
            gap: "2vh",
            padding: "5px",
        })
        const list = document.createElement("div")
        topBox.appendChild(list)
        list.classList.add("top-list")
        
        this.ui.add(".user-box", {
            width: "100%",
            height: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "5px",
            backgroundColor: "rgba(var(--bg-nd), 0.5)",
            borderRadius: "5px",
            
        })
        this.ui.add(".user-name", {
            fontSize: "115%",
            textDecoration: "underline",
            cursor: "pointer",
        }) 
        this.ui.add('.user-data', {
            fontSize: "120%",
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
        
        // якобы получаем данные из сервера
        const users = [
            {
                name: "user1",
                value: "1.24"
            },
            {

                name: "user2",
                value: "1.50"
            },
            {
                name: "user3",
                value: "2.33"
            },
            {
                name: "user4",
                value: "2.54"
            },
            {
                name: "user5",
                value: "3"
            },
        ]
        
        users.forEach((user) => {
            newUser(user)
        })
        
        this.box.appendChild(topBox)
    }
    
    initPlace() {
        this.ui.add(".place-box", {
            gridArea: "place",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: "5px",
            borderRadius: "12px",
            backgroundColor: "rgba(var(--bg-nd), 0.8)"
        })
        const placeBox = document.createElement("div")
        placeBox.classList.add("place-box")
        
        this.ui.add(".place-header", {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
            fontSize: "120%",
            fontWeight: "bold",
            width: "100%",
            height: "auto",
        })
        const placeHeader = document.createElement('div')
        placeHeader.classList.add("place-header")
        placeHeader.textContent = store.st.lang.leaders.placeHeader
        
        this.ui.add(".place-content", {
            width: "100%",
            height: "100%",
            display: "flex",
            borderRadius: "8px",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(var(--bg-st), 0.7)",
            
            "span": {
                fontSize: "200%",
                fontWeight: "bolder",
            }
        })
        const placeContent = document.createElement('div')
        placeContent.innerHTML = `<span>${store.st.lang.leaders.place}: 5758438</span>`
        placeContent.classList.add("place-content")
        
        placeBox.appendChild(placeHeader)
        placeBox.appendChild(placeContent)
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
            flexDirection: "column",
            backgroundColor: "rgba(var(--bg-nd), 0.8)",
            padding: "5px",
        })
        const statusBox = document.createElement("div")
        statusBox.classList.add("status-box")
        
        this.ui.add(".status-header", {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
            fontSize: "120%",
            fontWeight: "bold",
            width: "100%",
            height: "auto",
        })
        
        // полчучаем из сервера данные
        let type = 0
        let path = "../cats/beginner.jpg"
        const statusHeader = document.createElement('div')
        statusBox.appendChild(statusHeader)
        statusHeader.textContent = `${store.st.lang.status.header}: ${store.st.lang.status.type[type]}`
        statusHeader.classList.add("status-header")
        
        this.ui.add(".status-content", {
            width: "100%",
            height: "100%",
            display: "flex",
            borderRadius: "8px",
            alignItems: "center",
            padding: "5px",
            justifyContent: "center",
            backgroundColor: "rgba(var(--bg-st), 0.7)",
            
            "img": {
                width: "50%",
                maxWidth: "250px",
                maxHeight: "250px",
                borderRadius: "8px",
                aspectRatio: "1 / 1",
            }
        })
        const statusContent = document.createElement('div')
        statusBox.appendChild(statusContent)
        statusContent.classList.add("status-content")
        
        const img = document.createElement("img")
        img.src = path
        statusContent.appendChild(img)
        
        this.box.appendChild(statusBox)
    }

    exit() {
        this.main.innerHTML = ""
    }
}