import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

export const startSession = (intervalMinutes) =>
  api.post('/sessions/start', { interval_minutes: intervalMinutes })

export const endSession = (id, durationSeconds) =>
  api.patch(`/sessions/${id}/end`, { duration_seconds: durationSeconds })

export const logBreak = (sessionId, exerciseId, snoozed = false) =>
  api.post(`/sessions/${sessionId}/breaks`, { exercise_id: exerciseId, snoozed })

export const getTodayStats = () =>
  api.get('/sessions/today')

export const getExercises = () =>
  api.get('/exercises')
