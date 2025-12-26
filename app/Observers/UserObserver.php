<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    /**
     * Handle events after all transactions are committed.
     *
     * @var bool
     */
    public $afterCommit = true;

    /**
     * Handle the User "roles updated" event.
     */
    public function rolesUpdated(User $user, array $oldRoles, array $newRoles): void
    {
        $addedRoles = array_diff($newRoles, $oldRoles);
        $removedRoles = array_diff($oldRoles, $newRoles);

        $changes = [
            'added_roles' => $addedRoles,
            'removed_roles' => $removedRoles,
        ];

        $user->logRolePermissionChange(
            'roles_updated',
            $newRoles,
            [],
            "Updated roles for user {$user->name}. Added: " . implode(', ', $addedRoles) . ". Removed: " . implode(', ', $removedRoles)
        );
    }

    /**
     * Handle the User "permissions updated" event.
     */
    public function permissionsUpdated(User $user, array $oldPermissions, array $newPermissions): void
    {
        $addedPermissions = array_diff($newPermissions, $oldPermissions);
        $removedPermissions = array_diff($oldPermissions, $newPermissions);

        $changes = [
            'added_permissions' => $addedPermissions,
            'removed_permissions' => $removedPermissions,
        ];

        $user->logRolePermissionChange(
            'permissions_updated',
            [],
            $newPermissions,
            "Updated permissions for user {$user->name}. Added: " . implode(', ', $addedPermissions) . ". Removed: " . implode(', ', $removedPermissions)
        );
    }
}