document.addEventListener("DOMContentLoaded", function () {
  // External library for advanced math expression parsing and evaluation
  const mathjs = window.math;

  // Function to evaluate expressions with variable substitution
  const evaluateExpression = (expression, variables) => {
    const preparedExpression = expression.replace(/{{(.*?)}}/g, (_, match) =>
      match.trim()
    );
    let parser = mathjs.parser();

    // Assign variables
    for (let [variable, value] of variables) {
      parser.set(variable, value);
    }

    // Evaluate the expression
    let result = parser.evaluate(preparedExpression);
    console.log(`Evaluated: ${preparedExpression} = ${result}`);
    return result;
  };

  const inputs = document.querySelectorAll("[j-calc-input]");
  const outputs = document.querySelectorAll("[j-calc-output]");

  let variableMap = new Map();

  inputs.forEach((input) => {
    const inputName = input.getAttribute("j-calc-input");

    if (variableMap.has(inputName)) {
      console.error(`Duplicate input name found: ${inputName}`);
      return;
    }

    let inputValue;
    if (input.getAttribute("type") === "checkbox") {
      inputValue = input.checked
        ? parseFloat(input.getAttribute("j-calc-checkbox-value")) || 0
        : parseFloat(input.getAttribute("j-calc-default-value")) || 0;
    } else {
      inputValue =
        parseFloat(input.value) ||
        parseFloat(input.getAttribute("j-calc-default-value")) ||
        0;
    }
    variableMap.set(inputName, inputValue);
  });

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const inputName = input.getAttribute("j-calc-input");
      let inputValue;
      if (input.getAttribute("type") === "checkbox") {
        inputValue = input.checked
          ? parseFloat(input.getAttribute("j-calc-checkbox-value")) || 0
          : parseFloat(input.getAttribute("j-calc-default-value")) || 0;
      } else {
        inputValue =
          parseFloat(input.value) ||
          parseFloat(input.getAttribute("j-calc-default-value")) ||
          0;
      }
      variableMap.set(inputName, inputValue);

      outputs.forEach((output) => {
        if (output.getAttribute("j-calc-on-submit")) {
          return; // Skip to the next iteration if the output is only updated on submit
        }
        const operation = output.getAttribute("j-calc-output");
        const result = evaluateExpression(operation, variableMap);

        const format = output.getAttribute("j-calc-format");
        if (format === "currency") {
          output.textContent = result.toFixed(2);
        } else {
          output.textContent = result;
        }
      });
    });
  });

  const submitButtons = document.querySelectorAll("[j-calc-submit-btn]");

  submitButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const linkName = button.getAttribute("j-calc-submit-btn");
      outputs.forEach((output) => {
        if (output.getAttribute("j-calc-on-submit") !== linkName) {
          return; // Skip to the next iteration if the output doesn't match the link name
        }
        const operation = output.getAttribute("j-calc-output");
        const result = evaluateExpression(operation, variableMap);

        const format = output.getAttribute("j-calc-format");
        if (format === "currency") {
          output.textContent = result.toFixed(2);
        } else {
          output.textContent = result;
        }
      });
    });
  });
});

