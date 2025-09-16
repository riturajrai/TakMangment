'use client';

import { useAuth } from '../useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar, X, CheckCircle, AlertCircle, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Form validation schema
const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters').max(255, 'Project name must be less than 255 characters'),
  description: z.string().optional(),
  status: z.enum(['active', 'completed']).default('active'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'),
});

const filterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['all', 'active', 'completed']).default('all'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format').optional().or(z.literal('')),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format').optional().or(z.literal('')),
}).refine((data) => !data.startDate || !data.endDate || new Date(data.startDate) <= new Date(data.endDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Custom hook for API calls
const useApi = () => {
  const apiCall = useCallback(async (config) => {
    try {
      const response = await axios({
        ...config,
        withCredentials: true,
        timeout: 10000,
      });
      return { data: response.data, error: null };
    } catch (error) {
      console.error('API Error:', error);
      return { 
        data: null, 
        error: error.response?.data?.error || error.message || 'An unexpected error occurred' 
      };
    }
  }, []);

  return { apiCall };
};

// Custom hook for projects data
const useProjects = (filters, isAuthenticated) => {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();

  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        startDate: filters.startDate || '',
        endDate: filters.endDate || '',
      }).toString();
      
      const [projectsResponse, statsResponse] = await Promise.all([
        apiCall({ url: `${API_URL}/projects/get-projects?${params}` }),
        apiCall({ url: `${API_URL}/projects/statistics` }),
      ]);

      if (projectsResponse.error) throw new Error(projectsResponse.error);
      if (statsResponse.error) throw new Error(statsResponse.error);

      setProjects(projectsResponse.data.projects);
      setTotal(projectsResponse.data.total);
      setStatistics(statsResponse.data.statistics);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error(error.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [filters, isAuthenticated, apiCall]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, total, statistics, loading, refetch: fetchProjects };
};

