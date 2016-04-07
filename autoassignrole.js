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
 * Implements hook_form_alter().
 */
function autoassignrole_form_alter(form, form_state, form_id) {
  if (form_id == 'user_register_form') {
    form.elements['user_roles'] = {
      type: 'checkboxes',
      title: 'Select Your Role(s)',
      options: {}
    };
    $.each(drupalgap.autoassignrole.autoassignrole_user_roles, function(rid, value) {
      if (!value) { return; }
      form.elements.user_roles.options[rid] = value;
    });
  }
}

