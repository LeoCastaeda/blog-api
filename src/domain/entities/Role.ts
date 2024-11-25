export enum Role {
    Admin = 'admin',
    SimpleUser = 'simpleUser'
  }

  const rolePermissions = {
    [Role.Admin]: ['create', 'read', 'update', 'delete'],
    [Role.SimpleUser]: ['read'],
  };

