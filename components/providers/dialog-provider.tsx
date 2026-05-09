"use client"

import { createContext, useCallback, useContext, useRef, useState } from "react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

type ConfirmOptions = {
  message: string
  confirmLabel?: string
  cancelLabel?: string
  showCancel?: boolean
}

type DialogContextValue = {
  confirm: (options: string | ConfirmOptions) => Promise<boolean>
  notify: (message: string) => Promise<void>
}

const DialogContext = createContext<DialogContextValue | null>(null)

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({ message: "" })
  const resolveRef = useRef<(value: boolean) => void>(null)

  const confirm = useCallback((opts: string | ConfirmOptions): Promise<boolean> => {
    const normalized = typeof opts === "string" ? { message: opts } : opts
    setOptions(normalized)
    setOpen(true)
    return new Promise((resolve) => {
      resolveRef.current = resolve
    })
  }, [])

  const notify = useCallback((message: string): Promise<void> => {
    setOptions({ message, showCancel: false })
    setOpen(true)
    return new Promise((resolve) => {
      resolveRef.current = () => resolve()
    })
  }, [])

  const handleConfirm = () => {
    setOpen(false)
    resolveRef.current?.(true)
  }

  const handleCancel = () => {
    setOpen(false)
    resolveRef.current?.(false)
  }

  return (
    <DialogContext.Provider value={{ confirm, notify }}>
      {children}
      <ConfirmDialog
        open={open}
        message={options.message}
        confirmLabel={options.confirmLabel}
        cancelLabel={options.cancelLabel}
        showCancel={options.showCancel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error("useDialog debe usarse dentro de DialogProvider")
  return ctx
}
