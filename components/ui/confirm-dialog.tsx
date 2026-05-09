"use client"

import { Dialog } from "@base-ui/react/dialog"
import { Button } from "@/components/ui/button"

type Props = {
  open: boolean
  message: string
  confirmLabel?: string
  cancelLabel?: string
  showCancel?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  message,
  confirmLabel = "Aceptar",
  cancelLabel = "Cancelar",
  showCancel = true,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel()
      }}
    >
      <Dialog.Portal keepMounted={false}>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
        <Dialog.Popup
          aria-labelledby="confirm-dialog-title"
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-[#c9a840] bg-white px-10 py-8 shadow-xl outline-none"
        >
          <Dialog.Title
            id="confirm-dialog-title"
            className="mb-7 text-center text-[1.05rem] font-medium leading-snug text-[#2a2a2a]"
          >
            {message}
          </Dialog.Title>
          <div className="flex justify-center gap-4">
            {showCancel && (
              <Button
                variant="outline"
                size="lg"
                className="min-w-[110px] px-6"
                onClick={onCancel}
              >
                {cancelLabel}
              </Button>
            )}
            <Button
              size="lg"
              className="min-w-[110px] bg-[#3a3d4a] px-6 text-white hover:bg-[#2d303c]"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
