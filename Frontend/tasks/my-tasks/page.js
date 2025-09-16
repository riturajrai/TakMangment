
'use client';

import { useAuth } from '../../useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import {Plus, Search, CheckCircle, Clock, AlertCircle, FileText, X, Trash2, User, Edit, ArrowDown , ArrowUp , Pause, Calendar} from 'lucide-react';
// Axios instance with cookies enabled
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Dummy data for users and projects
const dummyUsers = [
  { _id: 'user1', name: 'John Doe' },
  { _id: 'user2', name: 'Jane Smith' },
  { _id: 'user3', name: 'Alice Johnson' },
  { _id: 'user4', name: 'Bob Wilson' },
];

const dummyProjects = [
  { _id: 'project1', name: 'Project Alpha' },
  { _id: 'project2', name: 'Project Beta' },
  { _id: 'project3', name: 'Project Gamma' },
];

export default function Assigned() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({ priority: 'all', project: 'all' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedTask, setSelectedTask] = useState({id: null,title: '',description: '',priority: 'medium',dueDate: '',projectId: null,status: 'pending', assigneeId: null,});

  const priorityOptions = {low: { label: 'Low', color: 'bg-blue-100 text-blue-800', icon: <ArrowDown size={14} /> },medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800', icon: <Pause size={14} /> },
    high: { label: 'High', color: 'bg-red-100 text-red-800', icon: <ArrowUp size={14} /> },
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/assigned');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTasks();
      setProjects(dummyProjects);
      setUsers(dummyUsers);
    }
  }, [isAuthenticated, user]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks/tasks?limit=100');
      const tasksData = response.data.tasks || [];
      setTasks(tasksData);
      updateStats(tasksData);
    } catch (error) {
      if (error.response?.status === 401) router.push('/login');
      toast.error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  };

  const updateStats = (tasksList) => {
    const today = new Date();
    const overdueTasks = tasksList.filter(
      (task) => new Date(task.dueDate) < today && task.status !== 'completed'
    ).length;

    setStats({
      totalTasks: tasksList.length,
      completedTasks: tasksList.filter((t) => t.status === 'completed').length,
      pendingTasks: tasksList.filter((t) => t.status === 'pending').length,
      inProgressTasks: tasksList.filter((t) => t.status === 'in progress').length,
      overdueTasks,
    });
  };

  const handleAddTask = () => {
    setModalMode('add');
    setSelectedTask({
      id: null,
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      projectId: null,
      status: 'pending',
      assigneeId: user ? user._id : null,
    });
    setIsModalOpen(true);
  };

  const handleEditTask = async (taskId) => {
    try {
      const response = await api.get(`/tasks/task/${taskId}`);
      const task = response.data;
      setModalMode('edit');
      setSelectedTask({
        id: task._id,
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        projectId: task.projectId ? task.projectId.toString() : null,
        status: task.status,
        assigneeId: task.assigneeId ? task.assigneeId.toString() : null,
      });
      setIsModalOpen(true);
    } catch (error) {
      if (error.response?.status === 401) router.push('/login');
      toast.error(error.response?.data?.message || 'Failed to fetch task');
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask.title || !selectedTask.dueDate || !selectedTask.assigneeId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (modalMode === 'add') {
        await api.post('/tasks/create-task', selectedTask);
      } else {
        await api.put(`/tasks/update-task/${selectedTask.id}`, selectedTask);
      }
      fetchTasks();
      toast.success(modalMode === 'add' ? 'Task created successfully' : 'Task updated successfully');
      setIsModalOpen(false);
    } catch (error) {
      if (error.response?.status === 401) router.push('/login');
      toast.error(error.response?.data?.message || 'Failed to submit task');
    }
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      if (action === 'complete') {
        await api.patch(`/tasks/update-task/status/${taskId}`, { status: 'completed' });
      } else if (action === 'delete') {
        await api.delete(`/tasks/delete-task/${taskId}`);
      }
      fetchTasks();
      toast.success(action === 'complete' ? 'Task completed' : 'Task deleted');
    } catch (error) {
      if (error.response?.status === 401) router.push('/login');
      toast.error(error.response?.data?.message || 'Failed to perform action');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filter.priority === 'all' || task.priority === filter.priority;
    const matchesProject = filter.project === 'all' || task.projectId?.toString() === filter.project;
    return matchesSearch && matchesPriority && matchesProject;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
    </div>
  );
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#363636', color: '#fff' } }} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          {[
            { icon: FileText, label: 'Total Tasks', value: stats.totalTasks, color: 'sky' },
            { icon: CheckCircle, label: 'Completed', value: stats.completedTasks, color: 'green' },
            { icon: Clock, label: 'Pending', value: stats.pendingTasks, color: 'yellow' },
            { icon: AlertCircle, label: 'In Progress', value: stats.inProgressTasks, color: 'blue' },
            { icon: AlertCircle, label: 'Overdue', value: stats.overdueTasks, color: 'red' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between border border-gray-200">
              <div>
                <p className="text-sm font-medium text-black">{stat.label}</p>
                <p className={`text-lg font-semibold text-${stat.color}-600`}>{stat.value}</p>
              </div>
              <stat.icon className={`text-${stat.color}-400 w-6 h-6`} />
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-500 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sky-700 bg-white w-full"
              />
            </div>
            <select
              value={filter.priority}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sky-700 bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={filter.project}
              onChange={(e) => setFilter({ ...filter, project: e.target.value })}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sky-700 bg-white"
            >
              <option value="all">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAddTask}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>

        {/* Task List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div key={task._id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col justify-between border border-gray-200">
              <div>
                <h3 className="font-semibold text-sky-700 text-lg">{task.title}</h3>
                <p className="text-sm text-black mt-1">{task.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${priorityOptions[task.priority].color}`}>
                    {priorityOptions[task.priority].label}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      task.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'in progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <p className="text-xs text-black mt-2">
                  <User className="inline-block w-4 h-4 mr-1" />
                  Assigned To: {users.find((u) => u._id === task.assigneeId)?.name || 'Unassigned'}
                </p>
                <p className="text-xs text-black">
                  <FileText className="inline-block w-4 h-4 mr-1" />
                  Project: {projects.find((p) => p._id === task.projectId)?.name || 'No Project'}
                </p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-xs text-black">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  Due: {formatDate(task.dueDate)}
                </p>
                <div className="flex gap-2">
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => handleTaskAction(task._id, 'complete')}
                      className="text-green-600 hover:text-green-800"
                      title="Complete Task"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleEditTask(task._id)}
                    className="text-sky-600 hover:text-sky-800"
                    title="Edit Task"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleTaskAction(task._id, 'delete')}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Task"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Task Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-black hover:text-sky-700"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-sky-700 mb-4">
                {modalMode === 'add' ? 'Add Task' : 'Edit Task'}
              </h2>
              <form onSubmit={handleTaskSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sky-700 bg-white"
                />
                <textarea
                  placeholder="Description"
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sky-700 bg-white min-h-[100px]"
                />
                <div className="flex gap-3">
                  <select
                    value={selectedTask.priority}
                    onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sky-700 bg-white flex-1"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <select
                    value={selectedTask.projectId || ''}
                    onChange={(e) => setSelectedTask({ ...selectedTask, projectId: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sky-700 bg-white flex-1"
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                  <select
                    value={selectedTask.assigneeId || ''}
                    onChange={(e) => setSelectedTask({ ...selectedTask, assigneeId: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sky-700 bg-white flex-1"
                  >
                    <option value="">Assign To</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="date"
                  value={selectedTask.dueDate}
                  onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sky-700 bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  {modalMode === 'add' ? 'Create' : 'Update'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