export default function Projects() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'created_at',
    order: 'DESC',
    page: 1,
    limit: 10,
  });
  const [filterErrors, setFilterErrors] = useState({});

  const { projects, total, statistics, loading: projectsLoading, refetch } = useProjects(filters, isAuthenticated);
  const { apiCall } = useApi();

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch, control } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: '', description: '', status: 'active', dueDate: '' },
  });

  const dueDate = watch('dueDate');

  // Memoized statistics display
  const statsDisplay = useMemo(() => (
    statistics.map((stat) => (
      <div
        key={stat.status}
        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 transition-transform duration-200 hover:scale-105"
      >
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">{stat.status}</p>
        <p className="text-lg sm:text-xl font-bold text-black dark:text-white">{stat.count} Projects</p>
        {stat.overdue > 0 && (
          <p className="text-sm text-red-500 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" /> {stat.overdue} Overdue
          </p>
        )}
      </div>
    ))
  ), [statistics]);

  // Create/Update Project
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const url = editingProject
        ? `${API_URL}/projects/update-project/${editingProject.id}`
        : `${API_URL}/projects/create-project`;
      const method = editingProject ? 'put' : 'post';
      
      const { error } = await apiCall({
        method,
        url,
        data,
      });
      
      if (error) throw new Error(error);
      
      toast.success(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
      reset();
      setIsModalOpen(false);
      setEditingProject(null);
      refetch();
    } catch (error) {
      console.error(`Error ${editingProject ? 'updating' : 'creating'} project:`, error);
      toast.error(error.message || `Failed to ${editingProject ? 'update' : 'create'} project`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Project
  const deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      setIsSubmitting(true);
      const { error } = await apiCall({
        method: 'delete',
        url: `${API_URL}/projects/delete-project/${id}`,
      });
      
      if (error) throw new Error(error);
      
      toast.success('Project deleted successfully!');
      refetch();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error.message || 'Failed to delete project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit
  const handleEdit = (project) => {
    setEditingProject(project);
    setValue('name', project.name);
    setValue('description', project.description || '');
    setValue('status', project.status);
    setValue('dueDate', project.due_date.split('T')[0]);
    setIsModalOpen(true);
  };

  // Handle Filter/Sort Change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    const { error } = filterSchema.validate(newFilters);
    setFilterErrors(error ? error.details.reduce((acc, err) => ({ ...acc, [err.path[0]]: err.message }), {}) : {});
  };

  // Clear Filters
  const clearFilters = () => {
    const defaultFilters = {
      search: '',
      status: 'all',
      startDate: '',
      endDate: '',
      sortBy: 'created_at',
      order: 'DESC',
      page: 1,
      limit: 10,
    };
    setFilters(defaultFilters);
    setFilterErrors({});
  };

  // Close modal handler
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    reset();
  };

  // Loading state
  if (authLoading || projectsLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <Skeleton className="h-12 w-1/3 mb-6 rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen mt-25 bg-white dark:bg-gray-800 p-4 sm:p-6 max-w-7xl mx-auto">
        <Toaster position="top-right" />
        
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tight">
            My Projects ({total})
          </h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center"
            aria-label="Create new project"
            disabled={isSubmitting}
          >
            <Plus className="w-4 h-4 mr-2" /> Create New Project
          </Button>
        </header>

        {/* Statistics */}
        <div className="mb-6 bg-white dark:bg-gray-800 shadow-lg p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-600">
          <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-sky-500" /> Project Statistics
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {statsDisplay}
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="mb-6 bg-white dark:bg-gray-800 shadow-lg p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-white">Filters</h2>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="mt-2 sm:mt-0 border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Clear all filters"
            >
              <X className="w-4 h-4 mr-2" /> Clear Filters
            </Button>
          </div>
          
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <TabsTrigger value="search" className="text-black dark:text-white">Search</TabsTrigger>
              <TabsTrigger value="date" className="text-black dark:text-white">Date Range</TabsTrigger>
              <TabsTrigger value="sort" className="text-black dark:text-white">Sort</TabsTrigger>
            </TabsList>

            <TabsContent value="search">
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search projects by name..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-700 text-black dark:text-white border-sky-500 dark:border-sky-500 rounded-lg focus:ring-2 focus:ring-sky-500"
                  aria-label="Search projects by name"
                />
              </div>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
                className="mt-4"
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 text-black dark:text-white border-sky-500 dark:border-sky-500 rounded-lg focus:ring-2 focus:ring-sky-500">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </TabsContent>

            <TabsContent value="date">
              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <div className="relative">
                    <DatePicker
                      selected={filters.startDate ? new Date(filters.startDate) : null}
                      onChange={(date) => handleFilterChange('startDate', date ? date.toISOString().split('T')[0] : '')}
                      placeholderText="Start Date (YYYY-MM-DD)"
                      dateFormat="yyyy-MM-dd"
                      className="w-full border p-2 pl-10 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white border-sky-500 dark:border-sky-500 focus:ring-2 focus:ring-sky-500"
                      aria-label="Filter by start date"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  {filterErrors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{filterErrors.startDate}</p>
                  )}
                </div>
                <div>
                  <div className="relative">
                    <DatePicker
                      selected={filters.endDate ? new Date(filters.endDate) : null}
                      onChange={(date) => handleFilterChange('endDate', date ? date.toISOString().split('T')[0] : '')}
                      placeholderText="End Date (YYYY-MM-DD)"
                      dateFormat="yyyy-MM-dd"
                      className="w-full border p-2 pl-10 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white border-sky-500 dark:border-sky-500 focus:ring-2 focus:ring-sky-500"
                      aria-label="Filter by end date"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  {filterErrors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{filterErrors.endDate}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sort">
              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-700 text-black dark:text-white border-sky-500 dark:border-sky-500 rounded-lg focus:ring-2 focus:ring-sky-500">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="due_date">Due Date</SelectItem>
                    <SelectItem value="created_at">Created At</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.order}
                  onValueChange={(value) => handleFilterChange('order', value)}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-700 text-black dark:text-white border-sky-500 dark:border-sky-500 rounded-lg focus:ring-2 focus:ring-sky-500">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASC">Ascending</SelectItem>
                    <SelectItem value="DESC">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Project Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px] max-w-[90vw] bg-white dark:bg-gray-800 rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-black dark:text-white">
                {editingProject ? 'Update Project' : 'Create Project'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-black dark:text-white flex items-center">
                  Project Name <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  id="name"
                  placeholder="Enter project name"
                  {...register('name')}
                  className="bg-white dark:bg-gray-700 text-black dark:text-white border-sky-500 dark:border-sky-500 rounded-lg focus:ring-2 focus:ring-sky-500 transition-all duration-200"
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm" id="name-error">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="dueDate" className="text-sm font-medium text-black dark:text-white flex items-center">
                  Due Date <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <DatePicker
                    id="dueDate"
                    selected={dueDate ? new Date(dueDate) : null}
                    onChange={(date) => setValue('dueDate', date ? date.toISOString().split('T')[0] : '')}
                    placeholderText="Select due date (YYYY-MM-DD)"
                    dateFormat="yyyy-MM-dd"
                    className="w-full border p-2 pl-10 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white border-sky-500 dark:border-sky-500 focus:ring-2 focus:ring-sky-500"
                    aria-invalid={errors.dueDate ? 'true' : 'false'}
                    aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                {errors.dueDate && (
                  <p className="text-red-500 text-sm" id="dueDate-error">{errors.dueDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-black dark:text-white">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Enter project description (optional)"
                  {...register('description')}
                  className="bg-white dark:bg-gray-700 text-black dark:text-white border-sky-500 dark:border-sky-500 rounded-lg focus:ring-2 focus:ring-sky-500 resize-none"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium text-black dark:text-white">
                  Status
                </label>
                <Select
                  onValueChange={(value) => setValue('status', value)}
                  defaultValue={editingProject ? editingProject.status : 'active'}
                >
                  <SelectTrigger
                    id="status"
                    className="bg-white dark:bg-gray-700 text-black dark:text-white border-sky-500 dark:border-sky-500 rounded-lg focus:ring-2 focus:ring-sky-500"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 text-white font-semibold relative flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {editingProject ? 'Update Project' : 'Create Project'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Projects List */}
        <AnimatePresence>
          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <svg
                className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">
                No projects found. Start by creating a new project!
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg"
                disabled={isSubmitting}
              >
                Create Your First Project
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-5 border border-gray-100 dark:border-gray-600 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-black dark:text-white truncate flex-1">
                      {project.name}
                    </h2>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleEdit(project)}
                            variant="ghost"
                            size="sm"
                            className="text-sky-500 hover:text-sky-600"
                            aria-label={`Edit project ${project.name}`}
                            disabled={isSubmitting}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit {project.name}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => deleteProject(project.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            aria-label={`Delete project ${project.name}`}
                            disabled={isSubmitting}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete {project.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      <span className="font-medium">Status:</span>{' '}
                      <span className={`capitalize ${project.status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-sky-500 dark:text-sky-400'}`}>
                        {project.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Due Date:</span>{' '}
                      {new Date(project.due_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p>
                      <span className="font-medium">Last Updated:</span>{' '}
                      {project.updated_at
                        ? new Date(project.updated_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress:</div>
                    <motion.div
                      className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        className={`h-2.5 rounded-full ${
                          project.progress === 100
                            ? 'bg-green-600 dark:bg-green-500'
                            : project.progress >= 90
                            ? 'bg-red-600 dark:bg-red-500'
                            : 'bg-sky-500 dark:bg-sky-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      ></motion.div>
                    </motion.div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                      {project.progress}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {projects.length > 0 && total > filters.limit && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              disabled={filters.page === 1 || isSubmitting}
              onClick={() => handleFilterChange('page', filters.page - 1)}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold w-full sm:w-auto rounded-lg transition-colors duration-200 flex items-center"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Page {filters.page} of {Math.ceil(total / filters.limit)}
            </p>
            <Button
              disabled={filters.page >= Math.ceil(total / filters.limit) || isSubmitting}
              onClick={() => handleFilterChange('page', filters.page + 1)}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold w-full sm:w-auto rounded-lg transition-colors duration-200 flex items-center"
              aria-label="Next page"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

export const dynamic = 'force-dynamic';