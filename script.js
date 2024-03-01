import {translations} from "./translations.js";

const language_container = document.querySelector("#language_container");
const language_icon = document.querySelector("#language_icon");
const language_selection = language_container.querySelector("#language_selection");
const languages = language_container.querySelectorAll("p");
const light_dark_toggle_container = document.querySelector("#light_dark_toggle_container");
const std_dev = document.querySelector("#std_dev");
const deviation = std_dev.querySelector("#deviation");
const std_dev_inputs = std_dev.querySelector("#std_dev_inputs");
const n_std_dev = std_dev_inputs.querySelector("#n_std_dev");
const avg_x = std_dev_inputs.querySelector("#avg_x");
const n_rltv_err = document.querySelector("#n_rltv_err");
const rltv_err_inputs = document.querySelector("#rltv_err_inputs");
const calculate_deviation = std_dev.querySelector("#calculate_deviation");
const calculate_rltv_err = document.querySelector("#calculate_rltv_err");

let languageSelectionVisible = false;
let language = "english"
let theme = "light";
let std_dev_elements = 0;
let rltv_err_elements = 0;
var letter = "a";
let letterIndex = 0;
let previous_input_values = {};

language_icon.addEventListener("click", showLanguagesList);

languages.forEach(l => {

    l.addEventListener("click", () => changeLanguage(l.textContent));
});

light_dark_toggle_container.addEventListener("click", changeTheme);

n_std_dev.addEventListener("input", () => {
    inputOnlyIntegerNumbers(n_std_dev);
    generateStandardDeviationInputs();
});

n_rltv_err.addEventListener("input", () => {
    inputOnlyIntegerNumbers(n_rltv_err);
    generateRelativeErrorInputs();
});

avg_x.addEventListener("input", () => inputOnlyNumbers(avg_x));
calculate_deviation.addEventListener("click", calculateDeviation);
calculate_rltv_err.addEventListener("click", calculateRelativeError);

function showLanguagesList() {

    if (languageSelectionVisible) {

        language_selection.style.visibility = "hidden";
        languageSelectionVisible = false;

    } else {

        language_selection.style.visibility = "visible";
        languageSelectionVisible = true;
    }
}

function changeLanguage(selectedLanguage) {

    language = selectedLanguage.toLowerCase();

    const standard_deviation_text = document.querySelector("#standard_deviation_text");
    const relative_error_text = document.querySelector("#relative_error_text");
    const copy_result_buttons = document.querySelectorAll(".copy_result_button");
    const copy_latex_buttons = document.querySelectorAll(".copy_latex_button");
    const inputs = document.querySelectorAll("input");

    language_selection.style.visibility = "hidden";
    languageSelectionVisible = false;

    standard_deviation_text.textContent = translations["standard deviation"][language];
    relative_error_text.textContent = translations["relative error"][language];
    calculate_deviation.textContent = translations["calculate button"][language];
    calculate_rltv_err.textContent = translations["calculate button"][language];

    copy_result_buttons.forEach(b => {
        b.textContent = translations["copy result button"][language];
        b.title = translations["copy result button hint"][language];
    });

    copy_latex_buttons.forEach(b => {
        b.textContent = translations["copy latex button"][language];
        b.title = translations["copy latex button hint"][language];
    });

    inputs.forEach(i => {
        
        if (i.placeholder === "") {
            return;
        }

        if (Object.values(translations["empty field error"]).includes(i.placeholder)) {
            i.placeholder = translations["empty field error"][language];   
        }
        
        else if (Object.values(translations["invalid number error"]).includes(i.placeholder)) {
            i.placeholder = translations["invalid number error"][language];
        }

        else {
            i.placeholder = translations["default error"][language];
        }
    });
}

