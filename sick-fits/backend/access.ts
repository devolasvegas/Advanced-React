// At it's simplest, access control is just a function that takes a session and returns true or false.

import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session;
}

interface GeneratedPermissions {
  [key: string]: ({ session }: ListAccessArgs) => boolean;
}

const generatedPermissions: GeneratedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permissions check if a role exists on a certain user
export const permissions = {
  ...generatedPermissions,
};

// Rule-based function
// Rules can return a boolean or a filter which limits which products a user can CRUD
export const rules = {
  canManageProducts: ({
    session,
  }: ListAccessArgs): boolean | { user: { id: string } } => {
    // Return access denied instead of throwing an error
    if (!isSignedIn({ session })) {
      return false;
    }

    // 1. Do they have the canManageProducts permission?
    if (permissions.canManageProducts({ session })) {
      return true;
    }

    // 2. If not, do they own the product?
    // This is a graphQL 'where' filter
    return { user: { id: session.itemId } };
  },
  canOrder: ({
    session,
  }: ListAccessArgs): boolean | { user: { id: string } } => {
    // Return access denied instead of throwing an error
    if (!isSignedIn({ session })) {
      return false;
    }

    // 1. Do they have the canManageProducts permission?
    if (permissions.canManageCart({ session })) {
      return true;
    }

    // 2. If not, do they own the product?
    // This is a graphQL 'where' filter
    return { user: { id: session.itemId } };
  },
  canManageOrderItems: ({
    session,
  }: ListAccessArgs): boolean | { order: { user: { id: string } } } => {
    // Return access denied instead of throwing an error
    if (!isSignedIn({ session })) {
      return false;
    }

    // 1. Do they have the canManageProducts permission?
    if (permissions.canManageCart({ session })) {
      return true;
    }

    // 2. If not, do they own the product?
    // This is a graphQL 'where' filter
    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts: ({
    session,
  }: ListAccessArgs): boolean | { status: string } => {
    // Return access denied instead of throwing an error
    if (!isSignedIn({ session })) {
      return false;
    }

    // canManageProducts have access to everything
    if (permissions.canManageProducts({ session })) {
      return true;
    }

    // 2. If not, do they own the product?
    // This is a graphQL 'where' filter
    return { status: 'AVAILABLE' };
  },
  canManageUsers: ({ session }: ListAccessArgs): boolean | { id: string } => {
    // Return access denied instead of throwing an error
    if (!isSignedIn({ session })) {
      return false;
    }

    // 1. Do they have the canManageProducts permission?
    if (permissions.canManageUsers({ session })) {
      return true;
    }

    // 2. If not, do they own the product?
    // This is a graphQL 'where' filter
    return { id: session.itemId };
  },
};
