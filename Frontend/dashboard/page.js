'use client';

import { useAuth } from '../useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { 
  Plus, 
  Filter, 
  Search, 
  Calendar, 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText,
  MoreVertical,
  X,
  ChevronDown,
  Edit,
  Trash2
} from 'lucide-react';
import Script from 'next/script';

export default function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [newTask, setNewTask] = useState({
    id: null,
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignee: '',
    status: 'pending'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({ priority: 'all', status: 'all' });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const mockTasks = [
        { 
          id: '1', 
          title: 'Complete project proposal', 
          description: 'Draft and finalize the project proposal document for client review',
          priority: 'high', 
          status: 'pending', 
          dueDate: '2025-09-10', 
          assignee: 'You' 
        },
        { 
          id: '2', 
          title: 'Review team tasks', 
          description: 'Go through the tasks assigned to team members and provide feedback',
          priority: 'medium', 
          status: 'completed', 
          dueDate: '2025-09-05', 
          assignee: 'You' 
        },
        { 
          id: '3', 
          title: 'Client meeting preparation', 
          description: 'Prepare slides and materials for the upcoming client meeting',
          priority: 'high', 
          status: 'in progress', 
          dueDate: '2025-09-12', 
          assignee: 'John D.' 
        },
        { 
          id: '4', 
          title: 'Update documentation', 
          description: 'Update the user documentation with the latest features and changes',
          priority: 'low', 
          status: 'pending', 
          dueDate: '2025-09-15', 
          assignee: 'You' 
        },
        { 
          id: '5', 
          title: 'Fix dashboard UI issues', 
          description: 'Resolve UI bugs reported in the dashboard interface',
          priority: 'medium', 
          status: 'in progress', 
          dueDate: '2025-09-07', 
          assignee: 'Sarah M.' 
        },
      ];
      
      setTasks(mockTasks);
      setStats({
        totalTasks: mockTasks.length,
        completedTasks: mockTasks.filter(task => task.status === 'completed').length,
        pendingTasks: mockTasks.filter(task => task.status === 'pending').length,
        inProgressTasks: mockTasks.filter(task => task.status === 'in progress').length,
        overdueTasks: mockTasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'completed').length
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTab === 'analytics' && typeof window !== 'undefined' && window.Chart) {
      const ctx = document.getElementById('taskChart')?.getContext('2d');
      if (ctx) {
        new window.Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Pending', 'In Progress', 'Completed'],
            datasets: [{
              label: 'Tasks',
              data: [stats.pendingTasks, stats.inProgressTasks, stats.completedTasks],
              backgroundColor: ['#facc15', '#3b82f6', '#22c55e'],
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
          }
        });
      }
    }
  }, [activeTab, stats]);

  const handleAddTask = () => {
    setModalMode('add');
    setNewTask({ id: null, title: '', description: '', priority: 'medium', dueDate: '', assignee: '', status: 'pending' });
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setModalMode('edit');
    setNewTask(task);
    setIsModalOpen(true);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.dueDate || !newTask.assignee) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (modalMode === 'add') {
      const newTaskData = {
        id: (tasks.length + 1).toString(),
        ...newTask
      };
      setTasks([...tasks, newTaskData]);
      setStats(prev => ({
        ...prev,
        totalTasks: prev.totalTasks + 1,
        [newTask.status === 'pending' ? 'pendingTasks' : newTask.status === 'in progress' ? 'inProgressTasks' : 'completedTasks']: 
          prev[newTask.status === 'pending' ? 'pendingTasks' : newTask.status === 'in progress' ? 'inProgressTasks' : 'completedTasks'] + 1,
        overdueTasks: newTask.status !== 'completed' && new Date(newTask.dueDate) < new Date() 
          ? prev.overdueTasks + 1 
          : prev.overdueTasks
      }));
      toast.success('Task added successfully!');
    } else {
      setTasks(tasks.map(task => task.id === newTask.id ? newTask : task));
      setStats(prev => {
        const oldTask = tasks.find(t => t.id === newTask.id);
        return {
          ...prev,
          completedTasks: newTask.status === 'completed' ? prev.completedTasks + (oldTask.status !== 'completed' ? 1 : 0) : prev.completedTasks - (oldTask.status === 'completed' ? 1 : 0),
          pendingTasks: newTask.status === 'pending' ? prev.pendingTasks + (oldTask.status !== 'pending' ? 1 : 0) : prev.pendingTasks - (oldTask.status === 'pending' ? 1 : 0),
          inProgressTasks: newTask.status === 'in progress' ? prev.inProgressTasks + (oldTask.status !== 'in progress' ? 1 : 0) : prev.inProgressTasks - (oldTask.status === 'in progress' ? 1 : 0),
          overdueTasks: newTask.status !== 'completed' && new Date(newTask.dueDate) < new Date() 
            ? prev.overdueTasks + (oldTask.status === 'completed' || new Date(oldTask.dueDate) >= new Date() ? 1 : 0)
            : prev.overdueTasks - (oldTask.status !== 'completed' && new Date(oldTask.dueDate) < new Date() ? 1 : 0)
        };
      });
      toast.success('Task updated successfully!');
    }
    setIsModalOpen(false);
    setNewTask({ id: null, title: '', description: '', priority: 'medium', dueDate: '', assignee: '', status: 'pending' });
  };

  const handleTaskAction = (taskId, action) => {
    if (action === 'complete') {
      setTasks(tasks.map(task => 
        task.id === taskId ? {...task, status: 'completed'} : task
      ));
      setStats(prev => ({
        ...prev,
        completedTasks: prev.completedTasks + 1,
        [tasks.find(t => t.id === taskId).status === 'pending' ? 'pendingTasks' : 'inProgressTasks']: 
          prev[tasks.find(t => t.id === taskId).status === 'pending' ? 'pendingTasks' : 'inProgressTasks'] - 1,
        overdueTasks: new Date(tasks.find(t => t.id === taskId).dueDate) < new Date() 
          ? prev.overdueTasks - 1 
          : prev.overdueTasks
      }));
      toast.success('Task marked as completed!');
    } else if (action === 'delete') {
      const deletedTask = tasks.find(task => task.id === taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      setStats(prev => ({
        ...prev,
        totalTasks: prev.totalTasks - 1,
        completedTasks: deletedTask.status === 'completed' ? prev.completedTasks - 1 : prev.completedTasks,
        pendingTasks: deletedTask.status === 'pending' ? prev.pendingTasks - 1 : prev.pendingTasks,
        inProgressTasks: deletedTask.status === 'in progress' ? prev.inProgressTasks - 1 : prev.inProgressTasks,
        overdueTasks: deletedTask.status !== 'completed' && new Date(deletedTask.dueDate) < new Date() 
          ? prev.overdueTasks - 1 
          : prev.overdueTasks
      }));
      toast.success('Task deleted!');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filter.priority === 'all' || task.priority === filter.priority;
    const matchesStatus = filter.status === 'all' || task.status === filter.status;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js" strategy="afterInteractive" />
      <div className="min-h-screen bg-gray-50">
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />


        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[
              { icon: FileText, label: 'Total Tasks', value: stats.totalTasks, color: 'indigo' },
              { icon: CheckCircle, label: 'Completed', value: stats.completedTasks, color: 'green' },
              { icon: Clock, label: 'Pending', value: stats.pendingTasks, color: 'yellow' },
              { icon: AlertCircle, label: 'Overdue', value: stats.overdueTasks, color: 'red' }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 transition-transform hover:scale-[1.02] border border-gray-100">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</h2>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex flex-wrap -mb-px">
                {['overview', 'tasks', 'team', 'analytics'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                    aria-current={activeTab === tab ? 'page' : undefined}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="p-4 sm:p-6">
              {activeTab === 'overview' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">Recent Tasks</h2>
                    <button 
                      onClick={handleAddTask}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      aria-label="Add new task"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Task
                          </th>
                          <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assignee
                          </th>
                          <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="relative px-4 sm:px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTasks.map((task) => (
                          <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 sm:px-6 py-4">
                              <div className="flex items-center">
                                <div className={`h-2 w-2 rounded-full mr-3 ${
                                  task.priority === 'high' ? 'bg-red-500' : 
                                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                }`}></div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                  {task.description && (
                                    <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{task.assignee}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                {formatDate(task.dueDate)}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                task.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button 
                                  onClick={() => handleEditTask(task)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  aria-label={`Edit task ${task.title}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                {task.status !== 'completed' && (
                                  <button 
                                    onClick={() => handleTaskAction(task.id, 'complete')}
                                    className="text-green-600 hover:text-green-900"
                                    aria-label={`Complete task ${task.title}`}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleTaskAction(task.id, 'delete')}
                                  className="text-red-600 hover:text-red-900"
                                  aria-label={`Delete task ${task.title}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeTab === 'tasks' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-lg font-medium text-gray-900">My Tasks</h2>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Search tasks..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
                          aria-label="Search tasks"
                        />
                      </div>
                      <div className="relative group">
                        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </button>
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 space-y-3 hidden group-hover:block">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select
                              value={filter.priority}
                              onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="all">All Priorities</option>
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                              value={filter.status}
                              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="all">All Statuses</option>
                              <option value="pending">Pending</option>
                              <option value="in progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                          <button
                            onClick={() => setFilter({ priority: 'all', status: 'all' })}
                            className="w-full mt-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Reset Filters
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={handleAddTask}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        aria-label="Add new task"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Task
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {['pending', 'in progress', 'completed'].map(status => (
                      <div key={status}>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium text-gray-700 capitalize flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-2 ${
                              status === 'pending' ? 'bg-yellow-500' :
                              status === 'in progress' ? 'bg-blue-500' : 'bg-green-500'
                            }`}></span>
                            {status}
                          </h3>
                          <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                            {filteredTasks.filter(t => t.status === status).length}
                          </span>
                        </div>
                        <div className="space-y-4">
                          {filteredTasks
                            .filter(task => task.status === status)
                            .map((task) => (
                              <div
                                key={task.id}
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
                              >
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                                  <div className="relative">
                                    <button 
                                      onClick={() => handleEditTask(task)}
                                      className="text-gray-400 hover:text-gray-600"
                                      aria-label={`Edit task ${task.title}`}
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                {task.description && (
                                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{task.description}</p>
                                )}
                                <div className="mt-3 flex items-center text-sm text-gray-500">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Due: {formatDate(task.dueDate)}
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                  <span className="mr-1">Assignee:</span> {task.assignee}
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {task.priority} priority
                                  </span>
                                  <div className="flex space-x-2">
                                    {task.status !== 'completed' && (
                                      <button 
                                        onClick={() => handleTaskAction(task.id, 'complete')}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                                        aria-label={`Complete task ${task.title}`}
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Mark complete
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => handleTaskAction(task.id, 'delete')}
                                      className="text-xs text-red-600 hover:text-red-900 font-medium flex items-center"
                                      aria-label={`Delete task ${task.title}`}
                                    >
                                      <Trash2 className="h-3 w-3 mr-1" />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          {filteredTasks.filter(task => task.status === status).length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                              <p>No tasks in {status}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'team' && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Team Management</h3>
                  <p className="text-gray-600 mb-6">Manage your team members, assign tasks, and track progress.</p>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Invite Team Members
                  </button>
                </div>
              )}
              
              {activeTab === 'analytics' && (
                <div className="py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">Task Analytics</h3>
                  <p className="text-gray-600 text-center mb-8">Visualize your task completion rates, team performance, and productivity trends.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                    <div className="bg-indigo-50 p-6 rounded-lg shadow-sm border border-indigo-100">
                      <h4 className="font-medium text-indigo-900 mb-2">Completion Rate</h4>
                      <div className="text-2xl sm:text-3xl font-bold text-indigo-700">
                        {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                      </div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
                      <h4 className="font-medium text-green-900 mb-2">Productivity Score</h4>
                      <div className="text-2xl sm:text-3xl font-bold text-green-700">87%</div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-4">Task Distribution</h4>
                    <div className="h-64">
                      <canvas id="taskChart"></canvas>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Task Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white">
                  <h2 className="text-lg font-medium text-gray-900">{modalMode === 'add' ? 'Add New Task' : 'Edit Task'}</h2>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleTaskSubmit} className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="task-title">
                        Task Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="task-title"
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter task title"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="task-description">
                        Description
                      </label>
                      <textarea
                        id="task-description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter task description"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="priority">
                        Priority <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="priority"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        aria-required="true"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="due-date">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="due-date"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assignee">
                        Assignee <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="assignee"
                        type="text"
                        value={newTask.assignee}
                        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter assignee name"
                        required
                        aria-required="true"
                      />
                    </div>
                    {modalMode === 'edit' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                          Status
                        </label>
                        <select
                          id="status"
                          value={newTask.status}
                          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      aria-label="Cancel"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      aria-label={modalMode === 'add' ? 'Add task' : 'Update task'}
                    >
                      {modalMode === 'add' ? 'Add Task' : 'Update Task'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export const dynamic = 'force-dynamic';