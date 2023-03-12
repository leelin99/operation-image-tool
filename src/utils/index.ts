export function onLoadImage(callback:(res:string | ArrayBuffer)=>void) {
    const inputEl = document.createElement("input")
    inputEl.style.position = 'absolute'
    inputEl.style.top = '-9999px'
    // document.body.appendChild(inputEl)
    inputEl.type = "file"
    inputEl.accept="image/jpeg, image/png, image/jpg"
    inputEl.click()
    inputEl.oninput = (event:Event) => {
        event.preventDefault()
        const fileReader = new FileReader()
        fileReader.readAsDataURL((event.target as any).files[0] as any)
        fileReader.onload = function(){
            callback(this.result)
        }
    }
}

export function longClick(target:HTMLElement, callback:(ev:TouchEvent) => void) {
    target.ontouchstart = (ev:TouchEvent) => {
        const timer = setTimeout(() => {
            callback(ev)
        },500)
        target.ontouchmove = () => {
            clearTimeout(timer)
        }
        target.ontouchend = () => {
            clearTimeout(timer)
        }
    }
}
