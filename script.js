const std_dev = document.querySelector("#std_dev");
const deviation = std_dev.querySelector("#deviation");
const std_dev_inputs = std_dev.querySelector("#std_dev_inputs");
const n = std_dev_inputs.querySelector("#n");
const calculate_deviation = std_dev.querySelector("#calculate_deviation");

let std_dev_elements = 0;

n.addEventListener("input", generateInputs);
calculate_deviation.addEventListener("click", calculateDeviation);

function generateInputs() {
    
    let n_value = parseInt(n.value);
    
    if (n_value === 0) {

        for (let i = 1; i <= std_dev_elements; i++) {

            std_dev_inputs.removeChild(std_dev_inputs.querySelector(`#std_dev_input_${i}`));
        }

        std_dev_elements = 0;

        return;
    }

    else if (n_value < std_dev_elements) {

        for (let i = std_dev_elements; i > n_value; i--) {
            
            std_dev_inputs.removeChild(std_dev_inputs.querySelector(`#std_dev_input_${i}`));

            std_dev_elements--;
        }

        return;
    }

    for (let i = 1; i <= n_value; i++) {
        
        if (std_dev_inputs.querySelector(`#std_dev_input_${i}`) !== null) {
            continue;
        }

        const div = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");

        div.id = `std_dev_input_${i}`;
    
        label.textContent = "\\( x_{" + i + "}\\)" + ":";
        label.htmlFor = `x_${i}`;

        input.id = `x_${i}`;
        
        div.appendChild(label);
        div.appendChild(input);

        std_dev_inputs.appendChild(div);

        std_dev_elements++;
    }

    MathJax.typeset();
}

function calculateDeviation() {

    const avg_x = std_dev_inputs.querySelector("#avg_x");
    let result = 0;
    
    // set standard deviation value back to default
    deviation.innerHTML = "\\(\\Delta x = \\sqrt{ \\displaystyle\\sum_{i=1}^{N}(\\bar x - x_i)^2 \\over N - 1}\\)";
   
    deviation.innerHTML += "\\( = \\sqrt{";
    
    for (let i = 1; i <= std_dev_elements; i++) {
        
        const x_n = std_dev_inputs.querySelector(`#x_${i}`);

        result += Math.pow(parseFloat(avg_x.value) - parseFloat(x_n.value), 2);

        deviation.innerHTML += i < std_dev_elements 
            ? "(" + avg_x.value + " - " + x_n.value + ")^2 + " 
            : "(" + avg_x.value + " - " + x_n.value + ")^2";
    }

    result /= std_dev_elements - 1;
    result = Math.sqrt(result);

    deviation.innerHTML += "\\over " + (n.value - 1) + "} = " + result + "\\)";

    MathJax.typeset();
}
