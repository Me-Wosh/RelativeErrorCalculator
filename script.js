const std_dev = document.querySelector("#std_dev");
const deviation = std_dev.querySelector("#deviation");
const std_dev_inputs = std_dev.querySelector("#std_dev_inputs");
const n_std_dev = std_dev_inputs.querySelector("#n_std_dev");
const n_rltv_err = document.querySelector("#n_rltv_err");
const rltv_err_inputs = document.querySelector("#rltv_err_inputs");
const calculate_deviation = std_dev.querySelector("#calculate_deviation");
const calculateError = document.querySelector("#calculate_rltv_err");

let std_dev_elements = 0;
let rltv_err_elements = 0;
var letter = "a";
let letterIndex = 0;

n_std_dev.addEventListener("input", generateStandardDeviationInputs);
n_rltv_err.addEventListener("input", generateRelativeErrorInputs);
calculate_deviation.addEventListener("click", calculateDeviation);
calculateError.addEventListener("click", calculateRelativeError);

function generateStandardDeviationInputs() {

    let n_value = parseInt(n_std_dev.value);
    
    // delete standard deviation inputs

    if (n_value === 0) {

        for (let i = 1; i <= std_dev_elements; i++) {

            std_dev_inputs.removeChild(std_dev_inputs.querySelector(`#std_dev_input_${i}`));
        }

        std_dev_elements = 0;
         
        return;
    }

    // delete inputs that exceed the selected number of inputs

    else if (n_value < std_dev_elements) {

        for (let i = std_dev_elements; i > n_value; i--) {
            
            std_dev_inputs.removeChild(std_dev_inputs.querySelector(`#std_dev_input_${i}`));

            std_dev_elements--;
        }

        return;
    }

    // generate standard deviation inputs

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
        input.tabIndex = 0;
        
        div.appendChild(label);
        div.appendChild(input);

        std_dev_inputs.appendChild(div);

        std_dev_elements++;
    }

    MathJax.typeset();
}

function generateRelativeErrorInputs() {

    let n_value = parseInt(n_rltv_err.value);
    
    // same as in the preceding function but for relative error

    if (n_value === 0) {

        for (let i = 1; i <= rltv_err_elements; i++) {

            rltv_err_inputs.removeChild(rltv_err_inputs.querySelector(`#rltv_err_input_${i}`));
        }

        rltv_err_elements = 0;
        letter = 'a';
        letterIndex = 0;
         
        return;
    }

    else if (n_value < rltv_err_elements) {

        for (let i = rltv_err_elements; i > n_value; i--) {
            
            rltv_err_inputs.removeChild(rltv_err_inputs.querySelector(`#rltv_err_input_${i}`));

            rltv_err_elements--;
            letter = getPreviousLetter();
        }

        return;
    }

    for (let i = 1; i <= n_value; i++) {
        
        if (rltv_err_inputs.querySelector(`#rltv_err_input_${i}`) !== null) {
            continue;
        }

        const div = document.createElement("div");
        const label = document.createElement("label");
        const equalSign = document.createElement("p");
        const fractionDiv = document.createElement("div");
        const deltaInput = document.createElement("input");
        const letterInput = document.createElement("input");
        const hr = document.createElement("hr");

        div.id = `rltv_err_input_${i}`;
    
        label.textContent = "\\( \\frac{\\Delta " + letter;
        label.htmlFor = "delta " + letter + "_" + letterIndex;

        letterIndex === 0 
            ? label.textContent += "}{" + letter + "} \\)"
            : label.textContent += "_{" + letterIndex + "}}{" + letter + "_{" + letterIndex + "}} \\)";

        equalSign.textContent = "=";

        deltaInput.id = "delta_" + letter + "_" + letterIndex;
        deltaInput.placeholder = letterIndex === 0 ? "Δ" + letter : "Δ" + letter + letterIndex;
        deltaInput.tabIndex = 0;

        letterInput.id = letter + "_" + letterIndex;
        letterInput.placeholder = letterIndex === 0 ? letter : letter + letterIndex;
        letterInput.tabIndex = 0;

        fractionDiv.className = "fraction_div";
        fractionDiv.appendChild(deltaInput);
        fractionDiv.appendChild(hr);
        fractionDiv.appendChild(letterInput);

        div.appendChild(label);
        div.appendChild(equalSign);
        div.appendChild(fractionDiv);

        rltv_err_inputs.appendChild(div);

        rltv_err_elements++;

        letter = getNextLetter();
    }

    MathJax.typeset();
}

