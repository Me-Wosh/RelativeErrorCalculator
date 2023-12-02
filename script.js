const std_dev = document.querySelector("#std_dev");
const n = document.querySelector("#n");
let std_dev_elements = 0;

n.addEventListener("input", generateInputs);

function generateInputs() {
    
    let n_value = parseInt(n.value);
    
    if (n_value === 0 || isNaN(n_value)) {

        for (let i = 0; i < std_dev_elements; i++) {

            std_dev.removeChild(std_dev.querySelector(`#std_dev_${i}`));
        }

        std_dev_elements = 0;

        return;
    }

    else if (n_value < std_dev_elements) {

        for (let i = std_dev_elements - 1; i >= n_value; i--) {
            
            std_dev.removeChild(std_dev.querySelector(`#std_dev_${i}`));

            std_dev_elements--;
        }

        return;
    }

    for (let i = 0; i < n_value; i++) {
        
        if (std_dev.querySelector(`#std_dev_${i}`) !== null) {
            continue;
        }

        var p = document.createElement("p");
        
        p.id = `std_dev_${i}`;
        p.innerHTML = "\\( x_{" + (i+1) + "}\\)" + ":";
        p.innerHTML += "<input />";
        
        std_dev.appendChild(p);

        std_dev_elements++;
    }

    MathJax.typeset();
}
