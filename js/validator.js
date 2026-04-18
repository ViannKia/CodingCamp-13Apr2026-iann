// js/validator.js — Form validation logic (vanilla JS, global scope)

var Validator = (function () {
  /**
   * Validates the expense form data.
   * @param {{ name: string, amount: string, category: string }} formData
   * @returns {{ valid: boolean, errors: { name?: string, amount?: string, category?: string } }}
   */
  function validateForm(formData) {
    var errors = {};

    // Validate name
    if (!formData.name || String(formData.name).trim() === '') {
      errors.name = 'Item name is required';
    }

    // Validate amount
    if (formData.amount === '' || formData.amount === null || formData.amount === undefined) {
      errors.amount = 'Amount is required';
    } else {
      var num = Number(formData.amount);
      if (isNaN(num)) {
        errors.amount = 'Amount must be a valid number';
      } else if (num <= 0) {
        errors.amount = 'Amount must be greater than zero';
      }
    }

    // Validate category
    if (!formData.category || String(formData.category).trim() === '') {
      errors.category = 'Please select a category';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors: errors
    };
  }

  return { validateForm: validateForm };
})();
