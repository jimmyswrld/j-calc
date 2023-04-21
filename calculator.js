$(document).ready(function () {
  $('form[j-calc-element="form"]').each(function () {
    const form = $(this);
    const inputs = form.find('[j-calc-field]');
    const output = form.closest(':has([j-calc-output="result"])').find('[j-calc-output="result"]');
    const submitButton = form.find('[j-calc-action="submit"]');
    const format = form.attr('j-calc-format');

    const calculate = () => {
      let result = 0;
      inputs.each(function () {
        const input = $(this);
        const operation = input.attr('j-calc-field');
        const amount = parseFloat(input.attr('j-calc-amount') || 1);
        const inputType = input.attr('type');
        let inputValue;

        if (inputType === 'checkbox') {
          if (!input.is(':checked')) {
            return true; // Skip to the next iteration if the checkbox is not checked
          }
          inputValue = input.attr('j-calc-checkbox-value');
        } else if (inputType === 'radio') {
          if (!input.is(':checked')) {
            return true; // Skip to the next iteration if the radio button is not checked
          }
          inputValue = input.val();
        } else {
          inputValue = input.val();
          if (inputValue === '') {
            return true; // Skip to the next iteration if the input is empty
          }
        }

        const value = parseFloat(inputValue) * amount;

        switch (operation) {
          case 'add':
            result += value;
            break;
          case 'subtract':
            result -= value;
            break;
          case 'multiply':
            result *= value;
            break;
          case 'divide':
            result /= value;
            break;
          // ... Add more operations if needed
        }
      });

      // Apply the specified format
      if (format === 'currency') {
        output.text(result.toFixed(2));
      } else {
        output.text(result);
      }
    };

    if (submitButton.length) {
      submitButton.on('click', function (event) {
        event.preventDefault();
        calculate();
      });
    } else {
      inputs.on('input', calculate);
    }
  });
});