function changeTheme() {
    
    const light_dark_toggle = light_dark_toggle_container.querySelector("#light_dark_toggle");
    const sun_icon = document.querySelector("#sun_icon");
    const moon_icon = document.querySelector("#moon_icon");

    if (theme === "light") {
        
        light_dark_toggle.animate(
            {
                transform: 'translateX(20px)'
            }, 
            {
                duration: 200,
                fill: 'forwards'
            });

        theme = "dark";

        document.body.className = "dark_body";

        language_icon.style.filter = "invert(0.7)";

        light_dark_toggle.style.backgroundColor = "rgb(32, 32, 32)";
        light_dark_toggle_container.style.backgroundColor = "rgb(190, 190, 190)";
        
        sun_icon.style.backgroundColor = "rgb(190, 190, 190)";
        sun_icon.querySelector("div").style.backgroundColor = "rgb(190, 190, 190)";

        moon_icon.style.backgroundColor = "rgb(190, 190, 190)";
        moon_icon.querySelector("div").style.backgroundColor = "rgb(32, 32, 32)";
    }

    else {
        
        light_dark_toggle.animate(
            {
                transform: 'translateX(0px)'
            }, 
            {
                duration: 200,
                fill: 'forwards'
            });

        theme = "light";

        document.body.className = "";
        
        language_icon.style.filter = "invert(0.1)";

        light_dark_toggle.style.backgroundColor = "white";
        light_dark_toggle_container.style.backgroundColor = "rgb(32, 32, 32)";

        sun_icon.style.backgroundColor = "rgb(32, 32, 32)";
        sun_icon.querySelector("div").style.backgroundColor = "rgb(32, 32, 32)";

        moon_icon.style.backgroundColor = "rgb(32, 32, 32)";
        moon_icon.querySelector("div").style.backgroundColor = "white";
    }
}

function generateStandardDeviationInputs() {

    let n_value = parseInt(n_std_dev.value);

    if (n_value > 100) {
        n_value = 100;
        n_std_dev.value = 100;
    }
    
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
            delete previous_input_values[`x_${i}`];
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
        previous_input_values[input.id] = '';
        input.addEventListener("input", () => inputOnlyNumbers(input));
        
        div.appendChild(label);
        div.appendChild(input);

        std_dev_inputs.appendChild(div);

        std_dev_elements++;
    }    

    MathJax.typeset();
}

function generateRelativeErrorInputs() {

    let n_value = parseInt(n_rltv_err.value);

    if (n_value > 104) {
        n_value = 104;
        n_rltv_err.value = 104;
    }
    
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
        previous_input_values[deltaInput.id] = '';
        deltaInput.addEventListener("input", () => inputOnlyNumbers(deltaInput));

        letterInput.id = letter + "_" + letterIndex;
        letterInput.placeholder = letterIndex === 0 ? letter : letter + letterIndex;
        letterInput.tabIndex = 0;
        previous_input_values[letterInput.id] = '';
        letterInput.addEventListener("input", () => inputOnlyNumbers(letterInput));

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

    let wasAnyInputInvalid = false;

    std_dev_inputs.querySelectorAll("input").forEach(element => {

        if (element.value === null || element.value.trim() === '') {
            element.placeholder = translations["empty field error"][language];
            element.className = "invalid_input";
            wasAnyInputInvalid = true;
        }

        else if (isNaN(element.value)) {
            element.placeholder = translations["invalid number error"][language];
            element.className = "invalid_input";
            wasAnyInputInvalid = true;
        }
    });

    if (wasAnyInputInvalid) {
        return;
    }

    const deviation_copy_buttons_container = std_dev.querySelector("#deviation_copy_buttons_container");
    const deviation_container = std_dev.querySelector("#deviation_container");

    if (deviation_copy_buttons_container !== null) {
        deviation_container.removeChild(deviation_copy_buttons_container);
    }
    
    const avg_x = std_dev_inputs.querySelector("#avg_x");
    const copyButtonsContainer = document.createElement("div");
    const copyResultButton = document.createElement("button");
    const copyLatexButton = document.createElement("button");
    let result = 0;
    let equation = "";
    
    // set standard deviation value back to default
    deviation.innerHTML = "\\(\\Delta x = \\sqrt{ \\displaystyle\\sum_{i=1}^{N}(\\bar x - x_i)^2 \\over N - 1} \\)";

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

    deviation.innerHTML += "\\over " + (std_dev_elements - 1) + "} \\)" + "\\( = " + result + "\\)";
    
    // remove \( at the beggining and \) at the end of the equation (this is the way MathJax
    // handles LaTeX equations but in regular LaTeX these symbols are unnecessary)
    equation = deviation.innerHTML.replaceAll("\\(", "").replaceAll("\\)", "");

    copyResultButton.textContent = translations["copy result button"][language];
    copyResultButton.title = translations["copy result button hint"][language];
    copyResultButton.className = "copy_result_button";
    copyResultButton.addEventListener("click", () => copyToClipboard(result, copyResultButton));
    copyResultButton.addEventListener("mouseover", () => { copyResultButton.textContent = translations["copy result button"][language] });

    copyLatexButton.textContent = translations["copy latex button"][language];
    copyLatexButton.title = translations["copy latex button hint"][language];
    copyLatexButton.className = "copy_latex_button";
    copyLatexButton.addEventListener("click", () => copyToClipboard(equation, copyLatexButton));
    copyLatexButton.addEventListener("mouseover", () => { copyLatexButton.textContent = translations["copy latex button"][language] });
    
    copyButtonsContainer.id = "deviation_copy_buttons_container";
    copyButtonsContainer.appendChild(copyResultButton);
    copyButtonsContainer.appendChild(copyLatexButton);

    deviation_container.appendChild(copyButtonsContainer);

    MathJax.typeset();
}

