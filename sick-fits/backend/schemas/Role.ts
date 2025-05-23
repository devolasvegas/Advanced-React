import { relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { permissionFields } from './fields';
import { permissions } from '../access';

export const Role = list({
  access: {
    create: permissions.canManageRoles,
    read: permissions.canManageRoles,
    update: permissions.canManageRoles,
    delete: permissions.canManageRoles,
  },
  ui: {
    hideCreate: (args) => !permissions.canManageRoles(args),
    hideDelete: (args) => !permissions.canManageRoles(args),
    isHidden: (args) => !permissions.canManageRoles(args),
  },
  fields: {
    name: text({ isRequired: true }),
    ...permissionFields,
    assignedTo: relationship({
      ref: 'User.role', // TODO: Add the correct relationship to User
      many: true,
      ui: {
        itemView: {
          fieldMode: 'read',
        },
      },
    }),
  },
});
