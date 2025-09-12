"use client"

import { createContext, useContext, useReducer } from "react"

const ToastContext = createContext()

const toastReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return [...state, action.payload]
    case "REMOVE_TOAST":
      return state.filter((toast) => toast.id !== action.payload)
    case "CLEAR_TOASTS":
      return []
    default:
      return state
  }
}

export const ToastProvider = ({ children }) => {
  const [toasts, dispatch] = useReducer(toastReducer, [])

  const showToast = (message, type = "info", duration = 5000) => {
    const id = Date.now() + Math.random()

    dispatch({
      type: "ADD_TOAST",
      payload: {
        id,
        message,
        type,
        duration,
      },
    })

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", payload: id })
      }, duration)
    }

    return id
  }

  const removeToast = (id) => {
    dispatch({ type: "REMOVE_TOAST", payload: id })
  }

  const clearToasts = () => {
    dispatch({ type: "CLEAR_TOASTS" })
  }

  const value = {
    toasts,
    showToast,
    removeToast,
    clearToasts,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast debe ser usado dentro de ToastProvider")
  }
  return context
}
