'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import { useLanguage } from '../contexts/LanguageContext';

interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  completed: boolean;
  createdAt: string;
}

export default function ReminderPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const router = useRouter();
  const { t } = useLanguage();

  // Load reminders from localStorage on component mount
  useEffect(() => {
    const savedReminders = localStorage.getItem('e-sulat-reminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  // Save reminders to localStorage whenever reminders change
  useEffect(() => {
    localStorage.setItem('e-sulat-reminders', JSON.stringify(reminders));
  }, [reminders]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (!dueTime) {
      newErrors.dueTime = 'Due time is required';
    }

    // Check if date/time is in the past
    if (dueDate && dueTime) {
      const reminderDateTime = new Date(`${dueDate}T${dueTime}`);
      const now = new Date();
      if (reminderDateTime <= now) {
        newErrors.dueDate = 'Due date and time must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddReminder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    const newReminder: Reminder = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      dueDate,
      dueTime,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setReminders(prev => [...prev, newReminder]);
    
    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setDueTime('');
    setErrors({});
    setLoading(false);
    setShowModal(false);
  };

  const toggleComplete = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const filteredReminders = reminders;

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isOverdue = (date: string, time: string, completed: boolean) => {
    if (completed) return false;
    const reminderDateTime = new Date(`${date}T${time}`);
    return reminderDateTime < new Date();
  };

  const completedCount = reminders.filter(r => r.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-br from-yellow-200/10 to-orange-300/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-green-300/15 to-teal-400/15 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-indigo-300/15 to-purple-400/15 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      {/* Header */}
      <header className="bg-white/20 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center relative z-10">
        <div className="w-10"></div>
        <h1 className="text-xl font-bold text-gray-800 text-center">{t('reminder.title')}</h1>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <div className="w-6 h-6 flex flex-col justify-center gap-1">
            <div className="w-full h-0.5 bg-gray-600"></div>
            <div className="w-full h-0.5 bg-gray-600"></div>
            <div className="w-full h-0.5 bg-gray-600"></div>
          </div>
        </button>
      </header>



      {/* Main Content */}
      <main className="relative z-10 p-4 pb-24">
        {filteredReminders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('reminder.noReminders')}</h3>
            <p className="text-gray-600 mb-6">{t('reminder.noRemindersDesc')}</p>
            <Button onClick={() => setShowModal(true)}>
              {t('reminder.createFirstReminder')}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReminders
              .sort((a, b) => {
                // Sort by due date/time, then by creation date
                const aDateTime = new Date(`${a.dueDate}T${a.dueTime}`);
                const bDateTime = new Date(`${b.dueDate}T${b.dueTime}`);
                return aDateTime.getTime() - bDateTime.getTime();
              })
              .map(reminder => (
                <div
                  key={reminder.id}
                  className={`bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 transition-all hover:bg-white/30 ${
                    reminder.completed ? 'opacity-75' : ''
                  } ${
                    isOverdue(reminder.dueDate, reminder.dueTime, reminder.completed) 
                      ? 'border-red-300 bg-red-50/20' 
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleComplete(reminder.id)}
                      className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        reminder.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-400 hover:border-green-500'
                      }`}
                    >
                      {reminder.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-gray-800 ${reminder.completed ? 'line-through' : ''}`}>
                        {reminder.title}
                      </h3>
                      {reminder.description && (
                        <p className={`text-gray-600 text-sm mt-1 ${reminder.completed ? 'line-through' : ''}`}>
                          {reminder.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={`text-sm ${
                          isOverdue(reminder.dueDate, reminder.dueTime, reminder.completed)
                            ? 'text-red-600 font-medium'
                            : 'text-gray-600'
                        }`}>
                          {formatDateTime(reminder.dueDate, reminder.dueTime)}
                          {isOverdue(reminder.dueDate, reminder.dueTime, reminder.completed) && (
                            <span className="ml-1 text-red-600 font-bold">• Overdue</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50/20 rounded-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-6 z-30">
        <button
          onClick={() => setShowModal(true)}
          className="w-14 h-14 bg-gradient-sunset text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Add Reminder Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">{t('reminder.createFirstReminder')}</h2>
            
            <Input
              label="Title"
              placeholder="Enter reminder title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              required
              autoFocus
            />

            <div>
              <label className="block text-sm font-medium text-white mb-2 drop-shadow-md">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter reminder description (optional)"
                rows={3}
                className="w-full p-5 glass-strong border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-base text-white placeholder-white/60 backdrop-blur-xl shadow-glass hover:shadow-glass-medium focus:shadow-glass-medium resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Due Date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                error={errors.dueDate}
                required
              />

              <Input
                type="time"
                label="Due Time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                error={errors.dueTime}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => setShowModal(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddReminder}
                loading={loading}
                fullWidth
              >
                Add Reminder
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}