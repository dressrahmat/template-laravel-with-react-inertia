import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CrudLayout from '@/Components/CrudLayout';
import DataTable from '@/Components/DataTable';
import FilterSection from '@/Components/FilterSection';
import BulkActions from '@/Components/BulkActions';
import Pagination from '@/Components/Pagination';
import ConfirmationModal from '@/Components/ConfirmationModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { useToast } from '@/Contexts/ToastContext';
import { FiEye, FiEdit, FiTrash2, FiSearch, FiPlus, FiX, FiUserPlus, FiChevronUp, FiChevronDown, FiDownload, FiMoreVertical } from 'react-icons/fi';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { createPortal } from 'react-dom';

// Komponen Dropdown dengan Portal untuk merender di luar hierarchy tabel
const PortalDropdown = ({ trigger, children, position = 'bottom-right' }) => {
  const [positionData, setPositionData] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPositionData({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const getPositionClass = () => {
    switch (position) {
      case 'bottom-left':
        return 'origin-top-left left-0';
      case 'bottom-right':
        return 'origin-top-right right-0';
      default:
        return 'origin-top-right right-0';
    }
  };

  return (
    <>
      <div ref={triggerRef} onClick={() => {
        updatePosition();
        setIsOpen(true);
      }}>
        {trigger}
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)}>
          <div 
            className={`absolute mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none ${getPositionClass()}`}
            style={{
              top: positionData.top,
              left: position === 'bottom-right' ? 'auto' : positionData.left,
              right: position === 'bottom-right' ? window.innerWidth - positionData.left - positionData.width : 'auto',
              zIndex: 9999
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

// Komponen Dropdown Actions untuk setiap baris
const RowActionsDropdown = ({ user, onView, onEdit, onDelete }) => {
  const trigger = (
    <button className="inline-flex justify-center w-full p-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
      <FiMoreVertical className="h-4 w-4" aria-hidden="true" />
    </button>
  );

  return (
    <PortalDropdown trigger={trigger} position="bottom-right">
      <div className="py-1">
        <button
          onClick={onView}
          className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
        >
          <FiEye className="mr-3 h-4 w-4" aria-hidden="true" />
          View
        </button>
        <button
          onClick={onEdit}
          className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
        >
          <FiEdit className="mr-3 h-4 w-4" aria-hidden="true" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="group flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300"
        >
          <FiTrash2 className="mr-3 h-4 w-4" aria-hidden="true" />
          Delete
        </button>
      </div>
    </PortalDropdown>
  );
};

// Custom hook untuk menyimpan selected items di sessionStorage
const usePersistedSelectedUsers = (initialValue = []) => {
  const [selectedUsers, setSelectedUsers] = useState(() => {
    try {
      const stored = sessionStorage.getItem('selectedUsers');
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    sessionStorage.setItem('selectedUsers', JSON.stringify(selectedUsers));
  }, [selectedUsers]);

  const clearSelectedUsers = useCallback(() => {
    sessionStorage.removeItem('selectedUsers');
    setSelectedUsers([]);
  }, []);

  return [selectedUsers, setSelectedUsers, clearSelectedUsers];
};

export default function UsersIndex({ users, filters: initialFilters }) {
  const { props } = usePage();
  const flash = props.flash || {};
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
    userName: '',
  });
  const [bulkDeleteModal, setBulkDeleteModal] = useState({
    isOpen: false,
    count: 0,
  });
  
  // Gunakan custom hook untuk persisted selected users
  const [selectedUsers, setSelectedUsers, clearSelectedUsers] = usePersistedSelectedUsers([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialFilters?.search || '');
  const [perPage, setPerPage] = useState(initialFilters?.per_page || 5);
  const [sortConfig, setSortConfig] = useState({
    key: initialFilters?.sort || 'created_at',
    direction: initialFilters?.direction || 'desc',
  });
  const { success, error } = useToast();

  // Gunakan useRef untuk menyimpan nilai sebelumnya
  const prevFiltersRef = useRef({
    search: initialFilters?.search || '',
    per_page: initialFilters?.per_page || 5,
    sort: initialFilters?.sort || 'created_at',
    direction: initialFilters?.direction || 'desc'
  });

  // Debounced search implementation
  useEffect(() => {
    const currentFilters = {
      search: searchTerm,
      per_page: perPage,
      sort: sortConfig.key,
      direction: sortConfig.direction
    };

    // Bandingkan dengan nilai sebelumnya
    const hasChanged = 
      currentFilters.search !== prevFiltersRef.current.search ||
      currentFilters.per_page !== prevFiltersRef.current.per_page ||
      currentFilters.sort !== prevFiltersRef.current.sort ||
      currentFilters.direction !== prevFiltersRef.current.direction;

    if (hasChanged) {
      const timer = setTimeout(() => {
        router.get(route('admin.users.index'), 
          { 
            search: searchTerm, 
            sort: sortConfig.key, 
            direction: sortConfig.direction,
            per_page: perPage
          },
          { 
            preserveState: true, 
            replace: true,
            preserveScroll: true,
            onFinish: () => {
              // Update ref setelah request selesai
              prevFiltersRef.current = currentFilters;
              // JANGAN reset selectAll di sini, biarkan sync dengan selectedUsers
            }
          }
        );
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchTerm, perPage, sortConfig]);

  // Sync selectAll state dengan selected users di halaman saat ini
  useEffect(() => {
    if (users && users.data && selectedUsers.length > 0) {
      const currentPageIds = users.data.map(user => user.id);
      const allCurrentSelected = currentPageIds.every(id => selectedUsers.includes(id));
      const someCurrentSelected = currentPageIds.some(id => selectedUsers.includes(id));
      
      // Jika semua item di halaman ini terpilih, set selectAll ke true
      if (allCurrentSelected) {
        setSelectAll(true);
      } 
      // Jika beberapa item terpilih (tidak semua), set selectAll ke false
      else if (someCurrentSelected) {
        setSelectAll(false);
      }
      // Jika tidak ada yang terpilih di halaman ini, set selectAll ke false
      else {
        setSelectAll(false);
      }
    } else {
      setSelectAll(false);
    }
  }, [users, selectedUsers]);

  // Handle select/deselect all users
  const handleSelectAll = useCallback(() => {
    if (users && users.data) {
      const currentPageIds = users.data.map(user => user.id);
      
      if (!selectAll) {
        // Select all: tambahkan semua ID dari halaman saat ini
        setSelectedUsers(prev => {
          const newSelected = [...new Set([...prev, ...currentPageIds])];
          return newSelected;
        });
      } else {
        // Deselect all: hapus hanya ID yang ada di halaman saat ini
        setSelectedUsers(prev => prev.filter(id => !currentPageIds.includes(id)));
      }
    }
  }, [selectAll, users, setSelectedUsers]);

  // Handle individual user selection
  const handleUserSelection = useCallback((userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  }, [setSelectedUsers]);

  const openDeleteModal = useCallback((userId, userName) => {
    setDeleteModal({
      isOpen: true,
      userId,
      userName,
    });
  }, []);

  const openBulkDeleteModal = useCallback(() => {
    setBulkDeleteModal({
      isOpen: true,
      count: selectedUsers.length,
    });
  }, [selectedUsers.length]);

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({
      isOpen: false,
      userId: null,
      userName: '',
    });
  }, []);

  const closeBulkDeleteModal = useCallback(() => {
    setBulkDeleteModal({
      isOpen: false,
      count: 0,
    });
  }, []);

  const handleDelete = useCallback(() => {
    if (deleteModal.userId) {
      router.delete(route('admin.users.destroy', deleteModal.userId), {
        onSuccess: () => {
          success('User deleted successfully!');
          closeDeleteModal();
          // Hapus user yang dihapus dari selected users
          setSelectedUsers(prev => prev.filter(id => id !== deleteModal.userId));
        },
        onError: () => {
          error('Failed to delete user.');
          closeDeleteModal();
        }
      });
    } else {
      closeDeleteModal();
    }
  }, [deleteModal.userId, closeDeleteModal, success, error, setSelectedUsers]);

  const handleBulkDelete = useCallback(() => {
    if (selectedUsers.length > 0) {
      router.post(route('admin.users.bulk-destroy'), {
        ids: selectedUsers
      }, {
        onSuccess: () => {
          success(`${selectedUsers.length} user(s) deleted successfully!`);
          clearSelectedUsers(); // Clear selected users setelah delete
          setSelectAll(false);
          closeBulkDeleteModal();
        },
        onError: () => {
          error('Failed to delete selected users.');
          closeBulkDeleteModal();
        }
      });
    }
  }, [selectedUsers, closeBulkDeleteModal, success, error, clearSelectedUsers]);

  const handleExport = useCallback(() => {
    if (selectedUsers.length > 0) {
      router.post(route('admin.users.export'), {
        ids: selectedUsers
      }, {
        onSuccess: () => {
          success('Export initiated successfully!');
        },
        onError: () => {
          error('Failed to export users.');
        }
      });
    }
  }, [selectedUsers, success, error]);

  const handleSort = useCallback((key) => {
    setSortConfig(prev => {
      let direction = 'asc';
      if (prev.key === key && prev.direction === 'asc') {
        direction = 'desc';
      }
      return { key, direction };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setPerPage(5);
    setSortConfig({ key: 'created_at', direction: 'desc' });
    router.get(route('admin.users.index'), {}, { 
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        prevFiltersRef.current = {
          search: '',
          per_page: 5,
          sort: 'created_at',
          direction: 'desc'
        };
      }
    });
  }, []);

  const handlePerPageChange = useCallback((newPerPage) => {
    setPerPage(newPerPage);
  }, []);

  // Fungsi untuk mendapatkan ikon sort yang sesuai
  const getSortIcon = useCallback((key) => {
    if (sortConfig.key !== key) {
      return <FiChevronUp className="ml-1 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' 
      ? <FiChevronUp className="ml-1 h-4 w-4" /> 
      : <FiChevronDown className="ml-1 h-4 w-4" />;
  }, [sortConfig]);

  // Kolom untuk DataTable
  const columns = useMemo(() => [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      onSort: () => handleSort('name'),
      sortIcon: getSortIcon('name'),
      render: (user) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <span className="font-medium text-indigo-800 dark:text-indigo-100">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user.name}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      onSort: () => handleSort('email'),
      sortIcon: getSortIcon('email'),
      render: (user) => (
        <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
      )
    },
    {
      key: 'created_at',
      label: 'Joined Date',
      sortable: true,
      onSort: () => handleSort('created_at'),
      sortIcon: getSortIcon('created_at'),
      render: (user) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      )
    }
  ], [handleSort, getSortIcon]);

  // Empty state component
  const emptyState = useMemo(() => (
    <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
      <FiUserPlus className="h-12 w-12 mb-3 opacity-50" />
      <p className="text-lg font-medium">No users found</p>
      <p className="mt-1 text-sm">Get started by creating a new user</p>
      <div className="mt-6">
        <Link href={route('admin.users.create')}>
          <PrimaryButton className="flex items-center">
            <FiPlus className="mr-2 h-5 w-5" />
            Add New User
          </PrimaryButton>
        </Link>
      </div>
    </div>
  ), []);

  // Row actions dengan dropdown
  const rowActions = useCallback((user) => (
    <RowActionsDropdown
      user={user}
      onView={() => router.visit(route('admin.users.show', user.id))}
      onEdit={() => router.visit(route('admin.users.edit', user.id))}
      onDelete={() => openDeleteModal(user.id, user.name)}
    />
  ), [openDeleteModal]);

  // Create button
  const createButton = useMemo(() => (
    <Link href={route('admin.users.create')}>
      <PrimaryButton className="flex items-center">
        <FiUserPlus className="mr-2 h-5 w-5" />
        Add User
      </PrimaryButton>
    </Link>
  ), []);

  return (
    <AdminLayout title="Manage Users">
      <Head title="Manage Users" />

      {/* Confirmation Modal for single delete */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete user "${deleteModal.userName}"? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
      />

      {/* Confirmation Modal for bulk delete */}
      <ConfirmationModal
        isOpen={bulkDeleteModal.isOpen}
        onClose={closeBulkDeleteModal}
        onConfirm={handleBulkDelete}
        title="Confirm Bulk Delete"
        message={`Are you sure you want to delete ${bulkDeleteModal.count} selected user(s)? This action cannot be undone.`}
        confirmText={`Delete ${bulkDeleteModal.count} Users`}
        cancelText="Cancel"
      />

      <CrudLayout
        title="User Management"
        description="Manage all system users, their roles and permissions"
        createButton={createButton}
        filters={
          <div className="mb-6">
            <FilterSection
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              perPage={perPage}
              onPerPageChange={handlePerPageChange}
              onClearFilters={clearFilters}
            />
          </div>
        }
      >
        {/* Flash Messages */}
        {flash.success && (
          <div className="mb-8 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {flash.success}
                </p>
              </div>
            </div>
          </div>
        )}

        {flash.error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {flash.error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mb-6">
            <BulkActions
              selectedCount={selectedUsers.length}
              onBulkDelete={openBulkDeleteModal}
              onBulkExport={handleExport}
              onClearSelection={() => {
                clearSelectedUsers();
                setSelectAll(false);
              }}
            />
          </div>
        )}

        {/* Data Table */}
        <div className="mb-6">
          <DataTable
            columns={columns}
            data={users?.data || []}
            selectedItems={selectedUsers}
            onSelectItem={handleUserSelection}
            onSelectAll={handleSelectAll} // Gunakan handleSelectAll yang baru
            selectAll={selectAll}
            emptyState={emptyState}
            rowActions={rowActions}
            keyField="id"
          />
        </div>

        {/* Pagination - Pastikan users memiliki data */}
        {users && users.data && users.data.length > 0 && users.links && users.links.length > 3 && (
          <Pagination data={users} />
        )}
      </CrudLayout>
    </AdminLayout>
  );
}