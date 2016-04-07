# autoassignrole
The Auto Assign Role module for DrupalGap.

Enable the `DrupalGap Auto Assign Role` module on your Drupal site. This module comes with the DrupalGap module.

Then enable this module in your `settings.js` file:

```

Drupal.modules.contrib['autoassignrole'] = {};

```

Do **NOT** set your DrupalGap `front` page to `user/register`, because this module will not have had time yet to retrieve the roles to use during registration.
