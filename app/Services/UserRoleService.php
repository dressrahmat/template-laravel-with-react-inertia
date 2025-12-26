<?php

namespace App\Services;

use App\Models\User;
use App\Observers\UserObserver;

class UserRoleService
{
    protected $observer;

    public function __construct()
    {
        $this->observer = new UserObserver();
    }

    /**
     * Sync roles with audit logging
     */
    public function syncRoles(User $user, array $roles): User
    {
        $oldRoles = $user->getRoleNames()->toArray();
        
        $user->syncRoles($roles);
        
        $newRoles = $user->getRoleNames()->toArray();

        // Trigger observer event
        $this->observer->rolesUpdated($user, $oldRoles, $newRoles);

        return $user;
    }

    /**
     * Assign role with audit logging
     */
    public function assignRole(User $user, $role): User
    {
        $oldRoles = $user->getRoleNames()->toArray();
        
        $user->assignRole($role);
        
        $newRoles = $user->getRoleNames()->toArray();

        $this->observer->rolesUpdated($user, $oldRoles, $newRoles);

        return $user;
    }

    /**
     * Remove role with audit logging
     */
    public function removeRole(User $user, $role): User
    {
        $oldRoles = $user->getRoleNames()->toArray();
        
        $user->removeRole($role);
        
        $newRoles = $user->getRoleNames()->toArray();

        $this->observer->rolesUpdated($user, $oldRoles, $newRoles);

        return $user;
    }

    /**
     * Sync permissions with audit logging
     */
    public function syncPermissions(User $user, array $permissions): User
    {
        $oldPermissions = $user->getPermissionNames()->toArray();
        
        $user->syncPermissions($permissions);
        
        $newPermissions = $user->getPermissionNames()->toArray();

        $this->observer->permissionsUpdated($user, $oldPermissions, $newPermissions);

        return $user;
    }

    /**
     * Give permission with audit logging
     */
    public function givePermissionTo(User $user, $permission): User
    {
        $oldPermissions = $user->getPermissionNames()->toArray();
        
        $user->givePermissionTo($permission);
        
        $newPermissions = $user->getPermissionNames()->toArray();

        $this->observer->permissionsUpdated($user, $oldPermissions, $newPermissions);

        return $user;
    }

    /**
     * Revoke permission with audit logging
     */
    public function revokePermissionTo(User $user, $permission): User
    {
        $oldPermissions = $user->getPermissionNames()->toArray();
        
        $user->revokePermissionTo($permission);
        
        $newPermissions = $user->getPermissionNames()->toArray();

        $this->observer->permissionsUpdated($user, $oldPermissions, $newPermissions);

        return $user;
    }
}