(function () {
  // Function to load an external script
  function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;

    script.onreadystatechange = callback;
    script.onload = callback;

    document.head.appendChild(script);
  }

  // Load math.js
  loadScript(
    "https://cdn.jsdelivr.net/npm/mathjs@11.9.1/lib/browser/math.min.js",
    function () {
      console.log("math.js is loaded!");
      // Initialize your calculator logic here after math.js has loaded
      // Your calculator code here
      const mathjs = window.math;

      function evaluateExpression(expression) {
        let inputNames = getExpressionVariables(expression);

        let parser = mathjs.parser();

        inputNames.forEach((inputName) => {
          const inputEl = document.querySelector(`input[name="${inputName}"]`);

          if (inputEl) {
            const inputValue = getInputValue(inputEl);
            // getInputValue(inputEl);

            parser.set(inputName, inputValue);
          }
        });

        let result = parser.evaluate(expression);

        return result;
      }

      function getExpressionVariables(expression) {
        let node = mathjs.parse(expression);
        // Filter for SymbolNodes, which represent variables
        let variables = node.filter((node) => node.isSymbolNode);

        // Extract the names of the variables and return
        return variables.map((variable) => variable.name);
      }

      function getInputValue(inputElement) {
        const inputType = inputElement.type;

        let inputValue;

        switch (inputType) {
          case "radio":
            let selectedRadioValue = document.querySelector(
              `input[name="${inputElement.name}"]:checked`
            ).value;

            inputValue = Number(selectedRadioValue) || 0;
            //console.log(inputValue)
            break;
          case "checkbox":
            inputValue = inputElement.checked
              ? Number(inputElement.getAttribute("j-calc-checkbox"))
              : 0;
            //console.log(inputValue)
            break;

          default:
            inputValue = inputElement.valueAsNumber || 0;

          //console.log(inputValue)
        }

        if (inputElement.getAttribute("j-calc-default") && !inputValue) {
          inputValue = Number(inputElement.getAttribute("j-calc-default"));
          //console.log(inputValue)
        }

        return inputValue;
      }

      const outputs = document.querySelectorAll("[j-calc-output]");

      const firstAtt = outputs[0].getAttribute("j-calc-on-submit");

      const allInputs = document.querySelectorAll("input");

      allInputs.forEach((input) => {
        input.addEventListener("input", () => {
          outputs.forEach((output) => {
            if (!output.getAttribute("j-calc-submit-output")) {
              updateOutput(output);
            }
          });
        });
      });

      const submitBtns = document.querySelectorAll("[j-calc-submit-btn]");

      //console.log(submitBtns);

      submitBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const linkValue = btn.getAttribute("j-calc-submit-btn");
          const linkedOutput = document.querySelectorAll(
            `[j-calc-submit-output="${linkValue}"]`
          );

          //console.log(linkedOutput);

          if (linkedOutput.length === 0) {
            console.log("No matching output!");
            return;
          }

          linkedOutput.forEach((output) => {
            updateOutput(output);
          });
        });
      });

      function updateOutput(output) {
        const decimalPlaces = output.getAttribute("j-calc-dp");

        const outputType = output.tagName;

        const roundTo = output.getAttribute("j-calc-round");

        let outputValue = evaluateExpression(
          output.getAttribute("j-calc-output")
        );

        if (roundTo) {
          outputValue = flexibleRound(outputValue, roundTo);
        }

        if (decimalPlaces) {
          outputValue = outputValue.toFixed(Number(decimalPlaces));
        }

        if (outputType === "INPUT") {
          output.value = outputValue;
        } else {
          output.innerText = outputValue;
        }
      }

      function roundToNearestX(num, x) {
        x = Number(x);
        return Math.round(num / x) * x;
      }

      function flexibleRound(num, unit) {
        // Determine if we're dealing with decimals or whole numbers
        if (unit >= 1) {
          // Rounding to nearest whole number unit (e.g., 10, 100)
          return Math.round(num / unit) * unit;
        } else {
          // Rounding to a decimal place (e.g., 0.1, 0.01)
          let decimalPlaces = Math.abs(Math.log10(unit));
          let scaleFactor = Math.pow(10, decimalPlaces);
          return Math.round(num * scaleFactor) / scaleFactor;
        }
      }
    }
  );
})();
