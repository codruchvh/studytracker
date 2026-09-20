import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Plus, 
  Trash2, 
  BarChart2, 
  Calendar,
  Flame,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export default function App() {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('study_subjects');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Mathematics', goalHours: 10, completedHours: 4.5, color: 'bg-blue-500' },
      { id: 2, name: 'Physics', goalHours: 8, completedHours: 2, color: 'bg-purple-500' },
      { id: 3, name: 'Computer Science', goalHours: 12, completedHours: 7, color: 'bg-emerald-500' }
    ];
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('study_tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, subjectId: 1, title: 'Complete Calculus Chapter 3 Exercises', completed: false },
      { id: 2, subjectId: 2, title: 'Review Kinematics notes', completed: true },
      { id: 3, subjectId: 3, title: 'Build React components for Study Tracker', completed: false }
    ];
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectGoal, setNewSubjectGoal] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubjectId, setNewTaskSubjectId] = useState('');

  // Pomodoro Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('work'); // 'work' or 'break'

  useEffect(() => {
    localStorage.setItem('study_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('study_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      if (timerMode === 'work') {
        alert('Work session completed! Take a break.');
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        alert('Break ended! Back to work.');
        setTimerMode('work');
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, timerMode]);

  const addSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !newSubjectGoal) return;
    
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newSubject = {
      id: Date.now(),
      name: newSubjectName.trim(),
      goalHours: parseFloat(newSubjectGoal),
      completedHours: 0,
      color: randomColor
    };

    setSubjects([...subjects, newSubject]);
    setNewSubjectName('');
    setNewSubjectGoal('');
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setTasks(tasks.filter(t => t.subjectId !== id));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskSubjectId) return;

    const newTask = {
      id: Date.now(),
      subjectId: parseInt(newTaskSubjectId),
      title: newTaskTitle.trim(),
      completed: false
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalGoalHours = subjects.reduce((sum, s) => sum + s.goalHours, 0);
  const totalCompletedHours = subjects.reduce((sum, s) => sum + s.completedHours, 0);
  const totalProgress = totalGoalHours > 0 ? Math.min(100, Math.round((totalCompletedHours / totalGoalHours) * 100)) : 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-neutral-900 border-b md:border-b-0 md:border-r border-neutral-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">StudyTracker</h1>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <BarChart2 className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === 'tasks' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Tasks & Goals
            </button>
            <button
              onClick={() => setActiveTab('timer')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === 'timer' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Clock className="w-5 h-5" />
              Focus Timer
            </button>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-800 text-xs text-neutral-500">
          <p>Study Tracker App v1.0</p>
          <p className="mt-1">Standalone Vercel Ready</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <header>
              <h2 className="text-3xl font-bold text-white">Overview</h2>
              <p className="text-neutral-400 mt-1">Track your study goals and daily performance.</p>
            </header>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                <div className="flex items-center justify-between text-neutral-400 mb-2">
                  <span className="text-sm font-medium">Total Progress</span>
                  <Flame className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-3xl font-bold text-white">{totalProgress}%</div>
                <div className="w-full bg-neutral-800 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${totalProgress}%` }}></div>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                <div className="flex items-center justify-between text-neutral-400 mb-2">
                  <span className="text-sm font-medium">Hours Studied</span>
                  <Clock className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-3xl font-bold text-white">{totalCompletedHours} / {totalGoalHours} hrs</div>
                <p className="text-xs text-neutral-500 mt-2">Target hours across all subjects</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                <div className="flex items-center justify-between text-neutral-400 mb-2">
                  <span className="text-sm font-medium">Active Subjects</span>
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white">{subjects.length}</div>
                <p className="text-xs text-neutral-500 mt-2">{tasks.filter(t => !t.completed).length} pending tasks</p>
              </div>
            </div>

            {/* Subjects Progress Grid */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Subject Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map(subject => {
                  const subjectProgress = Math.min(100, Math.round((subject.completedHours / subject.goalHours) * 100));
                  return (
                    <div key={subject.id} className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                          <span className="font-semibold text-white">{subject.name}</span>
                        </div>
                        <span className="text-sm text-neutral-400">{subject.completedHours} / {subject.goalHours} hrs</span>
                      </div>
                      <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                        <div className={`${subject.color} h-full transition-all duration-300`} style={{ width: `${subjectProgress}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-neutral-500 pt-1">
                        <span>{subjectProgress}% completed</span>
                        <button 
                          onClick={() => deleteSubject(subject.id)}
                          className="hover:text-rose-400 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <header>
              <h2 className="text-3xl font-bold text-white">Tasks & Subjects</h2>
              <p className="text-neutral-400 mt-1">Add new study courses or record daily actionable tasks.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="space-y-6">
                {/* Add Subject */}
                <form onSubmit={addSubject} className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4">
                  <h3 className="text-lg font-semibold text-white">Add New Subject</h3>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Subject Name</label>
                    <input 
                      type="text" 
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      placeholder="e.g. Organic Chemistry"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Target Hours</label>
                    <input 
                      type="number" 
                      value={newSubjectGoal}
                      onChange={(e) => setNewSubjectGoal(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add Subject
                  </button>
                </form>

                {/* Add Task */}
                <form onSubmit={addTask} className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4">
                  <h3 className="text-lg font-semibold text-white">Add Study Task</h3>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Task Title</label>
                    <input 
                      type="text" 
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="e.g. Read Chapter 2"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Subject</label>
                    <select 
                      value={newTaskSubjectId}
                      onChange={(e) => setNewTaskSubjectId(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                </form>
              </div>

              {/* Task List */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-semibold text-white">To-Do List</h3>
                {tasks.length === 0 ? (
                  <p className="text-sm text-neutral-500">No tasks created yet.</p>
                ) : (
                  <div className="space-y-3">
                    {tasks.map(task => {
                      const subject = subjects.find(s => s.id === task.subjectId);
                      return (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg border border-neutral-800">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => toggleTask(task.id)}
                              className={`w-5 h-5 rounded border flex items-center justify-center transition ${
                                task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-600 hover:border-indigo-500'
                              }`}
                            >
                              {task.completed && <CheckCircle className="w-4 h-4" />}
                            </button>
                            <div>
                              <p className={`text-sm ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                                {task.title}
                              </p>
                              {subject && (
                                <span className="text-xs text-neutral-400">{subject.name}</span>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="text-neutral-500 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timer' && (
          <div className="space-y-8 max-w-xl mx-auto text-center pt-8">
            <header>
              <h2 className="text-3xl font-bold text-white">Pomodoro Timer</h2>
              <p className="text-neutral-400 mt-1">Focus intensely in intervals to maximize productivity.</p>
            </header>

            <div className="bg-neutral-900 border border-neutral-800 p-10 rounded-2xl space-y-8">
              <div className="inline-block px-4 py-1.5 rounded-full bg-neutral-800 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                {timerMode === 'work' ? 'Focus Session' : 'Rest Break'}
              </div>

              <div className="text-6xl font-mono font-bold text-white tracking-widest">
                {formatTime(timerSeconds)}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-medium transition flex items-center gap-2"
                >
                  {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(timerMode === 'work' ? 25 * 60 : 5 * 60);
                  }}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-6 py-3 rounded-xl font-medium transition flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" /> Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
