let pass1 = document.querySelector(`#pass1`).value
let pass2 = document.querySelector(`#pass2`).value

document.querySelector(`#lab_submit`).addEventListener(`mousemove`, (event) => {
    if (pass1 != pass2) {
        event.target.style.color = `lightgrey`
    }    
})


document.querySelector(`#lab_submit`).addEventListener(`click`, (event) => {
    alert(`oi`)
    // if (pass1 != pass2) {
    //     event.target.style.color = `lightgrey`
    // }    
})
