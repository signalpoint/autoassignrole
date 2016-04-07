/**
 * Given a autoassignrole variable name from Drupal (excluding the "autoassignrole_" prefix), this will return that
 * variable's value or null if it doesn't exist.
 * @param key
 * @returns {null}
 */
function autoassignrole_config(key) {
  return typeof drupalgap.site_settings['autoassignrole_' + key] !== 'undefined' ?
      drupalgap.site_settings['autoassignrole_' + key] : null;
}

/**
 * Implements hook_services_success().
 */
function autoassignrole_services_postprocess(options, data) {
  try {
    // Extract the flag settings from the system connect result data.
    if (options.service == 'system' && options.resource == 'connect') {
      if (data.autoassignrole) { drupalgap.autoassignrole = data.autoassignrole; }
      else { console.log('autoassignrole_services_postprocess - failed to extract settings from system connect.'); }
    }
  }
  catch (error) { console.log('autoassignrole_services_postprocess - ' + error); }
}

/**
 * Preprocess a service call.
 * @param {Object} options
 */
function autoassignrole_services_preprocess(options) {
  try {
    // Remove any 0 values from the user_roles data during user registration.
    if (options.service == 'user' && options.resource == 'register') {
      var data = JSON.parse(options.data);
      if (data.user_roles) {
        var user_roles = {};
        for (var rid in data.user_roles) {
          if (data.user_roles[rid]) {
            user_roles[rid] = rid;
          }
        }
        data.user_roles = user_roles;
        options.data = JSON.stringify(data);
      }
    }
  }
  catch (error) { console.log('autoassignrole_services_preprocess - ' + error); }
}

/**
 * Implements hook_form_alter().
 */
function autoassignrole_form_alter(form, form_state, form_id) {

  // Add the user roles input to the user registration form.
  if (form_id == 'user_register_form') {

    // Try to determine an appropriate weight for the element.
    var weight = 0;
    if (form.elements.submit) {
      if (typeof form.elements.submit.weight === 'undefined') { form.elements.submit.weight = 999; }
      weight = form.elements.submit.weight - 1;
    }

    // Build the element and attach to the form.
    var name = 'user_roles';
    var input = {
      type: autoassignrole_config('user_multiple') == "1" ? 'checkboxes' : 'select',
      title: autoassignrole_config('user_title'),
      description: autoassignrole_config('user_description').value,
      required: autoassignrole_config('user_required') == "1",
      options: {},
      weight: weight
    };
    $.each(drupalgap.autoassignrole.autoassignrole_user_roles, function(rid, value) {
      if (!value) { return; }
      input.options[rid] = value;
    });
    form.elements[name] = input;

  }

}