function calculateDeviation() {

    const deviation_copy_buttons_container = std_dev.querySelector("#deviation_copy_buttons_container");
    
    if (deviation_copy_buttons_container !== null) {
        deviation_container.removeChild(deviation_copy_buttons_container);
    }

    const deviation_container = std_dev.querySelector("#deviation_container");
    const avg_x = std_dev_inputs.querySelector("#avg_x");
    const copyButtonsContainer = document.createElement("div");
    const copyResultButton = document.createElement("button");
    const copyLatexButton = document.createElement("button");
    let result = 0;
    let equation = "";
    
    // set standard deviation value back to default
    deviation.innerHTML = "\\(\\Delta x = \\sqrt{ \\displaystyle\\sum_{i=1}^{N}(\\bar x - x_i)^2 \\over N - 1}\\)";

    deviation.innerHTML += "\\( = \\sqrt{";
    
    for (let i = 1; i <= std_dev_elements; i++) {
        
        const x_n = std_dev_inputs.querySelector(`#x_${i}`);

        result += Math.pow(parseFloat(avg_x.value) - parseFloat(x_n.value), 2);

        // fill equation with (average number - actual number) to the power of 2

        deviation.innerHTML += i < std_dev_elements 
            ? "(" + avg_x.value + " - " + x_n.value + ")^2 + " 
            : "(" + avg_x.value + " - " + x_n.value + ")^2";
    }

    result /= std_dev_elements - 1;
    result = Math.sqrt(result);

    deviation.innerHTML += "\\over " + (std_dev_elements - 1) + "} = " + result + "\\)";
    
    // remove \( at the beggining and \) at the end of the equation (this is the way MathJax handles LaTeX equations)
    equation = deviation.innerHTML.replaceAll("\\(", "").replaceAll("\\)", "");

    copyResultButton.textContent = "Copy result";
    copyResultButton.title = "Copies result";
    copyResultButton.className = "copy_result_button";
    copyResultButton.addEventListener("click", () => copyToClipboard(result, copyResultButton));
    copyResultButton.addEventListener("mouseover", () => { copyResultButton.textContent = "Copy result"});

    copyLatexButton.textContent = "Copy equation";
    copyLatexButton.title = "Copies entire equation in LaTeX";
    copyLatexButton.className = "copy_latex_button";
    copyLatexButton.addEventListener("click", () => copyToClipboard(equation, copyLatexButton));
    copyLatexButton.addEventListener("mouseover", () => { copyLatexButton.textContent = "Copy equation"});
    
    copyButtonsContainer.id = "deviation_copy_buttons_container";
    copyButtonsContainer.appendChild(copyResultButton);
    copyButtonsContainer.appendChild(copyLatexButton);

    deviation_container.appendChild(copyButtonsContainer);

    MathJax.typeset();
}

function calculateRelativeError() {
    
    const rltv_err_copy_buttons_container = document.querySelector("#rltv_err_copy_buttons_container");

    if (rltv_err_copy_buttons_container !== null) {
        document.removeChild(rltv_err_copy_buttons_container);
    }

    const rltv_err_container = document.querySelector("#rltv_err_container");
    const relativeError = document.querySelector("#relative_error");
    const copyButtonsContainer = document.createElement("div");
    const copyResultButton = document.createElement("button");
    const copyLatexButton = document.createElement("button");

    const nValue = parseInt(n_rltv_err.value);
    letter = "a";
    letterIndex = 0;
    let result = 0;
    let values = [];
    let equation = "";

    relativeError.textContent = "\\( \\left | \\Delta x \\over x \\right | = \\sqrt{";

    // fill equation with ((delta a)/a), ((delta b)/b), ... fractions 

    for (let i = 1; i <= nValue; i++) {

        const inputDelta = document.querySelector("#delta_" + letter + "_" + letterIndex);
        const inputLetter = document.querySelector("#" + letter + "_" + letterIndex);

        values.push([parseFloat(inputDelta.value), parseFloat(inputLetter.value)]);

        result += Math.pow(parseFloat(inputDelta.value) / parseFloat(inputLetter.value), 2);

        relativeError.textContent += "\\left ( \\Delta " + letter + "\\over " + letter + "\\right )^2";

        if (i < nValue) {
            relativeError.textContent += "+";
        }

        letter = getNextLetter();
    }

    relativeError.textContent += "} = \\sqrt{";

    // fill equation same as before but with actual numbers

    for (let i = 0; i < values.length; i++) {
        
        relativeError.textContent += "\\left ( " + values[i][0] + "\\over " + values[i][1] + "\\right )^2";

        if (i < values.length - 1) {
            relativeError.textContent += "+";
        }
    };

    result = Math.sqrt(result);
    relativeError.textContent += "} = " + result + "\\)";

    // remove /( and /) from equation
    equation = relativeError.textContent.replaceAll("\\(", "").replaceAll("\\)", "");

    copyResultButton.textContent = "Copy result";
    copyResultButton.title = "Copies result";
    copyResultButton.className = "copy_result_button";
    copyResultButton.addEventListener("click", () => copyToClipboard(result, copyResultButton));
    copyResultButton.addEventListener("mouseover", () => { copyResultButton.textContent = "Copy result"});

    copyLatexButton.textContent = "Copy equation";
    copyLatexButton.title = "Copies entire equation in LaTeX";
    copyLatexButton.className = "copy_latex_button";
    copyLatexButton.addEventListener("click", () => copyToClipboard(equation, copyLatexButton));
    copyLatexButton.addEventListener("mouseover", () => { copyLatexButton.textContent = "Copy equation" });

    copyButtonsContainer.id = "rltv_err_copy_buttons_container";
    copyButtonsContainer.appendChild(copyResultButton);
    copyButtonsContainer.appendChild(copyLatexButton);

    rltv_err_container.appendChild(copyButtonsContainer);

    MathJax.typeset();
}

function getNextLetter() {

    if (letter === 'z') {
        letterIndex++;
        return 'a';
    }

    return String.fromCharCode(letter.charCodeAt(0) + 1);
}

function getPreviousLetter() {

    if (letter === 'a') {
        letterIndex--;
        return 'z';
    }

    return String.fromCharCode(letter.charCodeAt(0) - 1);
}

function copyToClipboard(text, element) {
    
    navigator.clipboard.writeText(text);

    const copyResultButtons = document.querySelectorAll(".copy_result_button");
    const copyLatexButtons = document.querySelectorAll(".copy_latex_button");

    copyResultButtons.forEach(el => {
        el.textContent = "Copy result";
    });

    copyLatexButtons.forEach(el => {
        el.textContent = "Copy equation";
    });

    element.textContent = "Copied";
}
