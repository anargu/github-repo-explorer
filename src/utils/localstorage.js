
export const saveKey = (key, value) => {
    // if (value instanceof Object) {
    //     window.localStorage.setItem(key, JSON.Stringify(value))     
    //     return
    // }
    window.localStorage.setItem(key, value)
}

export const getKey = (key) => {
    return window.localStorage.getItem(key)
}