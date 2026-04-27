'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllDoctors, deleteDoctor, Doctor } from '@/lib/firestore';

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      console.log('Fetching doctors...');
      const doctorsData = await getAllDoctors();
      console.log('Doctors fetched:', doctorsData);
      setDoctors(doctorsData);
    } catch (error: any) {
      console.error('Error fetching doctors:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'permission-denied') {
        console.warn('Permission denied - check if:');
        console.warn('1. You are logged in as admin@admin.com');
        console.warn('2. Firestore rules have been deployed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete Dr. ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteDoctor(id);
      setDoctors(doctors.filter(d => d.id !== id));
      console.log('Doctor deleted successfully');
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string, name: string) => {
    // TODO: Implement edit functionality
    alert(`Edit functionality for Dr. ${name} will be implemented soon. ID: ${id}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Doctor Management</h2>
        <button className="text-purple-600 font-semibold hover:text-purple-700 transition-colors flex items-center gap-2">
          View All
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-xl mb-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">
        <div className="col-span-4">Practitioner</div>
        <div className="col-span-3">Specialty</div>
        <div className="col-span-3">Status</div>
        <div className="col-span-2">Actions</div>
      </div>

      {/* Doctor List */}
      <div className="space-y-2">
        {doctors.length > 0 ? (
          doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-gray-50 rounded-xl transition-colors"
            >
              {/* Practitioner */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
                  {doctor.photoURL ? (
                    <img src={doctor.photoURL} alt={doctor.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    '👨‍⚕️'
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{doctor.name}</p>
                  <p className="text-sm text-gray-500">{doctor.email || 'No email provided'}</p>
                </div>
              </div>

              {/* Specialty */}
              <div className="col-span-3 flex items-center">
                <p className="text-gray-700">{doctor.specialty}</p>
              </div>

              {/* Status */}
              <div className="col-span-3 flex items-center">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    doctor.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${doctor.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  {doctor.status === 'active' ? 'Active' : 'Away'}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center gap-2">
                <button 
                  onClick={() => handleEdit(doctor.id, doctor.name)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                  disabled={deletingId === doctor.id}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button 
                  onClick={() => handleDelete(doctor.id, doctor.name)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete"
                  disabled={deletingId === doctor.id}
                >
                  {deletingId === doctor.id ? (
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No doctors found. Add doctors to get started.
          </div>
        )}
      </div>
    </motion.div>
  );
}