function calculateRelativeError() {
    
    let wasAnyInputInvalid = false;

    rltv_err_inputs.querySelectorAll("input").forEach(element => {
        
        if (element.value === null || element.value.trim() === '') {
            element.placeholder = translations["empty field error"][language];
            element.className = "invalid_input";
            wasAnyInputInvalid = true;
        }

        else if (isNaN(element.value)) {
            element.placeholder = translations["invalid number error"][language];
            element.className = "invalid_input";
            wasAnyInputInvalid = true;
        }
    });

    if (wasAnyInputInvalid) {
        return;
    }

    const rltv_err_copy_buttons_container = document.querySelector("#rltv_err_copy_buttons_container");
    const rltv_err_container = document.querySelector("#rltv_err_container");

    if (rltv_err_copy_buttons_container !== null) {
        rltv_err_container.removeChild(rltv_err_copy_buttons_container);
    }
    
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

    relativeError.textContent += "} \\)"
    relativeError.textContent += "\\( = \\sqrt{";

    // fill equation same as before but with actual numbers

    for (let i = 0; i < values.length; i++) {
        
        relativeError.textContent += "\\left ( " + values[i][0] + "\\over " + values[i][1] + "\\right )^2";

        if (i < values.length - 1) {
            relativeError.textContent += "+";
        }
    };

    result = Math.sqrt(result);
    relativeError.textContent += "} \\)" + "\\( = " + result + "\\)";

    // remove /( and /) from equation
    equation = relativeError.textContent.replaceAll("\\(", "").replaceAll("\\)", "");

    copyResultButton.textContent = translations["copy result button"][language];
    copyResultButton.title = translations["copy result button hint"][language];    
    copyResultButton.className = "copy_result_button";
    copyResultButton.addEventListener("click", () => copyToClipboard(result, copyResultButton));
    copyResultButton.addEventListener("mouseover", () => { copyResultButton.textContent = translations["copy result button"][language] });

    copyLatexButton.textContent = translations["copy latex button"][language];
    copyLatexButton.title = translations["copy latex button hint"][language];
    copyLatexButton.className = "copy_latex_button";
    copyLatexButton.addEventListener("click", () => copyToClipboard(equation, copyLatexButton));
    copyLatexButton.addEventListener("mouseover", () => { copyLatexButton.textContent = translations["copy latex button"][language] });

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

    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
        
    const copyResultButtons = document.querySelectorAll(".copy_result_button");
    const copyLatexButtons = document.querySelectorAll(".copy_latex_button");

    copyResultButtons.forEach(el => {
        el.textContent = translations["copy result button"][language];
    });

    copyLatexButtons.forEach(el => {
        el.textContent = translations["copy latex button"][language];
    });

    element.textContent = translations["copied message"][language];
}

function inputOnlyIntegerNumbers(inputElement) {

    // replace everything that is not a number
    inputElement.value = inputElement.value.replaceAll(/\D/g, "");
}

function inputOnlyNumbers(inputElement) {

    inputElement.value = inputElement.value.replaceAll(',', ".");

    // replace everything that is not a number period or comma
    inputElement.value = inputElement.value.replaceAll(/[^\d.]/g, "");

    if (isNaN(inputElement.value)) {
        inputElement.value = previous_input_values[inputElement.id];
    }

    previous_input_values[inputElement.id] = inputElement.value;
}